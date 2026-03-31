import Image from 'next/image';

export default function AboutFounder() {
  return (
    <section className="section-5" id="about">
      <div className="topo">
        <h3>Sobre o Fundador</h3>
        <p>Conheça a história por trás da Injet Estojo Nobre LTDA</p>
      </div>
      <main className="fundador">
        <div className="container-left-2">
          <Image
            src="/assets/Img - do - Pai.png"
            alt="José Carlos de Almeida"
            width={300}
            height={400}
          />
        </div>
        <div className="container-right-2">
          <div className="box-5">
            <h4>José Carlos de Almeida & Filhos</h4>
            <p className="introducao">
              Fundador da Injet Estojo Nobre LTDA, José Carlos de Almeida construiu sua empresa com base na
              paixão pela qualidade e no compromisso com a excelência.
            </p>
            <p className="apresentation">
              Ao longo dessa trajetória, seus filhos passaram a contribuir ao seu lado, fortalecendo o trabalho
              iniciado por José Carlos e ajudando a manter vivo o padrão de qualidade que sempre guiou a
              empresa.
            </p>
            <p className="icon">Mais de 30 anos de experiência</p>
            <p className="icon">Compromisso com a qualidade</p>
            <p className="icon">Atendimento personalizado</p>
            <div className="quote-box">
              <p className="fala-do-pai">
                "Nossa missão é fornecer estojos de qualidade superior que protegem e valorizam cada relógio,
                construindo relacionamentos duradouros com nossos clientes."
              </p>
              <span>- José Carlos de Almeida</span>
            </div>
          </div>
        </div>
      </main>
    </section>
  );
}
