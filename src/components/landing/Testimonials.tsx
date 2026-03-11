"use client";

const TESTIMONIALS = [
  {
    name: "Sarah M.",
    location: "United Kingdom",
    text: "The AI chat made planning our Dubai trip so effortless. It recommended the perfect desert safari and Burj Khalifa tour within minutes. Absolutely loved it!",
    rating: 5,
    avatar: "SM",
  },
  {
    name: "James T.",
    location: "Australia",
    text: "I was skeptical about an AI travel assistant, but it nailed every recommendation. Found us an amazing deal on a Singapore city tour that we never would have discovered on our own.",
    rating: 5,
    avatar: "JT",
  },
  {
    name: "Priya K.",
    location: "India",
    text: "Booked a Bali package through the chatbot in under 5 minutes. The whole family had an incredible time. Will definitely use Rayna Tours again for our next vacation.",
    rating: 5,
    avatar: "PK",
  },
];

function StarRating({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <svg
          key={i}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="w-4 h-4 text-amber-400"
        >
          <path
            fillRule="evenodd"
            d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401Z"
            clipRule="evenodd"
          />
        </svg>
      ))}
    </div>
  );
}

export default function Testimonials() {
  return (
    <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-[var(--bg-secondary)]">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-14">
          <p className="text-sm font-semibold uppercase tracking-widest text-amber-500 dark:text-amber-400 mb-3">
            Testimonials
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[var(--text-primary)] leading-tight">
            What travelers say
          </h2>
        </div>

        {/* Testimonial cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {TESTIMONIALS.map((t) => (
            <div
              key={t.name}
              className="p-6 sm:p-8 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-color)] flex flex-col"
            >
              <StarRating count={t.rating} />
              <p className="mt-4 text-sm sm:text-base text-[var(--text-primary)] leading-relaxed flex-1">
                &ldquo;{t.text}&rdquo;
              </p>
              <div className="mt-6 flex items-center gap-3 pt-4 border-t border-[var(--border-color)]">
                <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-500/20 flex items-center justify-center text-amber-700 dark:text-amber-400 text-sm font-bold">
                  {t.avatar}
                </div>
                <div>
                  <p className="text-sm font-semibold text-[var(--text-primary)]">
                    {t.name}
                  </p>
                  <p className="text-xs text-[var(--text-secondary)]">
                    {t.location}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
