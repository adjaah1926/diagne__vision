"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./page.module.css";

// ─── Cloudflare R2 video helper ──────────────────────────────────────────────
// Toutes les vidéos sont hébergées sur Cloudflare R2 (bande passante gratuite).
const R2_BASE = "https://pub-e21127710f8b4a2a8d1978ec39181cf4.r2.dev/";
const R = (filename) => ({
  src: R2_BASE + "Video/" + encodeURIComponent(filename),
  lightboxSrc: R2_BASE + "Video/" + encodeURIComponent(filename),
  poster: R2_BASE + "Video/Thumb/" + encodeURIComponent(filename.replace(/\.mp4$/, ".jpg")),
});

const categories = ["Tout", "Evénementiel", "Cinematic", "Publicité", "Corporate", "Lifestyle"];

const projects = [
  {
    id: 1,
    title: "Evénementiel",
    category: "Evénementiel",
    videos: [
      { name: "Festival IPP",        ...R("ipp__festival_entre_potes.mp4_v1_360p_mhsqtu.mp4") },
      { name: "Kankourang de Mbour", ...R("kankourang_de_mbour_v1_360p_cx9vlt.mp4") },
      { name: "Magal de Touba",      ...R("magal_touba_v1_360p_vr7xfu.mp4") },
    ],
  },
  {
    id: 2,
    title: "Cérémonie",
    category: "Evénementiel",
    year: "2025",
    videos: [
      { name: "Ndiaye's Wedding",                 ...R("ndiaye_wedding.mp4") },
      { name: "Fatima's Wedding",                 ...R("fatima_wedding.mp4") },
      { name: "L'histoire de Mariam et Ibrahima", ...R("mariam_ibrahima.mp4") },
    ],
  },
  {
    id: 3,
    title: "Cinematic",
    category: "Cinematic",
    videos: [
      { name: "Le Regard",          ...R("le_regard_v1_1080p_yawcyv.mp4") },
      { name: "New Era",            ...R("new_era.mp4_v1_1080p_ibwpkn.mp4") },
      { name: "Massalikoul Jinane", ...R("massalikoul_jinane_v1_1080p_xq3xka.mp4") },
    ],
  },
  {
    id: 4,
    title: "Sport",
    category: "Cinematic",
    videos: [
      { name: "Salle de Sport",   ...R("salle_de_sport_v1_360p_sztyjk.mp4") },
      { name: "BTS Athlétisme",   ...R("bts_athlétisme_v1_540p_pproaj.mp4") },
      { name: "Sénégal CAN 2026", ...R("sénégal_-_can_2026_v1_1080p_lvqyac.mp4") },
    ],
  },
  {
    id: 5,
    title: "Institut Polytechnique Panafricain",
    category: "Publicité",
    videos: [
      { name: "Présentation IPP",  ...R("publicite-ipp.mp4_v1__1080p__v1_1080p_qdxycv.mp4") },
      { name: "Projet et valeurs", ...R("ipp_v1_1080p_1_wshckr.mp4") },
      { name: "Valeurs",           ...R("ipp1_v1_1080p_kfzi9p.mp4") },
    ],
  },
  {
    id: 6,
    title: "Hôtels",
    category: "Publicité",
    videos: [
      { name: "Étoile du Lac",          ...R("etoile_du_lac_v1_360p_bnyuom.mp4") },
      { name: "Palm Beach",             ...R("palm_beach_v1_1080p_itbvmj.mp4") },
      { name: "Résidence Sokhna Fatou", ...R("sokhna_fatou_v1_1080p_iu799p.mp4") },
    ],
  },
  {
    id: 7,
    title: "Placement de produit",
    category: "Publicité",
    videos: [
      { name: "Mila collection", ...R("mila.mp4_v1_540p_wb6fdr.mp4") },
      { name: "Splash",          ...R("splash_v1_540p_lskfuu.mp4") },
      { name: "Sucre Mame Boy",  ...R("sucre_mame_boyy_v1_1080p_jqendl.mp4") },
    ],
  },
  {
    id: 8,
    title: "Restaurant",
    category: "Publicité",
    videos: [
      { name: "Grill Factory", ...R("Grill_ganrse.mp4") },
      { name: "Puff puff",     ...R("food_truck.mp4_v1_360p_pvwfz7.mp4") },
      { name: "Evivi",         ...R("evivi_360p_hy6dcy.mp4") },
    ],
  },
  {
    id: 9,
    title: "",
    category: "Corporate",
    videos: [
      { name: "Fondation Lumière de Demain", ...R("fondation_lumière_de_demain_v1_540p_patuk8.mp4") },
      { name: "Cité COUD",                   ...R("cite_coud.mp4") },
      { name: "COUD",                        ...R("coud_v1_1080p_wbrcuc.mp4") },
    ],
  },
  {
    id: 10,
    title: "",
    category: "Lifestyle",
    videos: [
      { name: "Penda's",         ...R("penda_s_v1_1080p_bi2y62.mp4") },
      { name: "Penda Lifestyle", ...R("penda_lifestyle_v1_1080p_ez6n6y.mp4") },
      { name: "Life",            ...R("life_yeo4pd.mp4") },
    ],
  },
];

