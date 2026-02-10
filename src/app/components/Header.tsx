import Image from "next/image";
import Link from "next/link";

export default function Header() {
  return (
    <header aria-label="site header">
      <div className="inner">
        <Link href="/" style={{ display:"flex", alignItems:"center", gap:12, textDecoration:"none" }}>
          <Image src="/logo.png" alt="" width={30} height={30} style={{ borderRadius:8 }} />
          <span className="title">ZKProofport</span>
        </Link>
      </div>
    </header>
  );
}
