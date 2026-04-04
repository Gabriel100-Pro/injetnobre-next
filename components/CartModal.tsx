'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { withBasePath } from '@/lib/withBasePath';

function formatBRL(value: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
}

type PaymentMethod = 'credit' | 'debit' | 'pix';

const paymentsEndpoint = process.env.NEXT_PUBLIC_PAYMENTS_API_URL || '/api/payments';

function normalizeHttpUrl(candidate: string) {
  const trimmed = candidate.trim().replace(/^['\"]|['\"]$/g, '');
  if (!trimmed) return null;

  const withProtocol = /^https?:\/\//i.test(trimmed) || trimmed.startsWith('/') ? trimmed : `https://${trimmed}`;

  try {
    if (withProtocol.startsWith('/')) {
      return withProtocol;
    }

    const url = new URL(withProtocol);
    if (url.protocol !== 'http:' && url.protocol !== 'https:') return null;
    return url.toString();
  } catch {
    return null;
  }
}

function getPaymentsEndpoint() {
  const endpoint = normalizeHttpUrl(paymentsEndpoint);
  if (!endpoint) return null;
  return endpoint;
}

export default function CartModal() {
  const { items, totalItems, totalPrice, removeItem, clearCart, isOpen, closeCart } = useCart();
  const [confirmClear, setConfirmClear] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('credit');
  const [customerEmail, setCustomerEmail] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [pixCode, setPixCode] = useState('');
  const [pixQrBase64, setPixQrBase64] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMessage, setPaymentMessage] = useState('');

  if (!isOpen) return null;

  function handleClear() {
    clearCart();
    setConfirmClear(false);
    setPixCode('');
    setPixQrBase64('');
    setPaymentMessage('');
  }

  function validateEmail() {
    if (!customerEmail || !customerEmail.includes('@')) {
      setPaymentMessage('Informe um e-mail valido para processar o pagamento.');
      return false;
    }

    return true;
  }

  async function createCheckout(method: PaymentMethod) {
    if (!validateEmail()) return null;

    const endpoint = getPaymentsEndpoint();
    if (!endpoint) {
      setPaymentMessage('URL de pagamento invalida. Configure NEXT_PUBLIC_PAYMENTS_API_URL com um endereco valido, por exemplo: https://seu-backend.com/api/payments');
      return null;
    }

    if (typeof window !== 'undefined' && window.location.hostname.includes('github.io') && endpoint === '/api/payments') {
      setPaymentMessage('No GitHub Pages, configure NEXT_PUBLIC_PAYMENTS_API_URL com a URL do seu backend para processar pagamentos.');
      return null;
    }

    setIsProcessing(true);
    setPaymentMessage('Processando pagamento...');

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          method,
          email: customerEmail,
          totalPrice,
          items: items.map((item) => ({
            id: item.id,
            name: item.name,
            quantity: item.quantity,
            unitPrice: item.price,
          })),
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.error || 'Nao foi possivel iniciar o pagamento.');
      }

      setPaymentMessage('');
      return data;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Falha no pagamento.';
      setPaymentMessage(message);
      return null;
    } finally {
      setIsProcessing(false);
    }
  }

  async function copyPixCode() {
    if (!pixCode) return;
    try {
      await navigator.clipboard.writeText(pixCode);
      setPaymentMessage('Codigo Pix copiado para a area de transferencia.');
    } catch {
      setPaymentMessage('Nao foi possivel copiar automaticamente. Copie manualmente o codigo.');
    }
  }

  async function processCardPayment() {
    if (!cardName || cardNumber.replace(/\D/g, '').length < 13 || !cardExpiry || cardCvv.length < 3) {
      setPaymentMessage('Preencha corretamente os dados do cartao para finalizar o pagamento.');
      return;
    }

    const data = await createCheckout(paymentMethod);
    if (!data?.checkoutUrl) return;

    const safeCheckoutUrl = normalizeHttpUrl(data.checkoutUrl);
    if (!safeCheckoutUrl || safeCheckoutUrl.startsWith('/')) {
      setPaymentMessage('Link de checkout invalido. Tente novamente em alguns instantes.');
      return;
    }

    window.location.href = safeCheckoutUrl;
    const cardTypeLabel = paymentMethod === 'credit' ? 'credito' : 'debito';
    setPaymentMessage(`Abrimos o checkout seguro do Mercado Pago para cartao de ${cardTypeLabel}.`);
  }

  async function generatePixPayment() {
    if (totalPrice <= 0) {
      setPaymentMessage('Adicione itens no carrinho para gerar o codigo Pix.');
      return;
    }

    const data = await createCheckout('pix');
    if (data?.checkoutUrl) {
      const safeCheckoutUrl = normalizeHttpUrl(data.checkoutUrl);
      if (!safeCheckoutUrl || safeCheckoutUrl.startsWith('/')) {
        setPaymentMessage('Link de checkout Pix invalido. Tente novamente em alguns instantes.');
        return;
      }

      window.location.href = safeCheckoutUrl;
      return;
    }

    if (!data?.qrCode) return;

    setPixCode(data.qrCode);
    setPixQrBase64(data.qrCodeBase64 || '');
    setPaymentMessage('Codigo Pix gerado com o valor total da compra.');
  }

  function completePixPayment() {
    if (!pixCode) {
      setPaymentMessage('Gere primeiro o codigo Pix para concluir o pagamento.');
      return;
    }

    setPaymentMessage('Pagamento via Pix confirmado. Pedido finalizado com sucesso.');
    clearCart();
    setPixCode('');
    setPixQrBase64('');
  }

  return (
    <div className="cart-modal is-open" id="cart-modal" aria-hidden="false">
      {/* Backdrop */}
      <div className="cart-modal-backdrop" onClick={closeCart} />

      <div className="cart-modal-content" role="dialog" aria-modal="true" aria-labelledby="cart-title">
        {/* Header */}
        <div className="cart-modal-header">
          <h3 id="cart-title">Seu Carrinho</h3>
          <button
            className="cart-close"
            type="button"
            onClick={closeCart}
            aria-label="Fechar carrinho"
          >
            ×
          </button>
        </div>

        <p className="cart-modal-subtitle">Veja os produtos e as quantidades adicionadas.</p>

        {/* Banner de confirmação de limpeza */}
        {confirmClear && (
          <div className="cart-confirm-banner is-visible" aria-hidden="false">
            <p>Tem certeza?</p>
            <div className="cart-confirm-actions">
              <button className="cart-confirm-yes" type="button" onClick={handleClear}>
                Sim, limpar
              </button>
              <button className="cart-confirm-no" type="button" onClick={() => setConfirmClear(false)}>
                Cancelar
              </button>
            </div>
          </div>
        )}

        {/* Lista de itens */}
        {items.length === 0 ? (
          <p className="cart-empty">Seu carrinho está vazio.</p>
        ) : (
          <>
            <ul className="cart-items">
              {items.map(item => (
                <li key={item.id} className="cart-item">
                  <div className="cart-item-top">
                    {item.image ? (
                      <Image
                        className="cart-item-image"
                        src={withBasePath(item.image)}
                        alt={item.imageAlt || item.name}
                        width={64}
                        height={64}
                      />
                    ) : (
                      <div className="cart-item-image cart-item-image-fallback" aria-hidden="true" />
                    )}
                    <div className="cart-item-text">
                      <p className="cart-item-name">{item.name}</p>
                      {item.boxType && (
                        <p className="cart-item-option">Caixa: {item.boxType}</p>
                      )}
                    </div>
                  </div>
                  <div className="cart-item-details">
                    <span>Quantidade: {item.quantity}</span>
                    <span>Unitário: {formatBRL(item.price)}</span>
                    <span>Subtotal: {formatBRL(item.price * item.quantity)}</span>
                    <button
                      className="cart-remove"
                      type="button"
                      onClick={() => removeItem(item.id)}
                    >
                      Remover
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            <div className="cart-summary">
              <p>Total de itens <span>{totalItems}</span></p>
              <p>Valor total <span>{formatBRL(totalPrice)}</span></p>
              <button
                className="cart-clear"
                type="button"
                onClick={() => setConfirmClear(true)}
              >
                Limpar carrinho
              </button>
            </div>

            <div className="cart-payment">
              <h4>Pagamento direto no site</h4>
              <p className="cart-payment-subtitle">Escolha uma forma para concluir o pedido.</p>
              <input
                type="email"
                className="cart-payment-email"
                placeholder="Seu e-mail para pagamento"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
              />

              <div className="cart-payment-methods" role="radiogroup" aria-label="Forma de pagamento">
                <button
                  type="button"
                  className={`cart-payment-option${paymentMethod === 'credit' ? ' active' : ''}`}
                  onClick={() => {
                    setPaymentMethod('credit');
                    setPaymentMessage('');
                    setPixCode('');
                    setPixQrBase64('');
                  }}
                >
                  Cartao de credito
                </button>
                <button
                  type="button"
                  className={`cart-payment-option${paymentMethod === 'debit' ? ' active' : ''}`}
                  onClick={() => {
                    setPaymentMethod('debit');
                    setPaymentMessage('');
                    setPixCode('');
                    setPixQrBase64('');
                  }}
                >
                  Cartao de debito
                </button>
                <button
                  type="button"
                  className={`cart-payment-option${paymentMethod === 'pix' ? ' active' : ''}`}
                  onClick={() => {
                    setPaymentMethod('pix');
                    setPaymentMessage('');
                  }}
                >
                  Pix
                </button>
              </div>

              {(paymentMethod === 'credit' || paymentMethod === 'debit') && (
                <div className="cart-card-form">
                  <input
                    type="text"
                    placeholder="Nome impresso no cartao"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Numero do cartao"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    inputMode="numeric"
                  />
                  <div className="cart-card-row">
                    <input
                      type="text"
                      placeholder="Validade (MM/AA)"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                    />
                    <input
                      type="password"
                      placeholder="CVV"
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value)}
                      inputMode="numeric"
                    />
                  </div>
                  <button type="button" className="cart-pay-button" onClick={processCardPayment} disabled={isProcessing}>
                    {isProcessing ? 'Processando...' : `Pagar ${formatBRL(totalPrice)}`}
                  </button>
                </div>
              )}

              {paymentMethod === 'pix' && (
                <div className="cart-pix-box">
                  <p>Valor do Pix: <strong>{formatBRL(totalPrice)}</strong></p>
                  <button type="button" className="cart-pay-button" onClick={generatePixPayment} disabled={isProcessing}>
                    {isProcessing ? 'Gerando...' : 'Gerar codigo Pix'}
                  </button>
                  {pixCode && (
                    <>
                      {pixQrBase64 && (
                        <img
                          className="cart-pix-qr"
                          src={`data:image/png;base64,${pixQrBase64}`}
                          alt="QR code Pix"
                        />
                      )}
                      <textarea readOnly value={pixCode} className="cart-pix-code" />
                      <div className="cart-pix-actions">
                        <button type="button" className="cart-pix-copy" onClick={copyPixCode}>
                          Copiar codigo
                        </button>
                        <button type="button" className="cart-pix-confirm" onClick={completePixPayment}>
                          Confirmar pagamento
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}

              {paymentMessage && <p className="cart-payment-message">{paymentMessage}</p>}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
