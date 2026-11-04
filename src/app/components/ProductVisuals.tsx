import Image from "next/image";
import BrandWordmark from "./BrandWordmark";
import styles from "../product.module.css";

/* Connectors share a 1.5px stroke and a 5px arrowhead. SVG coordinates are
   unscaled CSS pixels; layout, rather than offsets, sets the node centers. */
function VerticalConnector({ directed = false }: { directed?: boolean }) {
  return (
    <svg className={styles.verticalConnector} width="24" height="56" viewBox="0 0 24 56" fill="none" aria-hidden="true" focusable="false">
      <path d={directed ? "M12 0v55" : "M12 0v56"} />
      {directed && <path d="m7 50 5 5 5-5" />}
    </svg>
  );
}

export function BrandMark({ size = 40, priority = false }: { size?: number; priority?: boolean }) {
  return <Image src="/logo.png" alt="" width={size} height={size} priority={priority} className={styles.brandMark} />;
}

export function HeroProof() {
  return (
    <figure className={styles.heroProof} aria-label="Private input passes through ZKProofport to become an eligibility proof">
      <div className={styles.privateSample}>
        <span className={styles.diagramLabel}>Private input</span>
        <div className={styles.hiddenLines} aria-hidden="true"><i /><i /><i /></div>
      </div>
      <VerticalConnector />
      <div className={styles.heroTransform}><BrandMark size={104} priority /><BrandWordmark /></div>
      <VerticalConnector directed />
      <div className={styles.publicSample}>
        <span className={styles.diagramLabel}>Eligibility proof</span>
        <p className={styles.heroPredicate}>ELIGIBLE <span>= TRUE</span></p>
      </div>
    </figure>
  );
}
