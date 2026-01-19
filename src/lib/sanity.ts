import { createClient } from '@sanity/client';
import imageUrlBuilder, { type SanityImageSource } from '@sanity/image-url';

// Sanity client configuration
// Project ID and dataset are public (read-only via CDN) - no need for env vars
export const sanityClient = createClient({
  projectId: '1ewtvnrz',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: true,
});

// Image URL builder
const builder = imageUrlBuilder(sanityClient);

export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}

// GROQ queries
export const queries = {
  about: `*[_type == "about"][0]{
    name,
    title,
    location,
    experience,
    bio,
    highlightedPhrases[]{text, color},
    highlights,
    interests,
    "profileImage": profileImage.asset->url
  }`,

  siteSettings: `*[_type == "siteSettings"][0]{
    email,
    phone,
    whatsappUrl,
    "resumeUrl": resumeFile.asset->url,
    openSourceDescription,
    openSourceActivities,
    githubUsername
  }`,

  skills: `*[_type == "skill"] | order(category asc, order asc){
    _id,
    name,
    iconUrl,
    shortName,
    color,
    category
  }`,

  projects: `*[_type == "project"]{
    _id,
    title,
    "slug": slug.current,
    description,
    "image": image.asset->url,
    techStack,
    features,
    responsibilities,
    githubUrl,
    deployedUrl,
    additionalUrls[]{title, url},
    teamSize,
    duration,
    projectType,
    source,
    isDiscontinued,
    hasDemo,
    hasCode
  }`,

  careerPhases: `*[_type == "careerPhase"] | order(order asc){
    _id,
    title,
    role,
    companyName,
    companyWebsite,
    period,
    description,
    highlights,
    isEducation,
    "projects": projects[]->{
      _id,
      title,
      description,
      "image": image.asset->url,
      techStack,
      features,
      responsibilities,
      githubUrl,
      deployedUrl,
      additionalUrls[]{title, url},
      projectType,
      isDiscontinued,
      hasDemo,
      hasCode
    }
  }`,

  socials: `*[_type == "social"] | order(order asc){
    _id,
    name,
    url,
    icon,
    color
  }`,

  // Combined query for chatbot context (all data in one request)
  allContent: `{
    "about": *[_type == "about"][0]{
      name, title, location, experience, bio, highlights, interests
    },
    "settings": *[_type == "siteSettings"][0]{
      email, phone, whatsappUrl, githubUsername,
      openSourceDescription, openSourceActivities
    },
    "skills": *[_type == "skill"] | order(category asc, order asc){ name, iconUrl, shortName, color, category },
    "projects": *[_type == "project"]{
      title, description, techStack, features, deployedUrl, githubUrl, projectType, source
    },
    "career": *[_type == "careerPhase"] | order(order asc){
      title, role, companyName, period, description, highlights, isEducation
    },
    "socials": *[_type == "social"] | order(order asc){ name, url }
  }`,
};

// Type definitions matching Sanity schema
export interface HighlightedPhrase {
  text: string;
  color: 'cyan' | 'pink' | 'green' | 'orange' | 'purple';
}

export interface SanityAbout {
  name: string;
  title: string;
  location?: string;
  experience?: string;
  bio?: string;
  highlightedPhrases?: HighlightedPhrase[];
  highlights?: string[];
  interests?: string[];
  profileImage?: string;
}

export interface SanitySiteSettings {
  email: string;
  phone?: string;
  whatsappUrl?: string;
  resumeUrl?: string;
  openSourceDescription?: string;
  openSourceActivities?: string[];
  githubUsername?: string;
}

export interface SanitySkill {
  _id: string;
  name: string;
  iconUrl?: string;
  shortName?: string;
  color?: string;
  category: 'frontend' | 'backend' | 'cloud' | 'tools';
}

export interface AdditionalUrl {
  title: string;
  url: string;
}

export interface SanityProject {
  _id: string;
  title: string;
  slug: string;
  description: string;
  image?: string;
  techStack: string[];
  features?: string[];
  responsibilities?: string[];
  githubUrl?: string;
  deployedUrl?: string;
  additionalUrls?: AdditionalUrl[];
  teamSize?: number;
  duration?: string;
  projectType: 'showcase' | 'experience' | 'personal';
  source?: 'side-project' | 'masai' | 'professional';
  isDiscontinued?: boolean;
  hasDemo: boolean;
  hasCode: boolean;
}

export interface SanityCareerPhase {
  _id: string;
  title: string;
  role: string;
  companyName?: string;
  companyWebsite?: string;
  period: string;
  description?: string;
  highlights?: string[];
  isEducation?: boolean;
  projects?: SanityProject[];
}

export interface SanitySocial {
  _id: string;
  name: string;
  url: string;
  icon: string;
  color?: string;
}

// Fetch functions
export async function getAbout(): Promise<SanityAbout | null> {
  return sanityClient.fetch(queries.about);
}

export async function getSiteSettings(): Promise<SanitySiteSettings | null> {
  return sanityClient.fetch(queries.siteSettings);
}

export async function getSkills(): Promise<SanitySkill[]> {
  return sanityClient.fetch(queries.skills);
}

export async function getProjects(): Promise<SanityProject[]> {
  return sanityClient.fetch(queries.projects);
}

export async function getCareerPhases(): Promise<SanityCareerPhase[]> {
  return sanityClient.fetch(queries.careerPhases);
}

export async function getSocials(): Promise<SanitySocial[]> {
  return sanityClient.fetch(queries.socials);
}

// For chatbot API - get all content in one request
export async function getAllContent() {
  return sanityClient.fetch(queries.allContent);
}
