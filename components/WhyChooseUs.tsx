import Image from 'next/image';
import { withBasePath } from '@/lib/withBasePath';

export default function WhyChooseUs() {
  return (
    <section className="section-3">
      <div className="box-2">
        <h2>
          Por que Escolher a <span>InjetNobre</span>?
        </h2>
        <p>
          Mais de 30 anos de experiência oferecendo soluções premium para <br />
          proteção de relógios.
        </p>
      </div>

      <main className="apresentation">
        <div className="box-3">
          <div className="img-card">
            <Image
              src={withBasePath('/assets/Relógio.webp')}
              alt="Relógio"
              width={150}
              height={150}
            />
          </div>
          <div className="box-two-box-2">
            <h3>Qualidade Premium</h3>
            <p>
              Materiais de primeira linha e acabamento impecável. Cada estojo é cuidadosamente produzido
              para garantir máxima proteção.
            </p>
          </div>
        </div>

        <div className="box-3">
          <div className="img-card">
            <Image
              src={withBasePath('/assets/Img-Preço.webp')}
              alt="Preço"
              width={150}
              height={150}
            />
          </div>
          <div className="box-two-box-2">
            <h3>Preço Imbatível</h3>
            <p>
              R$ 2,50 por unidade em pedidos a partir de 100 peças. O melhor custo-benefício do mercado
              para revendedores.
            </p>
          </div>
        </div>

        <div className="box-3">
          <div className="img-card">
            <Image
              src={withBasePath('/assets/100 + Unidades minimas.png')}
              alt="100+ unidades"
              width={150}
              height={150}
            />
          </div>
          <div className="box-two-box-2">
            <h3>Vendas em Lote</h3>
            <p>
              Especialistas em vendas B2B. Atendemos revendedores, joalherias e distribuidores com
              agilidade e confiança.
            </p>
          </div>
        </div>

        <div className="banner">
          <h2>
            Fundada por <span>José Carlos de Almeida</span>
          </h2>
          <p>
            Com anos de experiência no mercado de acessórios para relógios, a Injet Estojo Nobre <br />
            LTDA se consolidou como referência em qualidade e confiabilidade.
          </p>
        </div>
      </main>
    </section>
  );
}
