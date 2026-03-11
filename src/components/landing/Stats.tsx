"use client";

const STATS = [
  { value: "2M+", label: "Happy travelers" },
  { value: "10K+", label: "Tours & activities" },
  { value: "14+", label: "Destinations" },
  { value: "4.8", label: "Average rating", suffix: "/5" },
];

export default function Stats() {
  return (
    <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 border-y border-[var(--border-color)]">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4">
          {STATS.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-4xl sm:text-5xl font-bold text-[var(--text-primary)]">
                {stat.value}
                {stat.suffix && (
                  <span className="text-lg text-[var(--text-secondary)] font-normal">
                    {stat.suffix}
                  </span>
                )}
              </p>
              <p className="mt-2 text-sm text-[var(--text-secondary)]">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
