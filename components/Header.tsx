'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { withBasePath } from '@/lib/withBasePath';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { totalItems, openCart } = useCart();
  const navRef = useRef<HTMLElement>(null);
  const hamburgerRef = useRef<HTMLButtonElement>(null);

  // Fecha menu ao clicar fora
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        menuOpen &&
        navRef.current &&
        hamburgerRef.current &&
        !navRef.current.contains(e.target as Node) &&
        !hamburgerRef.current.contains(e.target as Node)
      ) {
        setMenuOpen(false);
      }
    }
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [menuOpen]);

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <header className="header">
      {/* Logo */}
      <div className="logo">
        <Image
          src={withBasePath('/assets/Logo Oficial -IN.png')}
          alt="Logo InjetNobre"
          width={50}
          height={50}
        />
        <div className="texto-logo">
          <h1>InjetNobre</h1>
          <p>Injet Estojo Nobre LTDA</p>
        </div>
      </div>

      {/* Botão hambúrguer */}
      <button
        ref={hamburgerRef}
        className={`hamburger${menuOpen ? ' active' : ''}`}
        onClick={() => setMenuOpen(prev => !prev)}
        aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
        aria-expanded={menuOpen}
      >
        <span />
        <span />
        <span />
      </button>

      {/* Navegação */}
      <nav ref={navRef} className={`nav-menu${menuOpen ? ' active' : ''}`}>
        <ul>
          <li><Link href="/#catalog" onClick={closeMenu}>Produtos</Link></li>
          <li><Link href="/#about" onClick={closeMenu}>Sobre</Link></li>
          <li><Link href="/#services" onClick={closeMenu}>Preços</Link></li>
          <li><Link href="/#calc" onClick={closeMenu}>Calcular Quantidade</Link></li>
          <li>
            <a
              href="https://wa.me/5511951146301"
              target="_blank"
              rel="noopener noreferrer"
              onClick={closeMenu}
            >
              Contato
            </a>
          </li>
        </ul>
      </nav>

      {/* Botão carrinho */}
      <button className="btn-pedido" onClick={openCart} aria-label="Ver carrinho">
        <strong>Ver Carrinho</strong>
        <span className="cart-count" aria-live="polite">{totalItems}</span>
      </button>
    </header>
  );
}
