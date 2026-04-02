import Image from 'next/image';
import Link from 'next/link';
import { withBasePath } from '@/lib/withBasePath';

export default function Footer() {
  return (
    <footer>
      <div className="globo-footer">
        <div className="title-footer">
          <div className="img-footer">
            <Image
              src={withBasePath('/assets/Logo Oficial -IN.png')}
              alt="Logo InjetNobre"
              width={50}
              height={50}
            />
          </div>
          <div>
            <h1>InjetNobre</h1>
            <p>Injet Estojo Nobre LTDA</p>
            <p className="text-footer">
              Especialistas em estojos para relógios de alta qualidade. Fundada por José Carlos de Almeida.
            </p>
          </div>
        </div>

        <div className="produtos">
          <p className="information">Produtos</p>
          <Link href="/#catalog">Estojos Premium</Link>
          <Link href="/#catalog">Estojos Clássicos</Link>
          <Link href="/#catalog">Personalizados</Link>
        </div>

        <div className="empresa">
          <p className="information">Empresa</p>
          <Link href="/#about">Sobre Nós</Link>
          <Link href="/#about">Nossa História</Link>
          <a href="https://wa.me/5511951146301" target="_blank" rel="noopener noreferrer">
            Contato
          </a>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2026 InjetNobre. Todos os direitos reservados.</p>
        <div className="footer-social">
          <a
            href="https://www.instagram.com/injet_nobre?igsh=NDZiZTlpc2hjcTdy"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
          >
            Instagram
          </a>
          <a href="mailto:injetnobre@gmail.com" aria-label="E-mail">
            E-mail
          </a>
          <a href="https://wa.me/5511951146301" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
            WhatsApp
          </a>
        </div>
      </div>
    </footer>
  );
}
