"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./page.module.css";

const V = (id, hash) => {
  const base = hash
    ? `https://player.vimeo.com/video/${id}?h=${hash}`
    : `https://player.vimeo.com/video/${id}`;
  return {
    src: `${base}&autoplay=1&muted=1&loop=1&background=1&playsinline=1`,
    lightboxSrc: `${base}&autoplay=1&loop=1&playsinline=1&title=0&byline=0&portrait=0&pip=0&dnt=1&autopause=0`,
    thumbnail: `https://i.vimeocdn.com/video/${id}_640x360.jpg?r=pad`,
    id,
    type: "vimeo",
  };
};

const categories = ["Tout", "Evénementiel", "Cinematic", "Publicité", "Corporate", "Lifestyle"];

const projects = [
  {
    id: 1,
    title: "Evénementiel",
    category: "Evénementiel",
    videos: [
      { name: "Festival IPP",        ...V("1197019404", "d4f1874a67") },
      { name: "Kankourang de Mbour", ...V("1197020077", "5968e7d26e") },
      { name: "Magal de Touba",      ...V("1197020227", "097f7f24a1") },
    ],
  },
  {
    id: 2,
    title: "Cérémonie",
    category: "Evénementiel",
    year: "2025",
    videos: [
      { name: "Ndiaye's Wedding",                 ...V("1198213193", "1e0d275864") },
      { name: "Fatima's Wedding",                 ...V("1198224228", "dc97f25825") },
      { name: "L'histoire de Mariam et Ibrahima", ...V("1198233916", "05d0bef075") },
    ],
  },
  {
    id: 3,
    title: "Cinematic",
    category: "Cinematic",
    videos: [
      { name: "Le Regard",          ...V("1197020131", "dd70cfbd16") },
      { name: "New Era",            ...V("1197020425", "64cd969c0d") },
      { name: "Massalikoul Jinane", ...V("1197020234", "c5d8c7e862") },
    ],
  },
  {
    id: 4,
    title: "Sport",
    category: "Cinematic",
    videos: [
      { name: "Salle de Sport",   ...V("1198212888", "2befe0b8a9") },
      { name: "BTS Athlétisme",   ...V("1198214059", "98a87dc113") },
      { name: "Sénégal CAN 2026", ...V("1198224103", "1d6282f2bd") },
    ],
  },
  {
    id: 5,
    title: "Institut Polytechnique Panafricain",
    category: "Publicité",
    videos: [
      { name: "Présentation IPP",  ...V("1198213201", "116ac8f757") },
      { name: "Projet et valeurs", ...V("1197019936", "1403cbbc15") },
      { name: "Valeurs",           ...V("1197019954", "9937f11c6f") },
    ],
  },
  {
    id: 6,
    title: "Hôtels",
    category: "Publicité",
    videos: [
      { name: "Étoile du Lac",          ...V("1196992907", "3077b6739d") },
      { name: "Palm Beach",             ...V("1197020465", "8e02d7bc2e") },
      { name: "Résidence Sokhna Fatou", ...V("1198212542", "440c49f80b") },
    ],
  },
  {
    id: 7,
    title: "Placement de produit",
    category: "Publicité",
    videos: [
      { name: "Mila collection", ...V("1197020387", "c630d11732") },
      { name: "Splash",          ...V("1198224101", "3a9ac8cf8d") },
      { name: "Sucre Mame Boy",  ...V("1198224102", "8d9a656677") },
    ],
  },
  {
    id: 8,
    title: "Restaurant",
    category: "Publicité",
    videos: [
      { name: "Grill Factory", ...V("1198238301", "03935d70e8") },
      { name: "Puff puff",     ...V("1196993116", "dcae6d07ad") },
      { name: "Evivi",         ...V("1198224191", "466231d346") },
    ],
  },
  {
    id: 9,
    title: "",
    category: "Corporate",
    videos: [
      { name: "Fondation Lumière de Demain", ...V("1196993031", "3971849049") },
      { name: "Cité COUD",                  ...V("1198213529", "7aaac4afeb") },
      { name: "COUD",                       ...V("1198214167", "74e37b7dea") },
    ],
  },
  {
    id: 10,
    title: "",
    category: "Lifestyle",
    videos: [
      { name: "Penda's",        ...V("1197020464", "ec2fc114a9") },
      { name: "Penda Lifestyle", ...V("1197020466", "324a2d728c") },
      { name: "Life",            ...V("1198237129", "6bf436d55d") },
    ],
  },
];

