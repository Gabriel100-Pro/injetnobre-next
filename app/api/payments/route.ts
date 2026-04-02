import { MercadoPagoConfig, Payment, Preference } from 'mercadopago';

type CheckoutMethod = 'credit' | 'debit' | 'pix';

interface CheckoutItem {
  id: string;
  name: string;
  quantity: number;
  unitPrice: number;
}

interface CheckoutPayload {
  method: CheckoutMethod;
  email: string;
  items: CheckoutItem[];
  totalPrice: number;
}

export const runtime = 'nodejs';

const MP_TOKEN_ENV_KEYS = [
  'MP_ACCESS_TOKEN',
  'MERCADOPAGO_ACCESS_TOKEN',
  'MERCADO_PAGO_ACCESS_TOKEN',
  'NEXT_PUBLIC_MP_ACCESS_TOKEN',
] as const;

function normalizeToken(value: string) {
  return value.trim().replace(/^['\"]|['\"]$/g, '');
}

function getAccessToken() {
  for (const key of MP_TOKEN_ENV_KEYS) {
    const rawValue = process.env[key];
    if (!rawValue) continue;

    const token = normalizeToken(rawValue);
    if (token) return token;
  }

  throw new Error(
    'Token do Mercado Pago nao configurado. Defina MP_ACCESS_TOKEN no .env.local e reinicie o servidor.',
  );
}

function getClient() {
  return new MercadoPagoConfig({
    accessToken: getAccessToken(),
    options: {
      timeout: 10000,
    },
  });
}

function isValidPayload(payload: unknown): payload is CheckoutPayload {
  if (!payload || typeof payload !== 'object') return false;

  const candidate = payload as CheckoutPayload;
  const validMethod = candidate.method === 'credit' || candidate.method === 'debit' || candidate.method === 'pix';
  const validEmail = typeof candidate.email === 'string' && candidate.email.includes('@');
  const validItems = Array.isArray(candidate.items) && candidate.items.length > 0;
  const validTotal = typeof candidate.totalPrice === 'number' && candidate.totalPrice > 0;

  return validMethod && validEmail && validItems && validTotal;
}

function buildTitle(items: CheckoutItem[]) {
  if (items.length === 1) return items[0].name;
  return `Pedido InjetNobre (${items.length} itens)`;
}

async function createCheckoutPreference(
  client: MercadoPagoConfig,
  payload: CheckoutPayload,
  method: 'credit' | 'debit' | 'pix',
) {
  const preference = new Preference(client);

  const excludedPaymentTypes =
    method === 'credit'
      ? [{ id: 'debit_card' }, { id: 'ticket' }, { id: 'bank_transfer' }, { id: 'atm' }]
      : method === 'debit'
        ? [{ id: 'credit_card' }, { id: 'ticket' }, { id: 'bank_transfer' }, { id: 'atm' }]
        : [{ id: 'credit_card' }, { id: 'debit_card' }, { id: 'ticket' }, { id: 'atm' }];

  const prefResult = await preference.create({
    body: {
      items: payload.items.map((item) => ({
        id: item.id,
        title: item.name,
        quantity: item.quantity,
        currency_id: 'BRL',
        unit_price: Number(item.unitPrice.toFixed(2)),
      })),
      payer: {
        email: payload.email,
      },
      payment_methods: {
        excluded_payment_types: excludedPaymentTypes,
      },
      statement_descriptor: 'INJETNOBRE',
    },
  });

  return prefResult;
}

function extractErrorMessage(error: unknown) {
  const pixCapabilityError = 'Collector user without key enabled for QR render';

  if (error instanceof Error && error.message) return error.message;

  if (typeof error === 'object' && error !== null) {
    const candidate = error as {
      message?: unknown;
      cause?: { message?: string } | Array<{ message?: string }>;
      error?: string;
    };

    if (typeof candidate.message === 'string' && candidate.message.trim()) {
      if (candidate.message.includes(pixCapabilityError)) {
        return 'Sua conta Mercado Pago ainda nao esta habilitada para gerar QR Code Pix. Ative o Pix no painel do Mercado Pago (credenciais de teste) e tente novamente.';
      }
      return candidate.message;
    }

    if (Array.isArray(candidate.cause) && candidate.cause[0]?.message) {
      return candidate.cause[0].message;
    }

    if (candidate.cause && !Array.isArray(candidate.cause) && candidate.cause.message) {
      return candidate.cause.message;
    }

    if (typeof candidate.error === 'string' && candidate.error.trim()) {
      return candidate.error;
    }
  }

  return 'Erro interno ao processar pagamento.';
}

export async function POST(request: Request) {
  try {
    const payload = await request.json();

    if (!isValidPayload(payload)) {
      return Response.json({ error: 'Dados de pagamento invalidos.' }, { status: 400 });
    }

    const client = getClient();

    if (payload.method === 'pix') {
      try {
        const payment = new Payment(client);
        const pixResult = await payment.create({
          body: {
            transaction_amount: Number(payload.totalPrice.toFixed(2)),
            description: buildTitle(payload.items),
            payment_method_id: 'pix',
            payer: {
              email: payload.email,
            },
          },
        });

        const txData = pixResult.point_of_interaction?.transaction_data;
        if (txData?.qr_code) {
          return Response.json({
            method: 'pix',
            qrCode: txData.qr_code,
            qrCodeBase64: txData?.qr_code_base64 || '',
          });
        }
      } catch {
        // Some Mercado Pago accounts cannot generate direct QR Pix via Payment API.
      }

      const pixPreference = await createCheckoutPreference(client, payload, 'pix');
      return Response.json({
        method: 'pix',
        checkoutUrl: pixPreference.init_point,
      });
    }

    const prefResult = await createCheckoutPreference(client, payload, payload.method);

    return Response.json({
      method: payload.method,
      checkoutUrl: prefResult.init_point,
    });
  } catch (error) {
    console.error('Erro ao processar pagamento Mercado Pago:', error);
    const message = extractErrorMessage(error);
    return Response.json({ error: message }, { status: 500 });
  }
}
