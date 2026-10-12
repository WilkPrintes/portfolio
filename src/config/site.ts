export const siteConfig = {
  name: "Wilk Printes",
  title: "Wilk Printes · Front-end Engineer & Tech Lead",
  description:
    "Wilk Printes: engenheiro front-end e tech lead com React, TypeScript e Next.js. Front-end engineer and tech lead.",
  links: {
    github: "https://github.com/WilkPrintes",
    linkedin: "https://www.linkedin.com/in/wilk-printes/",
    email: "wilkstudy01@gmail.com",
    /** International format, digits only (used to build wa.me links). */
    whatsapp: "5593992387398",
    phone: "+55 93 99238-7398",
    /** Path inside /public. Set to an empty string to hide the download button. */
    resume: "",
  },
} as const;

/** Section anchors, shared by the navbar, the CTAs and the sections themselves. */
export const sectionIds = {
  hero: "inicio",
  about: "sobre",
  experience: "experiencia",
  education: "formacao",
  projects: "projetos",
  contact: "contato",
} as const;

export type SectionKey = keyof typeof sectionIds;

export function whatsappUrl(message?: string) {
  const base = `https://wa.me/${siteConfig.links.whatsapp}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}
