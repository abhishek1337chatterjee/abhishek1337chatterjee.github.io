import { motion } from 'framer-motion';

interface SectionDividerProps {
  variant?: 'default' | 'gradient' | 'dots';
}

export default function SectionDivider({ variant = 'default' }: SectionDividerProps) {
  if (variant === 'gradient') {
    return (
      <div className="relative h-px w-full overflow-hidden">
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-[#06b6d4]/50 to-transparent"
          initial={{ x: '-100%' }}
          whileInView={{ x: '100%' }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, ease: 'easeInOut' }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#8892b0]/20 to-transparent" />
      </div>
    );
  }

  if (variant === 'dots') {
    return (
      <div className="flex justify-center gap-2 py-4">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-[#8892b0]/30"
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
          />
        ))}
      </div>
    );
  }

  // Default: simple gradient line
  return (
    <div className="flex justify-center py-2">
      <div className="w-32 h-px bg-gradient-to-r from-transparent via-[#8892b0]/30 to-transparent" />
    </div>
  );
}
