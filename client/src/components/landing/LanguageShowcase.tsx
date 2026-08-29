import { motion } from "framer-motion";

const LANGUAGES = [
  { label: "JavaScript", color: "text-[#f0db4f] bg-[#f0db4f]/10 border-[#f0db4f]/25" },
  { label: "Python", color: "text-[#4b8bbe] bg-[#4b8bbe]/10 border-[#4b8bbe]/25" },
  { label: "C++", color: "text-[#00599c] bg-[#00599c]/10 border-[#00599c]/25" },
  { label: "Java", color: "text-[#e76f00] bg-[#e76f00]/10 border-[#e76f00]/25" },
  { label: "TypeScript", color: "text-[#3178c6] bg-[#3178c6]/10 border-[#3178c6]/25" },
  { label: "Go", color: "text-[#00add8] bg-[#00add8]/10 border-[#00add8]/25" },
  { label: "Ruby", color: "text-[#cc342d] bg-[#cc342d]/10 border-[#cc342d]/25" },
  { label: "Rust", color: "text-[#dea584] bg-[#dea584]/10 border-[#dea584]/25" },
];

const LanguagesShowcase = () => {
  return (
    <section className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-col items-center gap-4 rounded-2xl border border-zinc-200 bg-white px-6 py-6 text-center shadow-xl dark:border-zinc-800 dark:bg-zinc-900 sm:py-7"
      >
        <span className="inline-flex items-center gap-1.5 rounded-full border border-[#019bf0]/20 bg-[#019bf0]/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[#019bf0]">
          8 Languages Supported
        </span>

        <div className="flex flex-wrap items-center justify-center gap-2.5">
          {LANGUAGES.map((lang, i) => (
            <motion.span
              key={lang.label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.3, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -2, scale: 1.04 }}
              className={`rounded-full border px-3.5 py-1.5 text-sm font-semibold transition-shadow duration-200 hover:shadow-md ${lang.color}`}
            >
              {lang.label}
            </motion.span>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default LanguagesShowcase;