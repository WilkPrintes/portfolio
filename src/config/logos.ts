import type { IconType } from "react-icons";
import { FaLinkedinIn, FaWallet } from "react-icons/fa6";
import { TbCube3dSphere } from "react-icons/tb";
import {
  Si42,
  SiC,
  SiCplusplus,
  SiCss,
  SiDocker,
  SiEthereum,
  SiEthers,
  SiGit,
  SiGithub,
  SiGmail,
  SiGreensock,
  SiHtml5,
  SiJavascript,
  SiLinux,
  SiMqtt,
  SiNextdotjs,
  SiNodedotjs,
  SiReact,
  SiSpotify,
  SiTailwindcss,
  SiTypescript,
  SiVercel,
  SiWagmi,
  SiWhatsapp,
} from "react-icons/si";

export type ImageLogo = { kind: "image"; src: string; width: number; height: number };
export type IconLogo = { kind: "icon"; icon: IconType; color: string };
export type Logo = ImageLogo | IconLogo;

const image = (src: string, width: number, height: number): ImageLogo => ({ kind: "image", src, width, height });
const icon = (component: IconType, color: string): IconLogo => ({ kind: "icon", icon: component, color });

/** Company logos, keyed by the company name used in the dictionaries. */
export const companyLogos: Record<string, ImageLogo> = {
  Kotai: image("/logos/kotai.webp", 256, 256),
  Zenbytes: image("/logos/zenbytes.webp", 236, 236),
  "Robert Bosch GmbH": image("/logos/bosch-white.webp", 256, 256),
};

/** Project logos, keyed by the project name used in the dictionaries. */
export const projectLogos: Record<string, Logo> = {
  Kotaidex: image("/logos/kotaidex-wordmark.webp", 420, 96),
  "Kotai Project": image("/logos/kotai.webp", 256, 256),
  Zenbroker: image("/logos/zenbytes.webp", 236, 236),
  "God of War III para PC": image("/logos/gow3.webp", 128, 128),
  "God of War III for PC": image("/logos/gow3.webp", 128, 128),
  "Spotify Clone": icon(SiSpotify, "#1ed760"),
  cub3D: icon(Si42, "#ececee"),
};

/** Technologies shown in the stack logo loop. */
export const techLogos: { name: string; icon: IconType; color: string }[] = [
  { name: "React", icon: SiReact, color: "#61dafb" },
  { name: "Next.js", icon: SiNextdotjs, color: "#ececee" },
  { name: "TypeScript", icon: SiTypescript, color: "#3178c6" },
  { name: "JavaScript", icon: SiJavascript, color: "#f7df1e" },
  { name: "Node.js", icon: SiNodedotjs, color: "#5fa04e" },
  { name: "Tailwind CSS", icon: SiTailwindcss, color: "#38bdf8" },
  { name: "GSAP", icon: SiGreensock, color: "#88ce02" },
  { name: "Ethereum", icon: SiEthereum, color: "#8c8cff" },
  { name: "MQTT", icon: SiMqtt, color: "#c87dff" },
  { name: "HTML5", icon: SiHtml5, color: "#e34f26" },
  { name: "CSS", icon: SiCss, color: "#663399" },
  { name: "Git", icon: SiGit, color: "#f05032" },
  { name: "Docker", icon: SiDocker, color: "#2496ed" },
  { name: "Vercel", icon: SiVercel, color: "#ececee" },
  { name: "C", icon: SiC, color: "#a8b9cc" },
  { name: "C++", icon: SiCplusplus, color: "#00599c" },
  { name: "Linux", icon: SiLinux, color: "#fcc624" },
];

export const contactIcons = {
  whatsapp: SiWhatsapp,
  email: SiGmail,
  linkedin: FaLinkedinIn,
  github: SiGithub,
} satisfies Record<string, IconType>;

/**
 * Monochrome icon for each technology named in the dictionaries' `stack` lists.
 * Technologies without an official mark use a generic icon (their name is still exposed as a label).
 */
export const techIcons: Record<string, IconType> = {
  React: SiReact,
  "Next.js": SiNextdotjs,
  TypeScript: SiTypescript,
  JavaScript: SiJavascript,
  "Node.js": SiNodedotjs,
  Tailwind: SiTailwindcss,
  MQTT: SiMqtt,
  wagmi: SiWagmi,
  "ethers.js": SiEthers,
  RainbowKit: FaWallet,
  C: SiC,
  "C++": SiCplusplus,
  Raycasting: TbCube3dSphere,
};
