"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./page.module.css";

const V = (id) => ({
  src: `https://player.vimeo.com/video/${id}?autoplay=1&muted=1&loop=1&background=1&playsinline=1`,
  lightboxSrc: `https://player.vimeo.com/video/${id}?autoplay=1&playsinline=1`,
  thumbnail: `https://vumbnail.com/${id}.jpg`,
  id,
  type: "vimeo"
});

const categories = ["Tout", "Evénementiel", "Cinematic", "Publicité", "Corporate", "Lifestyle"];

const projects = [
  {
    id: 1,
    title: "Evénementiel",
    category: "Evénementiel",
    videos: [
      { name: "Festival IPP", ...V("1197019404") },
      { name: "Kankourang de Mbour", ...V("1197020077") },
      { name: "Magal de Touba", ...V("1197020227") },
    ]
  },
  {
    id: 2,
    title: "Cérémonie",
    category: "Evénementiel",
    year: "2025",
    videos: [
      { name: "Ndiaye's Wedding", ...V("1197029314") },
      { name: "Fatima's Wedding", ...V("1197027327") },
      { name: "L'histoire de Mariam et Ibrahima", ...V("1197032512") },
    ]
  },
  {
    id: 3,
    title: "Cinematic",
    category: "Cinematic",
    videos: [
      { name: "Le Regard", ...V("1197020131") },
      { name: "New Era", ...V("1197020425") },
      { name: "Massalikoul Jinane", ...V("1197020234") },
    ]
  },
  {
    id: 4,
    title: "Sport",
    category: "Cinematic",
    videos: [
      { name: "Salle de Sport", ...V("1197027417") },
      { name: "BTS Athlétisme", ...V("1197027235") },
      { name: "Sénégal CAN 2026", ...V("1197027415") },
    ]
  },
  {
    id: 5,
    title: "Institut Polytechnique Panafricain",
    category: "Publicité",
    videos: [
      { name: "Présentation IPP", ...V("1197029683") },
      { name: "Projet et valeurs", ...V("1197019936") },
      { name: "Valeurs", ...V("1197019954") },
    ]
  },
  {
    id: 6,
    title: "Hôtels",
    category: "Publicité",
    videos: [
      { name: "Étoile du Lac", ...V("1196992907") },
      { name: "Palm Beach", ...V("1197020465") },
      { name: "Résidence Sokhna Fatou", ...V("1197019460") },
    ]
  },
  {
    id: 7,
    title: "Placement de produit",
    category: "Publicité",
    videos: [
      { name: "Mila collection", ...V("1197020387") },
      { name: "Splash", ...V("1197019461") },
      { name: "Sucre Mame Boy", ...V("1197019463") },
    ]
  },
  {
    id: 8,
    title: "Restaurant",
    category: "Publicité",
    videos: [
      { name: "Grill Factory", ...V("1196993153") },
      { name: "Puff puff", ...V("1196993116") },
      { name: "Evivi", ...V("1196993000") },
    ]
  },
  {
    id: 9,
    title: "",
    category: "Corporate",
    videos: [
      { name: "Fondation Lumière de Demain", ...V("1196993031") },
      { name: "Cité COUD", ...V("1197030354") },
      { name: "COUD", ...V("1197027233") },
    ]
  },
  {
    id: 10,
    title: "",
    category: "Lifestyle",
    videos: [
      { name: "Penda's", ...V("1197020464") },
      { name: "Penda Lifestyle", ...V("1197020466") },
      { name: "Life", ...V("1197020025") },
    ]
  },
];

