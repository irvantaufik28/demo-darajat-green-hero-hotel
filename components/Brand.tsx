import Image from "next/image";

type BrandProps = {
  href?: string;
};

export function Brand({ href = "#home" }: BrandProps) {
  return (
    <a className="brand" href={href} aria-label="Hotel Darajat Pass, kembali ke atas">
      <span className="brand-mark" aria-hidden="true">
        <Image src="/images/darajat-pass-logo.png" alt="" width={40} height={40} />
      </span>
      <span className="brand-copy">
        <strong>Hotel Darajat Pass</strong>
        <small>RESORT & HOT SPRING</small>
      </span>
    </a>
  );
}
