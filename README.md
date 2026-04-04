This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Pagamento com Mercado Pago (sandbox)

1. Crie o arquivo `.env.local` na raiz com base no `.env.example`.
2. Defina `MP_ACCESS_TOKEN` com seu token de teste do Mercado Pago.
3. Defina `CORS_ALLOWED_ORIGINS` com os dominios permitidos separados por virgula.
4. Reinicie o servidor (`npm run dev`).

Exemplo:

```env
MP_ACCESS_TOKEN=APP_USR-xxxx
CORS_ALLOWED_ORIGINS=https://gabriel100-pro.github.io,https://injetnobre-next.vercel.app
NEXT_PUBLIC_PAYMENTS_API_URL=https://injetnobre-next.vercel.app/api/payments
```

Fluxo implementado no carrinho:
- `Cartao de credito`: abre checkout seguro do Mercado Pago com filtro para credito.
- `Cartao de debito`: abre checkout seguro do Mercado Pago com filtro para debito.
- `Pix`: gera codigo Pix (copia e cola) e QR code com o valor total da compra.

Observacao: para testes completos, use contas e dados de teste do proprio Mercado Pago.

## Deploy no GitHub Pages

O GitHub Pages hospeda apenas arquivos estaticos. Nesse modo, o Next gera o `index.html` automaticamente na pasta `out/`.

Importante para este projeto:
- O endpoint interno `app/api/payments/route.ts` nao roda no GitHub Pages.
- Para pagamentos funcionarem em producao no Pages, voce precisa de um backend externo e configurar:
	- `NEXT_PUBLIC_PAYMENTS_API_URL=https://seu-backend.com/api/payments`

Este repositorio ja inclui workflow em `.github/workflows/deploy-pages.yml`.

Passos:
1. No GitHub, va em `Settings > Pages` e selecione `GitHub Actions` como source.
2. Em `Settings > Secrets and variables > Actions`, crie o secret:
	 - `NEXT_PUBLIC_PAYMENTS_API_URL` com a URL do backend de pagamentos.
3. No provider do backend (ex: Vercel), configure:
	 - `MP_ACCESS_TOKEN`
	 - `CORS_ALLOWED_ORIGINS` (inclua o dominio do GitHub Pages)
4. Faça push na branch `main`.
5. O workflow vai gerar export estatico e publicar no Pages.

Sem backend externo, o site abre no Pages, mas checkout (credito/debito/pix) nao processa.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
