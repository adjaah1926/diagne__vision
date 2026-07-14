export const metadata = {
  title: "Diagne Vision — Maintenance",
  description:
    "Le portfolio est en cours de mise à jour. Retour très bientôt. Contact : diagnevision08@gmail.com",
};

export default function Maintenance() {
  return (
    <main className="mnt">
      <style>{`
        .mnt {
          min-height: 100svh;
          background: var(--background, #000);
          color: var(--foreground, #fff);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 48px 24px 0;
        }
        .mnt .logo {
          height: 88px;
          width: auto;
          object-fit: contain;
          margin-bottom: 32px;
        }
        .mnt .rec {
          display: flex;
          align-items: center;
          gap: 10px;
          letter-spacing: 4px;
          font-size: 12px;
          font-family: 'Inter', sans-serif;
          color: var(--accent, #C9A96E);
          text-transform: uppercase;
          margin-bottom: 36px;
        }
        .mnt .dot {
          width: 9px;
          height: 9px;
          border-radius: 50%;
          background: var(--accent, #C9A96E);
          animation: mntPulse 1.6s ease-in-out infinite;
        }
        @keyframes mntPulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.2; }
        }
        @media (prefers-reduced-motion: reduce) {
          .mnt .dot { animation: none; }
        }
        .mnt h1 {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(34px, 6vw, 64px);
          font-weight: 600;
          line-height: 1.15;
          margin-bottom: 24px;
          max-width: 640px;
        }
        .mnt h1 em {
          font-style: italic;
          color: var(--accent, #C9A96E);
        }
        .mnt .rule {
          width: 60px;
          height: 2px;
          background: var(--accent, #C9A96E);
          margin-bottom: 24px;
        }
        .mnt .desc {
          font-family: 'Inter', sans-serif;
          max-width: 440px;
          font-size: 15px;
          line-height: 1.8;
          color: var(--gray, #a0a0a0);
          margin-bottom: 40px;
        }
        .mnt .links {
          display: flex;
          gap: 24px;
          flex-wrap: wrap;
          justify-content: center;
          align-items: center;
        }
        .mnt .links a {
          font-family: 'Inter', sans-serif;
          color: var(--accent, #C9A96E);
          font-size: 12px;
          letter-spacing: 2px;
          text-transform: uppercase;
          text-decoration: none;
          border-bottom: 1px solid rgba(201, 169, 110, 0.35);
          padding-bottom: 3px;
          transition: border-color 0.2s ease;
        }
        .mnt .links a:hover,
        .mnt .links a:focus-visible {
          border-color: var(--accent, #C9A96E);
        }
        .mnt footer {
          margin-top: auto;
          padding: 48px 16px 28px;
          font-family: 'Inter', sans-serif;
          font-size: 11px;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.3);
        }
        .mnt footer span { color: var(--accent, #C9A96E); }
      `}</style>

      <img src="/logo.png" alt="Diagne Vision" className="logo" />

      <div className="rec">
        <span className="dot" aria-hidden="true"></span>
        Maintenance en cours
      </div>

      <h1>
        On prépare la <em>prochaine scène</em>.
      </h1>

      <div className="rule" aria-hidden="true"></div>

      <p className="desc">
        Le site est momentanément hors ligne pour une mise à jour
        technique. Les réalisations seront de retour très bientôt.
        Pour toute demande, je reste joignable.
      </p>

      <div className="links">
        <a href="mailto:diagnevision08@gmail.com">Email</a>
        <a href="https://wa.me/221778722627" target="_blank" rel="noreferrer">
          WhatsApp
        </a>
        
          href="https://www.instagram.com/diagne___vision/"
          target="_blank"
          rel="noreferrer"
        >
          Instagram
        </a>
      </div>

      <footer>
        Diagne <span>Vision</span> — Vidéaste • Dakar, Sénégal
      </footer>
    </main>
  );
}