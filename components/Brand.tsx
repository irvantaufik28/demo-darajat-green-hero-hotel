import Image from "next/image";

type BrandProps = {
  href?: string;
};

export function Brand({ href = "#home" }: BrandProps) {
  return (
    <a className="brand" href={href} aria-label="Green Hero Darajat, kembali ke atas">
      <span className="brand-mark" aria-hidden="true">
        <Image src="/images/green-hero-logo.png" alt="" width={40} height={40} />
      </span>
      <span className="brand-copy">
        <strong>Green Hero Darajat</strong>
        <small>RESORT & HOT SPRING</small>
      </span>
    </a>
  );
}