// ─── VideoCard ────────────────────────────────────────────────────────────────
// Desktop : iframe autoplay en background
// Mobile  : miniature (chargement rapide via wsrv.nl CDN) + bouton play
function VideoCard({ video, onClick, isMobile, priority }) {
  const containerRef = useRef(null);
  const iframeRef    = useRef(null);

  useEffect(() => {
    if (isMobile) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && iframeRef.current) {
            try {
              iframeRef.current.contentWindow.postMessage(
                JSON.stringify({ method: "play" }),
                "https://player.vimeo.com"
              );
            } catch {
              const src = iframeRef.current.src;
              iframeRef.current.src = "";
              setTimeout(() => { if (iframeRef.current) iframeRef.current.src = src; }, 50);
            }
          }
        });
      },
      { threshold: 0.2 }
    );
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [isMobile]);

  return (
    <motion.div
      ref={containerRef}
      className={styles.videoCard}
      whileHover={{ y: -4 }}
      onClick={onClick}
      style={{ cursor: "pointer", position: "relative" }}
    >
      {isMobile ? (
        /* ── MOBILE : miniature CDN rapide + bouton play ── */
        <div style={{ position: "relative", width: "100%", aspectRatio: "16/9", overflow: "hidden", background: "#111" }}>
          <img
            src={video.thumbnail}
            alt={video.name}
            /* Les 6 premières miniatures visibles → eager, le reste → lazy */
            loading={priority ? "eager" : "lazy"}
            decoding="async"
            crossOrigin="anonymous"
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />
          <div style={{
            position: "absolute", inset: 0,
            background: "rgba(0,0,0,0.30)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <div style={{
              width: "52px", height: "52px", borderRadius: "50%",
              border: "2px solid var(--accent)",
              background: "rgba(201,169,110,0.18)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <div style={{
                width: 0, height: 0,
                borderTop: "9px solid transparent",
                borderBottom: "9px solid transparent",
                borderLeft: "17px solid var(--accent)",
                marginLeft: "5px",
              }} />
            </div>
          </div>
        </div>
      ) : (
        /* ── DESKTOP : iframe autoplay ── */
        <>
          <iframe
            ref={iframeRef}
            src={video.src}
            style={{ width: "100%", aspectRatio: "16/9", border: "none", display: "block", pointerEvents: "none" }}
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
          />
          {/* couche transparente pour intercepter le clic */}
          <div style={{ position: "absolute", inset: 0, zIndex: 1, cursor: "pointer" }} />
        </>
      )}
      <div className={styles.videoName}>
        <p>{video.name}</p>
      </div>
    </motion.div>
  );
}

