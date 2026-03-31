'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';

interface ProductCardProps {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  imageAlt: string;
}

export default function ProductCard({ id, name, description, price, image, imageAlt }: ProductCardProps) {
  const { addItem } = useCart();
  const [justAdded, setJustAdded] = useState(false);

  function handleAddToCart() {
    addItem({
      name,
      price,
      quantity: 1,
      image,
      imageAlt,
    });

    // Feedback visual
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1200);
  }

  return (
    <div className="box-1">
      <Image
        src={image}
        alt={imageAlt}
        width={200}
        height={200}
        className="product-image"
      />
      <div className="box-two-box">
        <h3>{name}</h3>
        <p>{description}</p>
        <div className="card-footer">
          <span className="preco">R$ {price.toFixed(2).replace('.', ',')}</span>
          <button
            className={`adi-car-2${justAdded ? ' added' : ''}`}
            onClick={handleAddToCart}
            type="button"
          >
            {justAdded ? 'Adicionado ✓' : 'Adicionar'}
          </button>
        </div>
      </div>
    </div>
  );
}
