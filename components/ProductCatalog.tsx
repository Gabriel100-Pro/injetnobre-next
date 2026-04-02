'use client';

import { useRef, useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import { withBasePath } from '@/lib/withBasePath';

const PRODUCTS = [
  {
    id: '1',
    name: 'Estojo Clássico',
    description: 'Perfeito para um relógio. Acabamento em couro sintético premium.',
    price: 2.50,
    image: withBasePath('/assets/Estojo individual.webp'),
    imageAlt: 'Estojo Clássico',
  },
  {
    id: '2',
    name: 'Estojo Duplo',
    description: 'Capacidade para dois relógios. Design elegante e compacto.',
    price: 2.50,
    image: withBasePath('/assets/Estojo Duplo.webp'),
    imageAlt: 'Estojo Duplo',
  },
  {
    id: '3',
    name: 'Estojo Múltiplo',
    description: 'Para colecionadores. Comporta até 6 relógios com segurança.',
    price: 2.50,
    image: withBasePath('/assets/Estojo Multiplo.webp'),
    imageAlt: 'Estojo Múltiplo',
  },
  {
    id: '4',
    name: 'Estojo Premium Luxo',
    description: 'Acabamento em veludo macio com forro em seda. Para os relógios mais valiosos.',
    price: 3.50,
    image: withBasePath('/assets/Estojo individual.webp'),
    imageAlt: 'Estojo Premium Luxo',
  },
  {
    id: '5',
    name: 'Estojo Viagem',
    description: 'Proteção total com suporte ajustável. Ideal para transportar durante viagens.',
    price: 3.00,
    image: withBasePath('/assets/Estojo Duplo.webp'),
    imageAlt: 'Estojo Viagem',
  },
];

export default function ProductCatalog() {
  const cardsTrack = useRef<HTMLDivElement>(null);
  const [leftDisabled, setLeftDisabled] = useState(true);
  const [rightDisabled, setRightDisabled] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState(0);

  function updateArrowState() {
    if (!cardsTrack.current) return;
    const maxScroll = cardsTrack.current.scrollWidth - cardsTrack.current.clientWidth;
    setLeftDisabled(cardsTrack.current.scrollLeft <= 5);
    setRightDisabled(cardsTrack.current.scrollLeft >= maxScroll - 5);
  }

  function scroll(direction: 'left' | 'right') {
    if (!cardsTrack.current) return;
    const firstCard = cardsTrack.current.querySelector('.box-1') as HTMLElement;
    if (!firstCard) return;

    const cardWidth = firstCard.getBoundingClientRect().width;
    const step = cardWidth + 16; // 16px = gap
    cardsTrack.current.scrollBy({
      left: direction === 'left' ? -step : step,
      behavior: 'smooth',
    });
  }

  useEffect(() => {
    const track = cardsTrack.current;
    if (!track) return;

    track.addEventListener('scroll', updateArrowState);
    updateArrowState();

    return () => track.removeEventListener('scroll', updateArrowState);
  }, []);

  function handlePointerDown(e: React.PointerEvent) {
    if (e.button === 2 || !cardsTrack.current) return;
    if ((e.target as HTMLElement).closest('button, a')) return;

    setIsDragging(true);
    setDragStart(e.clientX);
    cardsTrack.current.style.scrollBehavior = 'auto';
  }

  function handlePointerMove(e: React.PointerEvent) {
    if (!isDragging || !cardsTrack.current) return;
    const delta = e.clientX - dragStart;
    cardsTrack.current.scrollLeft -= delta;
  }

  function handlePointerUp() {
    if (cardsTrack.current) {
      cardsTrack.current.style.scrollBehavior = 'smooth';
    }
    setIsDragging(false);
  }

  return (
    <section className="section-2">
      <div className="container-2">
        <h2>Nossos Estojos Premium</h2>
        <p>
          Qualidade superior para proteger seus relógios mais valiosos. Disponível em
          <br />
          diferentes modelos para atender suas necessidades.
        </p>
      </div>

      <div className="cards-wrapper">
        <button
          className="cards-arrow cards-arrow-left"
          type="button"
          aria-label="Ver produtos anteriores"
          disabled={leftDisabled}
          onClick={() => scroll('left')}
        >
          &#10094;
        </button>

        <div
          ref={cardsTrack}
          className="cards"
          id="catalog"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
        >
          {PRODUCTS.map(product => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>

        <button
          className="cards-arrow cards-arrow-right"
          type="button"
          aria-label="Ver próximos produtos"
          disabled={rightDisabled}
          onClick={() => scroll('right')}
        >
          &#10095;
        </button>
      </div>

      <div className="footer-main">
        <p>Pedido mínimo: 100 unidades | Preço unitário: R$ 2,50</p>
        <button>Fazer Pedido em Lote</button>
      </div>
    </section>
  );
}
