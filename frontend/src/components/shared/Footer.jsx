import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Twitter, Linkedin, Instagram, ArrowUp } from 'lucide-react';

const Footer = () => {
  const year = new Date().getFullYear();

  const scrollTop = (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer role="contentinfo" className="mt-16 border-t bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Top: brand + links + social */}
        <div className="flex flex-col gap-8 sm:gap-10 md:flex-row md:items-start md:justify-between">
          {/* Brand */}
          <div className="min-w-[200px]">
            <h2 className="text-xl font-bold tracking-tight">Job Hunt</h2>
            <p className="mt-2 text-sm text-gray-600">Find your next role, faster.</p>
          </div>

          {/* Links (Jobs + Browse in a single line) */}
          <nav aria-label="Footer" className="md:w-auto">
            <p className="text-sm font-semibold text-gray-900">Links</p>
            <div className="mt-3 flex items-center gap-6 whitespace-nowrap">
              <Link to="/jobs" className="text-gray-700 hover:text-indigo-600">
                Jobs
              </Link>
              <Link to="/browse" className="text-gray-700 hover:text-indigo-600">
                Browse
              </Link>
            </div>
          </nav>

          {/* Social */}
          <div className="md:text-right">
            <p className="text-sm font-semibold text-gray-900">Follow</p>
            <div className="mt-3 flex items-center gap-2">
              {[
                { Icon: Github, href: 'https://github.com', label: 'GitHub' },
                { Icon: Twitter, href: 'https://twitter.com', label: 'Twitter' },
                { Icon: Linkedin, href: 'https://www.linkedin.com', label: 'LinkedIn' },
                { Icon: Instagram, href: 'https://instagram.com', label: 'Instagram' },
              ].map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="p-2 rounded-md text-gray-700 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                >
                  <Icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 pt-6 border-t flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
          <p>© {year} Job Hunt. All rights reserved.</p>
          <a
            href="#top"
            onClick={scrollTop}
            className="inline-flex items-center gap-2 hover:text-indigo-600"
            aria-label="Back to top"
            title="Back to top"
          >
            <ArrowUp className="h-4 w-4" />
            Back to top
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
