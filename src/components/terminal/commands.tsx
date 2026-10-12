import type { ReactNode } from "react";
import { siteConfig, whatsappUrl } from "@/config/site";
import type { Dictionary } from "@/i18n";

const { links } = siteConfig;

function ExternalLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noreferrer" className="text-accent underline underline-offset-4">
      {children}
    </a>
  );
}

type Command = (t: Dictionary) => ReactNode;

const commands: Record<string, Command> = {
  help: (t) => (
    <ul>
      {Object.entries(t.terminal.commands).map(([name, description]) => (
        <li key={name}>
          <span className="inline-block w-28 text-accent">{name}</span>
          <span className="text-muted">{description}</span>
        </li>
      ))}
    </ul>
  ),
  whoami: (t) => t.terminal.whoami,
  experience: (t) => (
    <ul>
      {t.experience.items.map((job) => (
        <li key={job.company}>
          <span className="text-muted">{job.period}</span> {job.role} @{" "}
          <span className="text-accent">{job.company}</span>
        </li>
      ))}
    </ul>
  ),
  stack: (t) => (
    <ul>
      {t.about.skills.map((group) => (
        <li key={group.group}>
          <span className="text-accent">{group.group}:</span> {group.items.join(", ")}
        </li>
      ))}
    </ul>
  ),
  contact: () => (
    <ul>
      <li>
        e-mail: <ExternalLink href={`mailto:${links.email}`}>{links.email}</ExternalLink>
      </li>
      <li>
        whatsapp: <ExternalLink href={whatsappUrl()}>{links.phone}</ExternalLink>
      </li>
      <li>
        linkedin: <ExternalLink href={links.linkedin}>wilk-printes</ExternalLink>
      </li>
      <li>
        github: <ExternalLink href={links.github}>WilkPrintes</ExternalLink>
      </li>
    </ul>
  ),
  hire: (t) => (
    <span>
      {t.terminal.hire} <ExternalLink href={`mailto:${links.email}`}>{links.email}</ExternalLink>
    </span>
  ),
};

export function runCommand(name: string, t: Dictionary): ReactNode {
  const command = commands[name];
  return command ? command(t) : `${name}: ${t.terminal.notFound}`;
}
