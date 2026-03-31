# InjetNobre - Migração para Next.js ✅

Bem-vindo à versão Next.js do site InjetNobre! Este projeto foi migrado de HTML/CSS/JavaScript vanilla para React + Next.js.

## 📁 Estrutura do Projeto

```
injetnobre-next/
├── app/
│   ├── layout.tsx          # Layout raiz com Header, CartModal e CartProvider
│   ├── page.tsx            # Página inicial com todas as seções
│   ├── globals.css         # Estilos globais básicos
│   ├── style.css           # Estilos do projeto original (copiado)
│   └── favicon.ico
├── components/
│   ├── Header.tsx          # Cabeçalho com menu hambúrguer
│   ├── CartModal.tsx       # Modal do carrinho
│   ├── HeroSection.tsx     # Seção hero (introdução)
│   ├── ProductCard.tsx     # Card individual de produto
│   ├── ProductCatalog.tsx  # Catálogo com carrossel de produtos
│   ├── WhyChooseUs.tsx     # Seção "Por que escolher"
│   ├── PriceCalculator.tsx # Calculadora de preço
│   ├── AboutFounder.tsx    # Seção sobre o fundador
│   └── Footer.tsx          # Rodapé
├── context/
│   └── CartContext.tsx     # Context do carrinho (estado global)
├── public/
│   └── assets/             # Imagens e assets (copiados)
├── next.config.ts
├── tsconfig.json
├── package.json
└── README.md
```

## 🚀 Como Rodar

### Instalação
```bash
cd injetnobre-next
npm install
```

### Desenvolvimento
```bash
npm run dev
```
Acesse **http://localhost:3000** no navegador.

### Build para produção
```bash
npm run build
npm start
```

## 🎯 Principais Mudanças

### 1. **CartContext (Estado Global)**
- **Antes**: Carrinho gerenciado com `querySelector` e `localStorage` espalhado por `function.js`
- **Agora**: Context API centralizado em `context/CartContext.tsx`
- **Benefício**: Qualquer componente pode acessar `useCart()` e reagir automaticamente às mudanças

### 2. **Componentes Reutilizáveis**
- **Antes**: HTML repetido (ex: 3 cards de produtos escritos 3 vezes)
- **Agora**: `<ProductCard>` renderizado dinamicamente
- **Benefício**: Mais fácil manter e adicionar novos produtos

### 3. **Menu Hambúrguer**
- **Antes**: Manipulação de classes com `classList.toggle()`
- **Agora**: Estado React (`menuOpen`) + efeito para fechar ao clicar fora
- **Benefício**: Mais previsível e fácil de debugar

### 4. **Imagens Otimizadas**
- **Antes**: `<img src="...">` simples
- **Agora**: Componente `<Image>` do Next.js
- **Benefício**: lazy loading, responsive images, otimização automática

## 📱 Como Funciona o Carrinho

### Fluxo:
1. Usuário clica "Adicionar ao Carrinho" em qualquer lugar
2. Componente chama `addItem()` do `useCart()`
3. `CartContext` atualiza o array de `items`
4. `Header.tsx` vê `totalItems` atualizar automaticamente
5. `CartModal.tsx` renderiza os itens quando aberto

### Exemplo de uso:
```tsx
import { useCart } from '@/context/CartContext';

export default function MyComponent() {
  const { addItem, items, totalItems } = useCart();
  
  function handleAdd() {
    addItem({
      name: 'Meu Produto',
      price: 2.50,
      quantity: 1,
      image: '/assets/produto.webp',
    });
  }
  
  return (
    <>
      <button onClick={handleAdd}>Adicionar</button>
      <span>Total no carrinho: {totalItems}</span>
    </>
  );
}
```

## 🔄 Migração Passo a Passo (O que foi feito)

### ✅ Etapa 1: Criar projeto Next.js
- NPM init com TypeScript, App Router, Tailwind

### ✅ Etapa 2: CartContext
- Centralizar lógica do carrinho
- Sincronizar com localStorage
- Fornecer hooks `useCart()`

### ✅ Etapa 3: Header + CartModal
- Migrar menu hambúrguer
- Criar modal interativo
- Badge atualiza automaticamente

### ✅ Etapa 4: Componentes de Seções
- `HeroSection` (section-1)
- `ProductCatalog` (section-2) + `ProductCard`
- `WhyChooseUs` (section-3)
- `PriceCalculator` (section-4)
- `AboutFounder` (section-5)
- `Footer`

### ✅ Etapa 5: Estilos
- Copiar `style.css` original
- Preservar aparência 100% igual

## 📝 Próximas Melhorias Sugeridas

1. **Converter CSS para Tailwind** → Arquivos menores, melhor performance
2. **Adicionar TypeScript mais rigoroso** → `package.json` dos produtos como `const`
3. **Adicionar páginasdinâmicas** → ex: `/produtos/[id]` para detalhe
4. **Integrar com API** → Carrinho sincronizado no servidor
5. **Adicionar checkout** → Integrar stripe/PayPal
6. **SEO** → Meta tags dinâmicas, sitemap, Open Graph

## 🐛 Troubleshooting

### Porta 3000 já está em uso?
```bash
npm run dev -- -p 3001
```

### Imagens não carregam?
- Verifique se `public/assets/` existe
- Reinicie o servidor: `Ctrl+C` e `npm run dev`

### Cache de módulos?
```bash
rm -rf .next
npm run dev
```

## 📞 Contato & Suporte

- WhatsApp: https://wa.me/5511951146301
- Instagram: https://www.instagram.com/injet_nobre
- Email: injetnobre@gmail.com

---

**Migrado em**: 31/03/2026
**Status**: ✅ Totalmente funcional
**Próxima etapa**: Melhorias e novas features!
