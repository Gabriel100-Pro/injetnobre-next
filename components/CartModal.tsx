'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';

function formatBRL(value: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
}

export default function CartModal() {
  const { items, totalItems, totalPrice, removeItem, clearCart, isOpen, closeCart } = useCart();
  const [confirmClear, setConfirmClear] = useState(false);

  if (!isOpen) return null;

  function handleClear() {
    clearCart();
    setConfirmClear(false);
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
                        src={item.image}
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
          </>
        )}
      </div>
    </div>
  );
}