// ─── Page principale ──────────────────────────────────────────────────────────
export default function Home() {
  const [activeCategory, setActiveCategory] = useState("Tout");
  const [selectedVideo,  setSelectedVideo]  = useState(null);
  const [scrolled,       setScrolled]       = useState(false);
  const [menuOpen,       setMenuOpen]       = useState(false);
  const [isMobile,       setIsMobile]       = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Empêche le scroll du body quand la lightbox est ouverte
  useEffect(() => {
    document.body.style.overflow = selectedVideo ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [selectedVideo]);

  const handleNavClick = (id) => {
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const filtered =
    activeCategory === "Tout"
      ? projects
      : projects.filter((p) => p.category === activeCategory);

  return (
    <main style={{ background: "var(--background)", minHeight: "100vh" }}>

      {/* ── NAVBAR ── */}
      <nav className={`${styles.navbar} ${scrolled ? styles.navbarScrolled : ""}`}>
        <img
          src="/logo.png"
          alt="Diagne Vision"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className={styles.navbarLogo}
          style={{ height: "72px", width: "auto", cursor: "pointer" }}
        />
        <ul className={styles.navLinks}>
          <li><a onClick={() => handleNavClick("about")}>À Propos</a></li>
          <li><a onClick={() => handleNavClick("portfolio")}>Réalisations</a></li>
          <li><a onClick={() => handleNavClick("contact")}>Contact</a></li>
        </ul>
        <button
          className={`${styles.hamburger} ${menuOpen ? styles.hamburgerOpen : ""}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
        >
          <span /><span /><span />
        </button>
      </nav>

      {/* ── MOBILE MENU ── */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className={styles.mobileMenu}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <motion.a initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
              onClick={() => handleNavClick("about")}>À Propos</motion.a>
            <motion.a initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.10 }}
              onClick={() => handleNavClick("portfolio")}>Réalisations</motion.a>
            <motion.a initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
              onClick={() => handleNavClick("contact")}>Contact</motion.a>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── LIGHTBOX ── */}
      <AnimatePresence>
        {selectedVideo && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setSelectedVideo(null)}
            style={{
              position: "fixed", inset: 0, zIndex: 1000,
              background: "rgba(0,0,0,0.95)",
              display: "flex", alignItems: "center", justifyContent: "center",
              padding: "16px",
              overflowY: "auto",
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                width: "100%", maxWidth: "900px",
                background: "var(--card-bg)",
                borderRadius: "12px", overflow: "hidden",
                border: "1px solid var(--border)",
              }}
            >
              {/*
                ── Conteneur aspect-ratio ──
                Garantit que l'iframe occupe exactement 16/9
                sur TOUS les écrans, mobile inclus.
                Plus de hauteur fixe → plus d'écran noir.
              */}
              <div style={{ position: "relative", width: "100%", aspectRatio: "16/9" }}>
                <iframe
                  src={selectedVideo.lightboxSrc}
                  style={{
                    position: "absolute", inset: 0,
                    width: "100%", height: "100%",
                    border: "none", display: "block",
                  }}
                  allow="autoplay; fullscreen; picture-in-picture"
                  allowFullScreen
                />
              </div>

              <div className={styles.lightboxInfo}>
                <h3 style={{ fontSize: "18px", fontWeight: "700" }}>{selectedVideo.name}</h3>
                <button
                  onClick={() => setSelectedVideo(null)}
                  style={{
                    background: "transparent",
                    border: "1px solid var(--border)",
                    color: "var(--gray)",
                    padding: "10px 20px",
                    borderRadius: "100px",
                    cursor: "pointer",
                    fontSize: "13px",
                    flexShrink: 0,
                  }}
                >
                  Fermer
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── HERO ── */}
      <section className={styles.heroSection}>
        <div className={styles.heroVideoCol}>
          <video
            autoPlay muted loop playsInline
            style={{
              position: "absolute", inset: 0,
              width: "100%", height: "100%",
              objectFit: "cover", zIndex: 1,
            }}
          >
            <source
              src="https://res.cloudinary.com/dlwymfyzv/video/upload/v1780239433/hero_duhazc.mp4"
              type="video/mp4"
            />
          </video>
          <div style={{
            position: "absolute", inset: 0, zIndex: 2,
            background: "linear-gradient(to right, rgba(0,0,0,0.2), rgba(0,0,0,0.5))",
          }} />
        </div>

        <div className={styles.heroTextCol}>
          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}
            style={{ color: "var(--accent)", letterSpacing: "4px", fontSize: "12px", marginBottom: "24px", textTransform: "uppercase" }}
          >Vidéaste</motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}
            style={{ fontSize: "clamp(36px, 5vw, 72px)", fontWeight: "700", letterSpacing: "-2px", lineHeight: 1, marginBottom: "24px" }}
          >DIAGNE<br />VISION</motion.h1>

          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.4 }}
            style={{ width: "60px", height: "2px", background: "var(--accent)", marginBottom: "24px" }}
          />

          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.5 }}
            style={{ color: "var(--gray)", fontSize: "15px", lineHeight: 1.8, maxWidth: "340px" }}
          >
            Chaque image a une âme.<br />Chaque plan, une intention.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.7 }}
            style={{ marginTop: "40px", display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "8px" }}
          >
            <span style={{ color: "var(--gray)", fontSize: "11px", letterSpacing: "2px" }}>SCROLL</span>
            <div style={{ width: "1px", height: "60px", background: "var(--accent)" }} />
          </motion.div>
        </div>
      </section>

      {/* ── À PROPOS ── */}
      <section id="about" className={styles.aboutSection}>
        <motion.div
          className={styles.aboutText}
          initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }} viewport={{ once: true }}
        >
          <p style={{ color: "var(--accent)", letterSpacing: "4px", fontSize: "12px", marginBottom: "20px", textTransform: "uppercase" }}>
            À Propos
          </p>
          <h2 style={{ fontSize: "clamp(28px, 4vw, 48px)", fontWeight: "700", lineHeight: 1.2, marginBottom: "24px" }}>
            Explore mon<br />univers visuel
          </h2>
          <p style={{ color: "var(--gray)", lineHeight: 1.8, fontSize: "15px", marginBottom: "16px" }}>
            Je suis Cheikh Diagne, vidéaste et réalisateur basé à Dakar, Sénégal. Passionné par l'art de raconter des histoires à travers l'image, je transforme des idées, des moments et des émotions en visuels captivants.
          </p>
          <p style={{ color: "var(--gray)", lineHeight: 1.8, fontSize: "15px" }}>
            Spécialisé dans la couverture d'événements, les contenus de marque, les clips promotionnels et les projets artistiques, je mets ma créativité au service de chaque réalisation pour créer des expériences visuelles qui inspirent et laissent une empreinte durable.
          </p>
        </motion.div>

        <motion.div
          className={styles.aboutSkills}
          initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }} viewport={{ once: true }}
        >
          {[
            { title: "Vidéographie & Production",   desc: "Cadrage maîtrisé, mouvements de caméra, storytelling visuel, direction artistique." },
            { title: "Montage & Post-production",   desc: "Montage cinématique, étalonnage, optimisation audio, création de contenus adaptés à différents formats." },
            { title: "Contenu Digital",             desc: "Adaptation des vidéos aux identités de marque, création de contenus lifestyle, sport ou voyage." },
          ].map((skill, i) => (
            <div key={i} style={{ borderLeft: "2px solid var(--accent)", paddingLeft: "20px" }}>
              <p style={{ fontWeight: "600", marginBottom: "6px", fontSize: "14px" }}>{skill.title}</p>
              <p style={{ color: "var(--gray)", fontSize: "13px", lineHeight: 1.6 }}>{skill.desc}</p>
            </div>
          ))}
        </motion.div>
      </section>

      {/* ── PORTFOLIO ── */}
      <section id="portfolio" className={styles.portfolioSection}>
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }} viewport={{ once: true }}
          style={{ textAlign: "center", marginBottom: "60px" }}
        >
          <p style={{ color: "var(--accent)", letterSpacing: "4px", fontSize: "12px", marginBottom: "16px", textTransform: "uppercase" }}>
            Réalisations
          </p>
          <h2 style={{ fontSize: "clamp(28px, 4vw, 48px)", fontWeight: "700" }}>Body of Work</h2>
        </motion.div>

        <div className={styles.filterBar}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`${styles.filterBtn} ${activeCategory === cat ? styles.filterBtnActive : ""}`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className={styles.projectsList}>
          {filtered.map((project, i) => (
            <motion.div
              key={project.id}
              className={styles.projectBlock}
              initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.1 }} viewport={{ once: true }}
            >
              <div className={styles.projectHeader}>
                <h3 className={styles.projectTitle}>{project.title}</h3>
                <span className={styles.projectMeta}>{project.category} • {project.year}</span>
              </div>

              <div className={styles.videosGrid}>
                {project.videos.map((video, j) => (
                  <VideoCard
                    key={j}
                    video={video}
                    isMobile={isMobile}
                    /* Les 2 premiers projets (6 vidéos) → chargement prioritaire */
                    priority={i < 2}
                    onClick={() => setSelectedVideo(video)}
                  />
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── FOOTER / CONTACT ── */}
      <footer id="contact" style={{ padding: "60px 5%" }}>
        <div className={styles.footerInner}>
          <div>
            <p style={{ fontSize: "20px", fontWeight: "700", marginBottom: "4px", letterSpacing: "2px" }}>
              DIAGNE <span style={{ color: "var(--accent)" }}>VISION</span>
            </p>
            <p style={{ color: "var(--gray)", fontSize: "13px" }}>Vidéaste • Dakar, Sénégal</p>
          </div>

          <div className={styles.footerLinks}>
            <a href="mailto:diagnevision08@gmail.com"
              style={{ color: "var(--gray)", fontSize: "13px", textDecoration: "none" }}>
              diagnevision08@gmail.com
            </a>
            <a href="tel:+221778722627"
              style={{ color: "var(--gray)", fontSize: "13px", textDecoration: "none" }}>
              +221 77 872 26 27
            </a>
            <div style={{ display: "flex", gap: "16px", marginTop: "8px" }}>
              {[
                { name: "Instagram", url: "https://www.instagram.com/diagne___vision/" },
                { name: "TikTok",    url: "https://www.tiktok.com/@diagne__vision"     },
              ].map((r) => (
                <a key={r.name} href={r.url} target="_blank" rel="noreferrer"
                  style={{ color: "var(--accent)", fontSize: "12px", letterSpacing: "1px", textDecoration: "none" }}>
                  {r.name}
                </a>
              ))}
            </div>
          </div>

          <p style={{
            width: "100%", textAlign: "center",
            color: "var(--gray)", fontSize: "12px",
            borderTop: "1px solid var(--border)", paddingTop: "24px",
          }}>
            © 2026 Diagne Vision — Tous droits réservés
          </p>
        </div>
      </footer>

    </main>
  );
}