import Link from "next/link";
import Image from "next/image";
import { footerLinks } from "@/lib/demo-data";

const socialIcons = {
  Instagram: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" />
    </svg>
  ),
  Facebook: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" fill="currentColor" />
      <path
        d="M13.6 21v-7.3h2.4l.4-2.8h-2.8v-1.8c0-.8.2-1.4 1.4-1.4h1.5V5.1c-.3 0-1.1-.1-2.1-.1-2.1 0-3.5 1.3-3.5 3.6v2.3H8.5v2.8h2.4V21h2.7Z"
        fill="var(--color-background)"
      />
    </svg>
  ),
  X: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M4 4l16 16M20 4L4 20" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  ),
  YouTube: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <rect x="2.5" y="5.5" width="19" height="13" rx="4" fill="currentColor" />
      <path d="M10.5 9v6l5.2-3-5.2-3Z" fill="var(--color-background)" />
    </svg>
  ),
  TikTok: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path
        d="M16.5 3c.4 2.2 1.8 3.6 4 3.9v2.9c-1.4 0-2.8-.4-4-1.2v6.1c0 3-2.4 5.3-5.4 5.3S5.7 17.7 5.7 14.7c0-2.9 2.3-5.2 5.1-5.3v3c-1.2.1-2.1 1.1-2.1 2.3 0 1.3 1 2.3 2.3 2.3s2.4-1 2.4-2.3V3h3.1Z"
        fill="currentColor"
      />
    </svg>
  ),
};

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div>
      <p className="font-ui text-sm font-bold uppercase tracking-wide text-text-primary">
        {title}
      </p>
      <ul className="mt-3 space-y-2.5">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="font-body text-sm text-text-secondary transition-colors duration-150 hover:text-accent"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-360 px-4 py-10 sm:px-6 lg:px-10">
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-4 lg:grid-cols-5 lg:items-start lg:gap-x-10">
          <div className="col-span-2 sm:col-span-1 lg:col-span-1">
            <Link href="/" className="inline-flex items-center">
              <Image
                src="/images/novel-tv-logo.png"
                alt="Novel TV"
                width={500}
                height={228}
                className="h-14 w-auto sm:h-16"
              />
            </Link>
            <p className="mt-3 max-w-55 font-body text-sm text-text-secondary">
              Stream unlimited movies, TV shows, and live channels — anytime,
              anywhere, no limits.
            </p>
          </div>

          <FooterColumn title="Browse" links={footerLinks.browse} />
          <FooterColumn title="Help" links={footerLinks.help} />
          <FooterColumn title="Account" links={footerLinks.account} />

          <div className="col-span-2 sm:col-span-4 lg:col-span-1">
            <p className="font-ui text-sm font-bold uppercase tracking-wide text-text-primary">
              Follow Novel TV
            </p>
            <div className="mt-3 flex items-center gap-3">
              {Object.entries(socialIcons).map(([label, icon]) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-full text-text-primary transition-colors duration-150 hover:text-accent"
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        <p className="mt-10 text-center font-body text-xs text-text-muted">
          © {new Date().getFullYear()} Novel TV. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}
