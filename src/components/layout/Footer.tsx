const sha = import.meta.env.VITE_COMMIT_SHA?.slice(0, 7) ?? 'local';

export default function Footer() {
  return (
    <footer className="border-t border-line px-5 py-8 sm:px-8 lg:px-16">
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-3 font-mono text-xs text-muted">
        <span>
          built by <span className="text-ink">Abhishek Chatterjee</span>
        </span>
        <span className="flex flex-wrap items-center gap-2">
          <span className="flex items-center gap-1.5" style={{ color: 'var(--primary)' }}>
            <span
              className="size-[7px] rounded-full"
              style={{
                background: 'var(--primary)',
                boxShadow: '0 0 8px color-mix(in srgb, var(--primary) 70%, transparent)',
              }}
            />
            200 OK
          </span>
          <span>· region ap-south-1</span>
          {/* commit ref — invisible by default, fades in on hover (a quiet build stamp) */}
          <span
            className="cursor-default opacity-0 transition-opacity duration-300 hover:opacity-100"
            title="build commit"
          >
            · {sha}
          </span>
        </span>
      </div>
    </footer>
  );
}
