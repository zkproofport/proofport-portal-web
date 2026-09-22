import styles from "../product.module.css";

export default function AppDownloads() {
  return (
    <div className={styles.appDownloads} id="download">
      <p>Get the ZKProofport mobile app</p>
      <div className={styles.storeLinks}>
        <a href="https://apps.apple.com/kr/app/zkproofport/id6803903114" target="_blank" rel="noopener noreferrer" aria-label="Download ZKProofport for iOS on the App Store">iOS · App Store <span aria-hidden="true">↗</span></a>
        <a href="https://play.google.com/store/apps/details?id=com.masselabs.zkproofport&hl=ko" target="_blank" rel="noopener noreferrer" aria-label="Download ZKProofport for Android on Google Play">Android · Google Play <span aria-hidden="true">↗</span></a>
      </div>
    </div>
  );
}
