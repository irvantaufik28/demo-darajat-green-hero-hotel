import "./page-skeleton.css";

export default function PageSkeleton({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`page-skeleton${compact ? " is-compact" : ""}`} role="status" aria-busy="true" aria-label="Memuat halaman">
      <span className="page-skeleton-header" aria-hidden="true"><i /><i /><i /></span>
      <main className="page-skeleton-content" aria-hidden="true">
        <span className="page-skeleton-line is-short" />
        <span className="page-skeleton-line is-title" />
        <span className="page-skeleton-line is-medium" />
        <div className="page-skeleton-grid">
          <span className="page-skeleton-panel"><i /><i /><i /><i /></span>
          <span className="page-skeleton-panel"><i /><i /><i /></span>
        </div>
      </main>
    </div>
  );
}
