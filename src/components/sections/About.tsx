import { motion } from 'framer-motion';
import { Download, Briefcase, Cloud, Heart, Terminal } from 'lucide-react';

const highlights = [
  { icon: Briefcase, text: '2+ Years Experience', color: 'text-[#db2777]' },
  { icon: Cloud, text: 'Serverless Engineer', color: 'text-[#06b6d4]' },
  { icon: Terminal, text: 'Linux Enthusiast', color: 'text-[#22c55e]' },
  { icon: Heart, text: 'Open Source Lover', color: 'text-[#f59e0b]' },
];

export default function About() {
  return (
    <section id="about" className="py-20 bg-[#0a192f] px-4 lg:px-8 relative overflow-hidden">
      {/* Subtle gradient accent */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-[#06b6d4]/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-[#db2777]/5 rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />
      </div>
      <div className="max-w-4xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-[#ccd6f6] mb-2 text-center">
            About Me
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-[#db2777] to-[#06b6d4] mx-auto mb-8 rounded-full" />

          {/* Highlight Cards */}
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            {highlights.map((item, index) => (
              <motion.div
                key={item.text}
                className="bg-[#112240] rounded-lg p-4 text-center border border-[#8892b0]/10"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 * index }}
                whileHover={{ scale: 1.05, y: -3 }}
              >
                <item.icon className={`w-6 h-6 mx-auto mb-2 ${item.color}`} />
                <p className="text-[#ccd6f6] text-sm font-medium">{item.text}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Bio */}
          <motion.div
            className="space-y-4 text-[#8892b0] leading-relaxed mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <p>
              I'm a passionate{' '}
              <span className="text-[#db2777] font-semibold">Software Engineer</span> with{' '}
              <span className="text-[#06b6d4] font-semibold">2+ years of experience</span> building
              scalable applications. My journey started as a{' '}
              <span className="text-[#ccd6f6]">Frontend Developer</span>, where I spent a year
              crafting user interfaces with <span className="text-[#06b6d4]">React</span> and
              building production-ready projects.
            </p>

            <p>
              Currently, I'm working as a{' '}
              <span className="text-[#db2777] font-semibold">Serverless Engineer</span> at a{' '}
              <span className="text-[#ccd6f6]">Fintech company</span>, where I architect and build
              cloud-native solutions using <span className="text-[#06b6d4]">AWS services</span>{' '}
              including Lambda, Step Functions, EventBridge, SQS, SNS, Cognito, and SES. I've also
              worked with <span className="text-[#ccd6f6]">Sanity CMS</span> for content management
              and explored <span className="text-[#ccd6f6]">Temporal.io</span> for workflow
              orchestration.
            </p>

            <p>
              Beyond my day job, I'm constantly exploring new technologies. Currently diving into{' '}
              <span className="text-[#06b6d4]">Docker</span> for containerization and{' '}
              <span className="text-[#ccd6f6]">Mockoon</span> for API mocking. I'm a big advocate of{' '}
              <span className="text-[#f59e0b] font-semibold">open source</span> and love working
              with <span className="text-[#22c55e] font-semibold">Linux servers</span>, especially{' '}
              <span className="text-[#ccd6f6]">Ubuntu</span>.
            </p>

            <p>
              When I'm not coding, you'll find me watching cricket, assembling PCs, or exploring to
              open source projects.
            </p>
          </motion.div>

          {/* Download Resume Button */}
          <motion.div
            className="flex justify-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            <motion.a
              href="/Abhishek-Chatterjee-Resume.pdf"
              download
              className="group relative inline-flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="absolute -inset-2 bg-gradient-to-r from-[#db2777] to-[#06b6d4] rounded-lg blur opacity-0 group-hover:opacity-50 transition duration-500" />
              <span className="relative btn btn-accent gap-2">
                <Download size={18} />
                Download Resume
              </span>
            </motion.a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
