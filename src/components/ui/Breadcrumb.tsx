interface BreadcrumbProps {
  region?: string;
  tier?: string;
  version?: string;
}

// Telemetry breadcrumb: service / region … / tier … / vNN (mono).
export default function Breadcrumb({
  region = 'ap-south-1',
  tier = 'serverless',
  version,
}: BreadcrumbProps) {
  return (
    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-xs text-muted sm:text-sm">
      <span style={{ color: 'var(--primary)' }}>●</span>
      <span>service</span>
      <span className="text-muted/40">/</span>
      <span>
        region <span className="text-ink">{region}</span>
      </span>
      <span className="text-muted/40">/</span>
      <span>
        tier <span className="text-ink">{tier}</span>
      </span>
      {version && (
        <>
          <span className="text-muted/40">/</span>
          <span className="text-ink">{version}</span>
        </>
      )}
    </div>
  );
}
