import type { ReactNode } from "react";
import styles from "../product.module.css";

export default function ResourceLink({ href, children, className }: { href: string; children: ReactNode; className?: string }) {
  return <a href={href} className={className ?? styles.editorialLink} target="_blank" rel="noopener noreferrer">{children}</a>;
}
