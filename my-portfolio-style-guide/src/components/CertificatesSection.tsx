import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchCertificates } from "@/lib/api";
import { Award, CalendarDays, ExternalLink } from "lucide-react";

function formatDate(date: string): string {
  return new Date(date).toLocaleDateString("pt-BR", { month: "short", year: "numeric" });
}

const CertificatesSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const { data: items = [], isLoading } = useQuery({ queryKey: ["certificates"], queryFn: fetchCertificates });

  if (!isLoading && items.length === 0) return null;

  return (
    <section id="certificates" className="py-20 relative">
      <div className="mx-auto max-w-6xl px-6" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <p className="mb-2 text-sm font-medium uppercase tracking-widest text-primary">
            Certificados
          </p>
          <h2 className="font-heading text-3xl font-bold text-foreground sm:text-4xl">
            Certificações & Conquistas 🏆
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Cursos e certificações que complementam minha formação.
          </p>
        </motion.div>

        {isLoading && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="rounded-2xl border border-border bg-card h-36 animate-pulse" />
            ))}
          </div>
        )}

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -4 }}
              className="group rounded-2xl border border-border bg-card p-5 transition-all duration-300 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5"
            >
              <div className="flex items-start gap-3">
                {item.imageUrl ? (
                  <img
                    src={item.imageUrl}
                    alt={item.issuer}
                    className="h-10 w-10 rounded-lg object-cover border border-border flex-shrink-0"
                  />
                ) : (
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-secondary flex-shrink-0 group-hover:border-primary/40 transition-colors duration-300">
                    <Award className="h-5 w-5 text-primary" />
                  </div>
                )}

                <div className="min-w-0 flex-1">
                  <h3 className="font-heading text-base font-semibold text-foreground group-hover:text-primary transition-colors duration-300 leading-snug">
                    {item.title}
                  </h3>
                  <p className="mt-0.5 text-xs font-medium text-muted-foreground">{item.issuer}</p>
                  <div className="mt-1.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                    <CalendarDays className="h-3 w-3" />
                    <span>{formatDate(item.issuedDate)}</span>
                    {item.expiryDate && <span>– {formatDate(item.expiryDate)}</span>}
                  </div>
                  {item.description && (
                    <p className="mt-2 text-xs leading-relaxed text-muted-foreground line-clamp-2">
                      {item.description}
                    </p>
                  )}
                  {item.credentialUrl && (
                    <a
                      href={item.credentialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 inline-flex items-center gap-1 text-xs text-primary hover:underline"
                    >
                      <ExternalLink className="h-3 w-3" />
                      Ver credencial
                    </a>
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

export default CertificatesSection;
