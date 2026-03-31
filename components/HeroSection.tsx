'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';

export default function HeroSection() {
  const { addItem } = useCart();

  function handleAddToCart() {
    addItem({
      name: 'Estojo Clássico',
      price: 2.50,
      quantity: 1,
      image: '/assets/Estojo individual.webp',
      imageAlt: 'Estojo Clássico',
    });
  }

  return (
    <section className="section-1">
      <div className="container">
        <h2>
          <span>InjetNobre</span>
          <br />
          Estojos Premium <br />
          para relógios
        </h2>
        <p>
          Proteja seus relógios com elegância e qualidade. Estojos profissionais a partir de 100 unidades por
          apenas R$ 2,50 cada.
        </p>
        <button className="adi-car" type="button" onClick={handleAddToCart}>
          Adicionar ao Carrinho
        </button>
        <Link href="/#catalog">
          <button className="cat" type="button">
            Ver Catálogo
          </button>
        </Link>

        <div className="bools">
          <div className="bool">Mínimo 100 unidades</div>
          <div className="bool-2">R$ 2,50 por unidade</div>
        </div>
      </div>
      <Image
        src="/assets/img - inicio.webp"
        alt="Estojo InjetNobre"
        width={400}
        height={400}
        className="hero-image"
      />
    </section>
  );
}
