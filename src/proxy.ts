import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Add or remove page names here to control which pages are publicly
// reachable right now. Anything not listed redirects to "/".
// "home" is a special case — it maps to the "/" route.
const allowedPages = ['home', 'movies', 'tv-shows', 'live-tv', 'originals', 'my-list', 'login', 'register', 'help-center'];

const pagePaths: Record<string, string> = {
  home: "/",
  movies: "/movies",
  "tv-shows": "/tv-shows",
  "live-tv": "/live-tv",
  originals: "/originals",
  "my-list": "/my-list",
  login: "/login",
  register: "/register",
  "help-center": "/help-center",
  "contact-us": "/contact-us",
  "terms-of-use": "/terms-of-use",
  "privacy-policy": "/privacy-policy",
};

const allowedPaths = new Set(
  allowedPages.map((page) => pagePaths[page] ?? `/${page}`),
);

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname !== "/" && !allowedPaths.has(pathname)) {
    return NextResponse.redirect(new URL("/", request.url));
  }
  return NextResponse.next();
}

export const config = {
  // Run on every route except static assets and Next's own internals.
  matcher: ["/((?!_next|images|favicon.png).*)"],
};

// Run this code as middleware in Next.js to control access to certain pages based on the allowedPages array. If a user tries to access a page that is not listed in allowedPages, they will be redirected to the home page ("/")
// Run this code as middleware in Next.js to control access to certain pages based ont he allowedPages array. If a user tries to access a page that is not listed in the allowedPages, they will be redirected to the home page ("/").
