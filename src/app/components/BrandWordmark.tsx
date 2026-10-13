import Image from "next/image";
import styles from "../product.module.css";

export default function BrandWordmark() {
  return <Image src="/brand/zkproofport-wordmark-dark.svg" alt="ZKProofport" width={807} height={180} className={styles.brandWordmark} />;
}
