import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchEducation } from "@/lib/api";
import { GraduationCap, CalendarDays } from "lucide-react";

function formatPeriod(start: string, end?: string): string {
  const s = new Date(start).getFullYear();
  const e = end ? new Date(end).getFullYear() : "Atual";
  return `${s} – ${e}`;
}

const EducationSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const { data: items = [], isLoading } = useQuery({ queryKey: ["education"], queryFn: fetchEducation });

  if (!isLoading && items.length === 0) return null;

  return (
    <section id="education" className="py-20 relative">
      <div className="mx-auto max-w-6xl px-6" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <p className="mb-2 text-sm font-medium uppercase tracking-widest text-primary">
            Formação
          </p>
          <h2 className="font-heading text-3xl font-bold text-foreground sm:text-4xl">
            Educação & Formação 🎓
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Minha trajetória acadêmica e de aprendizado.
          </p>
        </motion.div>

        {isLoading && (
          <div className="grid gap-6 sm:grid-cols-2">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="rounded-2xl border border-border bg-card h-40 animate-pulse" />
            ))}
          </div>
        )}

        <div className="grid gap-6 sm:grid-cols-2">
          {items.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -4 }}
              className="group rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5"
            >
              <div className="flex items-start gap-4">
                {item.imageUrl ? (
                  <img
                    src={item.imageUrl}
                    alt={item.institution}
                    className="h-12 w-12 rounded-xl object-cover border border-border flex-shrink-0"
                  />
                ) : (
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-border bg-secondary flex-shrink-0 group-hover:border-primary/40 transition-colors duration-300">
                    <GraduationCap className="h-6 w-6 text-primary" />
                  </div>
                )}

                <div className="min-w-0 flex-1">
                  <h3 className="font-heading text-lg font-semibold text-foreground group-hover:text-primary transition-colors duration-300">
                    {item.degree}
                  </h3>
                  <p className="mt-0.5 text-sm font-medium text-muted-foreground">
                    {item.institution}
                  </p>
                  {item.field && (
                    <p className="mt-0.5 text-xs text-muted-foreground">{item.field}</p>
                  )}
                  <div className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
                    <CalendarDays className="h-3.5 w-3.5" />
                    <span>{formatPeriod(item.startDate, item.endDate)}</span>
                  </div>
                  {item.description && (
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                      {item.description}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EducationSection;