// ─── VideoCard ────────────────────────────────────────────────────────────────
function VideoCard({ video, onClick, isMobile }) {
  return (
    <motion.div
      className={styles.videoCard}
      whileHover={{ y: -4 }}
      onClick={onClick}
      style={{ cursor: "pointer", position: "relative" }}
    >
      {isMobile ? (
        /* ── MOBILE : miniature (1re image de la vidéo) + bouton play ── */
        <div style={{ position: "relative", width: "100%", aspectRatio: "16/9", overflow: "hidden", background: "#111" }}>
          <img
           src={video.poster}
           alt={video.name}
           loading="lazy"
           decoding="async"
           style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center", display: "block" }}
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
        /* ── DESKTOP : aperçu en lecture automatique ── */
        <>
          <video
            src={video.src}
            autoPlay muted loop playsInline
            preload="metadata"
            style={{ width: "100%", aspectRatio: "16/9", border: "none", display: "block", objectFit: "cover", pointerEvents: "none" }}
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

// ─── Lightbox ────────────────────────────────────────────────────────────────
function Lightbox({ video, onClose, isMobile }) {
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 1000,
        background: "rgba(0,0,0,0.95)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: isMobile ? "0" : "16px",
        overflowY: "auto",
      }}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: isMobile ? "100%" : "900px",
          height: isMobile ? "100dvh" : "auto",
          background: "var(--card-bg)",
          borderRadius: isMobile ? "0" : "12px",
          overflow: "hidden",
          border: "1px solid var(--border)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <div style={{ position: "relative", width: "100%", aspectRatio: "16/9" }}>
          <video
            src={video.lightboxSrc}
            autoPlay
            controls
            playsInline
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", display: "block", background: "#000", objectFit: "contain" }}
          />
        </div>
        <div className={styles.lightboxInfo}>
          <h3 style={{ fontSize: "18px", fontWeight: "700" }}>{video.name}</h3>
          <button
            onClick={onClose}
            style={{
              background: "transparent", border: "1px solid var(--border)",
              color: "var(--gray)", padding: "10px 20px", borderRadius: "100px",
              cursor: "pointer", fontSize: "13px", flexShrink: 0,
            }}
          >Fermer</button>
        </div>
      </motion.div>
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
          <Lightbox
            video={selectedVideo}
            onClose={() => setSelectedVideo(null)}
            isMobile={isMobile}
          />
        )}
      </AnimatePresence>

      {/* ── HERO ── */}
      <section className={styles.heroSection}>
        <div className={styles.heroVideoCol}>
          <video
            autoPlay muted loop playsInline
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", zIndex: 1 }}
          >
            <source
              src={`${R2_BASE}Video/hero_duhazc.mp4`}
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
          <p style={{ color: "var(--accent)", letterSpacing: "4px", fontSize: "12px", marginBottom: "20px", textTransform: "uppercase" }}>À Propos</p>
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
            { title: "Vidéographie & Production",  desc: "Cadrage maîtrisé, mouvements de caméra, storytelling visuel, direction artistique." },
            { title: "Montage & Post-production",  desc: "Montage cinématique, étalonnage, optimisation audio, création de contenus adaptés à différents formats." },
            { title: "Contenu Digital",            desc: "Adaptation des vidéos aux identités de marque, création de contenus lifestyle, sport ou voyage." },
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
          <p style={{ color: "var(--accent)", letterSpacing: "4px", fontSize: "12px", marginBottom: "16px", textTransform: "uppercase" }}>Réalisations</p>
          <h2 style={{ fontSize: "clamp(28px, 4vw, 48px)", fontWeight: "700" }}>Body of Work</h2>
        </motion.div>

        <div className={styles.filterBar}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`${styles.filterBtn} ${activeCategory === cat ? styles.filterBtnActive : ""}`}
            >{cat}</button>
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