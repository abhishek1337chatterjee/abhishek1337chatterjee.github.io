import { Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="py-8 bg-[#112240] border-t border-[#8892b0]/10">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <p className="text-[#8892b0] flex items-center justify-center gap-2">
          Made with{' '}
          <Heart size={16} className="text-[#db2777] fill-[#db2777] animate-pulse" />{' '}
          by{' '}
          <span className="text-[#ccd6f6] font-semibold">
            Abhishek Chatterjee
          </span>
        </p>
        <p className="text-[#8892b0]/60 text-sm mt-2">
          &copy; {new Date().getFullYear()} All rights reserved.
        </p>
        {import.meta.env.VITE_COMMIT_SHA && (
          <p className="text-[#8892b0]/30 text-xs mt-3 font-mono">
            {import.meta.env.VITE_COMMIT_SHA.slice(0, 7)}
          </p>
        )}
      </div>
    </footer>
  );
}
