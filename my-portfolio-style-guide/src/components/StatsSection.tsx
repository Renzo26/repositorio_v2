import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchProfile } from "@/lib/api";

const AnimatedCounter = ({ target, suffix, inView }: { target: number; suffix: string; inView: boolean }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 2000;
    const isDecimal = target % 1 !== 0;
    const step = target / (duration / 16);

    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(isDecimal ? Math.round(start * 10) / 10 : Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [inView, target]);

  const display = target % 1 !== 0 ? count.toFixed(1) : count.toLocaleString();

  return (
    <span>
      {display}{suffix}
    </span>
  );
};

const StatsSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const { data: profile } = useQuery({ queryKey: ["profile"], queryFn: fetchProfile });

  const stats = [
    { value: profile?.hoursOfCode ?? 0, suffix: "+", label: "Horas de Código", emoji: "⏳" },
    { value: profile?.projectsDelivered ?? 0, suffix: "+", label: "Projetos Entregues", emoji: "🚀" },
    { value: profile?.satisfactionRate ?? 0, suffix: "%", label: "Satisfação", emoji: "😊" },
    { value: profile?.averageRating ?? 0, suffix: "", label: "Avaliação Média", emoji: "⭐" },
  ];

  return (
    <section className="py-20 relative">
      <div className="mx-auto max-w-6xl px-6" ref={ref}>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -4, scale: 1.02 }}
              className="group rounded-2xl border border-border bg-card p-6 text-center transition-all duration-300 hover:border-primary/40 hover:glow-green cursor-default"
            >
              <span className="mb-2 block text-2xl transition-transform duration-300 group-hover:scale-125">{stat.emoji}</span>
              <p className="font-heading text-3xl font-bold text-foreground sm:text-4xl">
                <AnimatedCounter target={stat.value} suffix={stat.suffix} inView={inView} />
              </p>
              <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