// VideoCard : iframe sur desktop, miniature sur mobile
function VideoCard({ video, onClick, isMobile }) {
  const containerRef = useRef(null);
  const iframeRef = useRef(null);

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
            } catch (e) {
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
        /* ── MOBILE : miniature + bouton play ── */
        <div style={{ position: "relative", width: "100%", aspectRatio: "16/9", overflow: "hidden", background: "#111" }}>
          <img
            src={video.thumbnail}
            alt={video.name}
            loading="lazy"
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />
          <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.3)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{
              width: "48px", height: "48px", borderRadius: "50%",
              border: "2px solid var(--accent)",
              background: "rgba(201,169,110,0.2)",
              display: "flex", alignItems: "center", justifyContent: "center"
            }}>
              <div style={{ width: 0, height: 0, borderTop: "9px solid transparent", borderBottom: "9px solid transparent", borderLeft: "16px solid var(--accent)", marginLeft: "4px" }} />
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
          <div style={{ position: "absolute", inset: 0, zIndex: 1, cursor: "pointer" }} />
        </>
      )}
      <div className={styles.videoName}>
        <p>{video.name}</p>
      </div>
    </motion.div>
  );
}

export default function Home() {
  const [activeCategory, setActiveCategory] = useState("Tout");
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleNavClick = (id) => {
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const filtered = activeCategory === "Tout"
    ? projects
    : projects.filter((p) => p.category === activeCategory);

  return (
    <main style={{ background: "var(--background)", minHeight: "100vh" }}>

      {/* ── NAVBAR ── */}
      <nav className={`${styles.navbar} ${scrolled ? styles.navbarScrolled : ""}`}>
        <img
          src="/logo.jpeg"
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
          <motion.div className={styles.mobileMenu}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}
          >
            <motion.a initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
              onClick={() => handleNavClick("about")}>À Propos</motion.a>
            <motion.a initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
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
            style={{ position: "fixed", inset: 0, zIndex: 1000, background: "rgba(0,0,0,0.95)",
              display: "flex", alignItems: "center", justifyContent: "center", padding: "16px", overflowY: "auto" }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              style={{ width: "100%", maxWidth: "900px", background: "var(--card-bg)",
                borderRadius: "12px", overflow: "hidden", border: "1px solid var(--border)" }}
            >
              <iframe
                src={selectedVideo.lightboxSrc}
                style={{ width: "100%", height: isMobile ? "250px" : "500px", border: "none", display: "block" }}
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
              />
              <div className={styles.lightboxInfo}>
                <h3 style={{ fontSize: "18px", fontWeight: "700" }}>{selectedVideo.name}</h3>
                <button onClick={() => setSelectedVideo(null)}
                  style={{ background: "transparent", border: "1px solid var(--border)", color: "var(--gray)",
                    padding: "10px 20px", borderRadius: "100px", cursor: "pointer", fontSize: "13px", flexShrink: 0 }}
                >Fermer</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── HERO ── */}
      <section className={styles.heroSection}>
        <div className={styles.heroVideoCol}>

          {/* Miniature en fallback (toujours présente derrière) */}
          <img
            src="/video/hero-thumbnail.jpg"
            alt="hero"
            style={{
              position: "absolute", inset: 0,
              width: "100%", height: "100%",
              objectFit: "cover", zIndex: 0
            }}
          />

          {/* Vidéo native : autoplay sur TOUS les appareils, y compris iOS */}
          <video
            autoPlay
            muted
            loop
            playsInline
            style={{
              position: "absolute", inset: 0,
              width: "100%", height: "100%",
              objectFit: "cover", zIndex: 1
            }}
          >
            <source src="/video/hero.mp4" type="video/mp4" />
          </video>

          {/* Overlay gradient */}
          <div style={{
            position: "absolute", inset: 0, zIndex: 2,
            background: "linear-gradient(to right, rgba(0,0,0,0.2), rgba(0,0,0,0.5))"
          }} />
        </div>

        <div className={styles.heroTextCol}>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}
            style={{ color: "var(--accent)", letterSpacing: "4px", fontSize: "12px", marginBottom: "24px", textTransform: "uppercase" }}
          >Vidéaste</motion.p>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}
            style={{ fontSize: "clamp(36px, 5vw, 72px)", fontWeight: "700", letterSpacing: "-2px", lineHeight: 1, marginBottom: "24px" }}
          >DIAGNE<br />VISION</motion.h1>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.4 }}
            style={{ width: "60px", height: "2px", background: "var(--accent)", marginBottom: "24px" }} />
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.5 }}
            style={{ color: "var(--gray)", fontSize: "15px", lineHeight: 1.8, maxWidth: "340px" }}
          >Chaque image a une âme.<br />Chaque plan, une intention.</motion.p>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.7 }}
            style={{ marginTop: "40px", display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "8px" }}
          >
            <span style={{ color: "var(--gray)", fontSize: "11px", letterSpacing: "2px" }}>SCROLL</span>
            <div style={{ width: "1px", height: "60px", background: "var(--accent)" }} />
          </motion.div>
        </div>
      </section>

      {/* ── À PROPOS ── */}
      <section id="about" className={styles.aboutSection}>
        <motion.div className={styles.aboutText}
          initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} viewport={{ once: true }}
        >
          <p style={{ color: "var(--accent)", letterSpacing: "4px", fontSize: "12px", marginBottom: "20px", textTransform: "uppercase" }}>À Propos</p>
          <h2 style={{ fontSize: "clamp(28px, 4vw, 48px)", fontWeight: "700", lineHeight: 1.2, marginBottom: "24px" }}>
            Explore mon<br />univers visuel
          </h2>
          <p style={{ color: "var(--gray)", lineHeight: 1.8, fontSize: "15px", marginBottom: "16px" }}>
            Je ne filme pas des événements. Je capture des instants qui ne reviendront jamais et je les rends éternels.
          </p>
          <p style={{ color: "var(--gray)", lineHeight: 1.8, fontSize: "15px" }}>
            De Dakar au monde, je crée des visuels qui marquent les esprits, servent les marques et racontent des histoires vraies.
          </p>
        </motion.div>
        <motion.div className={styles.aboutSkills}
          initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} viewport={{ once: true }}
        >
          {[
            { title: "Vidéographie & Production", desc: "Cadrage maîtrisé, mouvements de caméra, storytelling visuel, direction artistique." },
            { title: "Montage & Post-production", desc: "Montage cinématique, étalonnage, optimisation audio, création de contenus adaptés à différents formats." },
            { title: "Contenu Digital", desc: "Adaptation des vidéos aux identités de marque, création de contenus lifestyle, sport ou voyage." },
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
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }}
          style={{ textAlign: "center", marginBottom: "60px" }}
        >
          <p style={{ color: "var(--accent)", letterSpacing: "4px", fontSize: "12px", marginBottom: "16px", textTransform: "uppercase" }}>Réalisations</p>
          <h2 style={{ fontSize: "clamp(28px, 4vw, 48px)", fontWeight: "700" }}>Body of Work</h2>
        </motion.div>

        <div className={styles.filterBar}>
          {categories.map((cat) => (
            <button key={cat} onClick={() => setActiveCategory(cat)}
              className={`${styles.filterBtn} ${activeCategory === cat ? styles.filterBtnActive : ""}`}
            >{cat}</button>
          ))}
        </div>

        <div className={styles.projectsList}>
          {filtered.map((project, i) => (
            <motion.div key={project.id} className={styles.projectBlock}
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
                    onClick={() => setSelectedVideo(video)}
                  />
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer id="contact" style={{ padding: "60px 5%" }}>
        <div className={styles.footerInner}>
          <div>
            <p style={{ fontSize: "20px", fontWeight: "700", marginBottom: "4px", letterSpacing: "2px" }}>
               DIAGNE <span style={{ color: "var(--accent)" }}>VISION </span>
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
                { name: "TikTok", url: "https://www.tiktok.com/@diagne__vision" },
              ].map((r) => (
                <a key={r.name} href={r.url}
                  style={{ color: "var(--accent)", fontSize: "12px", letterSpacing: "1px", textDecoration: "none" }}>
                  {r.name}
                </a>
              ))}
            </div>
          </div>
          <p style={{ width: "100%", textAlign: "center", color: "var(--gray)", fontSize: "12px",
            borderTop: "1px solid var(--border)", paddingTop: "24px" }}>
            © 2026 Diagne Vision — Tous droits réservés
          </p>
        </div>
      </footer>

    </main>
  );
}