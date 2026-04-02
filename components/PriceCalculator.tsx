'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { withBasePath } from '@/lib/withBasePath';

const BOX_TYPES = ['Estojo Clássico', 'Estojo Duplo', 'Estojo Múltiplo'] as const;
const BOX_IMAGES: Record<string, string> = {
  'Estojo Clássico': withBasePath('/assets/Estojo individual.webp'),
  'Estojo Duplo': withBasePath('/assets/Estojo Duplo.webp'),
  'Estojo Múltiplo': withBasePath('/assets/Estojo Multiplo.webp'),
};

const PRICE_PER_UNIT = 2.50;
const MIN_QUANTITY = 100;

function formatBRL(value: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
}

export default function PriceCalculator() {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(MIN_QUANTITY);
  const [selectedBox, setSelectedBox] = useState<typeof BOX_TYPES[number]>('Estojo Clássico');
  const [justAdded, setJustAdded] = useState(false);
  const [error, setError] = useState('');

  const total = quantity * PRICE_PER_UNIT;

  function handleQuantityChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = Number(e.target.value);
    if (isNaN(value) || value < 0) {
      setQuantity(0);
      setError('');
      return;
    }

    if (value < MIN_QUANTITY) {
      setError(`Quantidade mínima é ${MIN_QUANTITY} unidades`);
      setQuantity(value);
    } else {
      setError('');
      setQuantity(Math.floor(value));
    }
  }

  function handleCalculate() {
    if (quantity < MIN_QUANTITY) {
      setError(`Quantidade mínima é ${MIN_QUANTITY} unidades`);
      return;
    }
    setError('');
  }

  function handleAddToCart() {
    if (quantity < MIN_QUANTITY) {
      setError(`Quantidade mínima é ${MIN_QUANTITY} unidades`);
      return;
    }

    addItem({
      name: 'Pedido em Lote',
      boxType: selectedBox,
      price: PRICE_PER_UNIT,
      quantity,
      image: BOX_IMAGES[selectedBox] || '',
      imageAlt: selectedBox,
    });

    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1000);
    
    // Reset formulário
    setQuantity(MIN_QUANTITY);
    setSelectedBox('Estojo Clássico');
    setError('');
  }

  return (
    <section className="section-4">
      <div className="box-4">
        <h2>Preços e Condições</h2>
        <p>Estojos de qualidade com preços competitivos para seu negócio</p>
      </div>

      <main className="calculo-compra" id="calc">
        {/* Informações de preço */}
        <div className="calculo-left">
          <h3>R$ {PRICE_PER_UNIT.toFixed(2).replace('.', ',')}</h3>
          <p>por unidade</p>
          <p>Venda mínima: {MIN_QUANTITY} unidades</p>
          <p>Qualidade premium garantida</p>
          <p>Entrega para todo o Brasil</p>
        </div>

        {/* Calculadora */}
        <div className="calculo-right">
          <div className="calculo-right-elements">
            <Image
              src={withBasePath('/assets/Img-calculo.png')}
              alt="Imagem da calculadora"
              width={300}
              height={300}
            />
            <div className="texts">
              <label htmlFor="qnt" className="quantidade">
                Quantidade (mín. {MIN_QUANTITY})
              </label>
              <input
                id="qnt"
                className="qnt-peça"
                type="number"
                value={quantity}
                onChange={handleQuantityChange}
                min={MIN_QUANTITY}
              />
              {error && <p className="error-message">{error}</p>}

              <label htmlFor="box-select" className="quantidade">
                Escolha o modelo da caixa
              </label>
              <select
                id="box-select"
                className="box-type-select"
                value={selectedBox}
                onChange={e => setSelectedBox(e.target.value as typeof BOX_TYPES[number])}
              >
                {BOX_TYPES.map(box => (
                  <option key={box} value={box}>
                    {box}
                  </option>
                ))}
              </select>

              <div className="total-button">
                <div className="total">
                  <p>Total:</p>
                  <span className="total-value">{formatBRL(total)}</span>
                </div>
                <button className="calculate-valor" type="button" onClick={handleCalculate}>
                  Calcular Preço
                </button>
                <button
                  className={`add-calc-cart${justAdded ? ' added' : ''}`}
                  type="button"
                  onClick={handleAddToCart}
                >
                  {justAdded ? 'Adicionado ✓' : 'Adicionar ao Carrinho'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </section>
  );
}
