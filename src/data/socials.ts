import { Github, Linkedin, Mail, FileText } from 'lucide-react';

export interface Social {
  name: string;
  url: string;
  icon: typeof Github;
  color: string;
}

export const socials: Social[] = [
  {
    name: 'LinkedIn',
    url: 'https://www.linkedin.com/in/abhishekchatterjee-saheb1337/',
    icon: Linkedin,
    color: 'bg-[#0077B5]',
  },
  {
    name: 'GitHub',
    url: 'https://github.com/abhishek1337chatterjee',
    icon: Github,
    color: 'bg-[#333]',
  },
  {
    name: 'Email',
    url: 'mailto:abhishek1337chatterjee@gmail.com',
    icon: Mail,
    color: 'bg-[#25D366]',
  },
  {
    name: 'Resume',
    url: '/Abhishek-Chatterjee-Resume.pdf',
    icon: FileText,
    color: 'bg-gray-600',
  },
];

export const contactInfo = {
  email: 'abhishek1337chatterjee@gmail.com',
  phone: '+91 8420739602',
  whatsappUrl: 'https://wa.me/918420739602',
};
