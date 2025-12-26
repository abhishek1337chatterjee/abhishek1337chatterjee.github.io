import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, Send } from 'lucide-react';

const contactInfo = {
  email: 'abhishek1337chatterjee@gmail.com',
  phone: '+91 8420739602',
  whatsappUrl: 'https://wa.me/918420739602',
};

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('https://getform.io/f/8775dab5-b30d-48fc-9d52-4900b095464c', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert('Message sent successfully!');
        setFormData({ name: '', email: '', message: '' });
      } else {
        alert('Failed to send message. Please try again.');
      }
    } catch {
      alert('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-20 bg-[#0a192f] px-4 lg:px-8 relative overflow-hidden">
      {/* Gradient accent for contact - slightly more prominent as CTA section */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-radial from-[#db2777]/8 via-transparent to-transparent rounded-full blur-2xl" />
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#06b6d4]/5 to-transparent" />
      </div>
      <div className="max-w-4xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-[#ccd6f6] mb-2">Contact</h2>
          <div className="w-20 h-1 bg-[#db2777] mx-auto mb-4" />
          <p className="text-[#8892b0]">
            Submit the form below or{' '}
            <a href={`mailto:${contactInfo.email}`} className="text-[#db2777] hover:underline">
              Email
            </a>{' '}
            me at
          </p>
          <div className="flex items-center justify-center gap-2 text-[#06b6d4]">
            <Mail size={18} />
            <span>{contactInfo.email}</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center mb-8"
        >
          <p className="text-[#8892b0]">
            Connect me via{' '}
            <a
              href={contactInfo.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#db2777] hover:underline"
            >
              WhatsApp or call
            </a>
          </p>
          <div className="flex items-center justify-center gap-2 text-[#06b6d4]">
            <Phone size={18} />
            <span>{contactInfo.phone}</span>
          </div>
        </motion.div>

        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-[#8892b0] text-sm">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your name"
                className="input input-bordered bg-[#112240] border-[#8892b0]/20 focus:border-[#db2777] text-[#ccd6f6] placeholder:text-[#8892b0]/50 w-full"
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[#8892b0] text-sm">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Your email"
                className="input input-bordered bg-[#112240] border-[#8892b0]/20 focus:border-[#db2777] text-[#ccd6f6] placeholder:text-[#8892b0]/50 w-full"
                required
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[#8892b0] text-sm">Message</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Your message"
              className="textarea textarea-bordered bg-[#112240] border-[#8892b0]/20 focus:border-[#db2777] text-[#ccd6f6] placeholder:text-[#8892b0]/50 h-40 w-full"
              required
            />
          </div>

          <div className="flex justify-center">
            <button type="submit" disabled={isSubmitting} className="btn btn-primary gap-2">
              {isSubmitting ? (
                <>
                  <span className="loading loading-spinner loading-sm" />
                  Sending...
                </>
              ) : (
                <>
                  <Send size={18} />
                  Send Message
                </>
              )}
            </button>
          </div>
        </motion.form>
      </div>
    </section>
  );
}
