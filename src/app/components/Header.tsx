"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { BrandMark } from "./ProductVisuals";
import BrandWordmark from "./BrandWordmark";
import { resources } from "../resources";
import styles from "../product.module.css";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  const closeMenu = () => setMenuOpen(false);

  return (
    <header className={styles.header} onKeyDown={(event) => {
      if (event.key === "Escape" && menuOpen) {
        closeMenu();
        menuButton.current?.focus();
      }
    }}>
      <div className={styles.headerInner}>
        <Link href="/" className={styles.brand} aria-label="ZKProofport home" onClick={closeMenu}><BrandMark size={44} priority /><BrandWordmark /></Link>
        <button ref={menuButton} type="button" className={styles.menuButton} aria-expanded={menuOpen} aria-controls="product-navigation" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? "Close" : "Menu"}<span aria-hidden="true">{menuOpen ? "−" : "+"}</span></button>
        <nav id="product-navigation" className={`${styles.navigation} ${menuOpen ? styles.navigationOpen : ""}`} aria-label="Main navigation">
          <Link href="/#product" onClick={closeMenu}>Product</Link>
          <Link href="/#giwa" onClick={closeMenu}>Featured Work</Link>
          <Link href="/developers" onClick={closeMenu}>Developers</Link>
          <a href={resources.demo} target="_blank" rel="noopener noreferrer" onClick={closeMenu}>Demo</a>
        </nav>
      </div>
    </header>
  );
}
