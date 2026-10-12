"use client";

import { Logo } from "@/components/brand/logo";
import { sectionIds } from "@/config/site";
import { useLanguage } from "@/i18n";
import { LanguageSwitcher, Navbar, TerminalButton, useActiveSection } from "./navbar";

const NAV_SECTIONS = ["about", "experience", "education", "projects", "contact"] as const;
const NAV_IDS = NAV_SECTIONS.map((key) => sectionIds[key]);

export function SiteHeader() {
  const { t } = useLanguage();
  const activeId = useActiveSection(NAV_IDS);

  return (
    <Navbar>
      <Logo />
      <Navbar.Actions>
        <Navbar.Links>
          {NAV_SECTIONS.map((key) => (
            <Navbar.Link key={key} href={`#${sectionIds[key]}`} active={activeId === sectionIds[key]}>
              {t.nav[key]}
            </Navbar.Link>
          ))}
        </Navbar.Links>
        <TerminalButton label={t.nav.terminal} />
        <LanguageSwitcher />
      </Navbar.Actions>
    </Navbar>
  );
}
