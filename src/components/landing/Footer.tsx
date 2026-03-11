export default function Footer() {
  return (
    <footer className="border-t border-[var(--border-color)] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
          <span>&copy; {new Date().getFullYear()} Rayna Tours. All rights reserved.</span>
        </div>
        <div className="flex items-center gap-6 text-sm">
          <a
            href="https://www.raynatours.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
          >
            raynatours.com
          </a>
          <a
            href="https://www.raynatours.com/about"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
          >
            About
          </a>
        </div>
      </div>
    </footer>
  );
}
