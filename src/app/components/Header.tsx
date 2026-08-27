import Image from "next/image";
import Link from "next/link";

export default function Header() {
  return (
    <header aria-label="site header">
      <div className="inner">
        <Link href="/" style={{ display:"flex", alignItems:"center", gap:14, textDecoration:"none" }}>
          <Image src="/logo.png" alt="" width={36} height={36} priority style={{ borderRadius:8 }} />
          <span className="title">ZKProofport</span>
        </Link>
      </div>
    </header>
  );
}
