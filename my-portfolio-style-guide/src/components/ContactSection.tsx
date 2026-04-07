import { Button } from "@/components/ui/button";
import { Github, Linkedin, Mail, Globe, Send, Check } from "lucide-react";
import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchProfile } from "@/lib/api";

function normalizeUrl(url: string): string {
  if (!url) return url;
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  return `https://${url}`;
}

const ContactSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const { data: profile } = useQuery({ queryKey: ["profile"], queryFn: fetchProfile });
  const [emailCopiado, setEmailCopiado] = useState(false);

  function copiarEmail() {
    if (!profile?.email) return;
    navigator.clipboard.writeText(profile.email).then(() => {
      setEmailCopiado(true);
      setTimeout(() => setEmailCopiado(false), 2000);
    });
  }

  function abrirWhatsApp() {
    window.open("https://wa.me/11987278746", "_blank");
  }

  const socials = [
    profile?.githubUrl && {
      icon: Github,
      label: "GitHub",
      href: normalizeUrl(profile.githubUrl),
      color: "group-hover:text-foreground",
      onClick: undefined,
    },
    profile?.linkedinUrl && {
      icon: Linkedin,
      label: "LinkedIn",
      href: normalizeUrl(profile.linkedinUrl),
      color: "group-hover:text-blue-400",
      onClick: undefined,
    },
    profile?.email && {
      icon: emailCopiado ? Check : Mail,
      label: emailCopiado ? "Copiado!" : "Email",
      href: undefined,
      color: emailCopiado ? "text-primary" : "group-hover:text-primary",
      onClick: copiarEmail,
    },
    profile?.websiteUrl && {
      icon: Globe,
      label: "Website",
      href: normalizeUrl(profile.websiteUrl),
      color: "group-hover:text-emerald-400",
      onClick: undefined,
    },
  ].filter(Boolean) as {
    icon: React.ElementType;
    label: string;
    href?: string;
    color: string;
    onClick?: () => void;
  }[];

  return (
    <section id="contact" className="py-20 relative">
      <div className="mx-auto max-w-6xl px-6" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <p className="mb-2 text-sm font-medium uppercase tracking-widest text-primary">
            Contato
          </p>
          <h2 className="font-heading text-3xl font-bold text-foreground sm:text-4xl">
            Vamos Conversar? 💬
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Tem um projeto em mente? Envie uma mensagem e vamos transformar sua ideia em realidade.
          </p>
        </motion.div>

        <div className="grid gap-12 md:grid-cols-2">
          {/* WhatsApp CTA */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="flex flex-col items-center justify-center rounded-2xl border border-border bg-card p-8 sm:p-10 relative overflow-hidden gap-6 text-center"
          >
            <div className="absolute top-0 right-0 w-40 h-40 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="relative flex flex-col items-center gap-4">
              <span className="text-5xl">💬</span>
              <h3 className="font-heading text-xl font-semibold text-foreground">Bora conversar?</h3>
              <p className="text-sm text-muted-foreground max-w-xs">
                Me chama no WhatsApp! Respondo rápido e adoro um bom papo sobre projetos.
              </p>
              <Button
                type="button"
                onClick={abrirWhatsApp}
                className="rounded-full font-semibold glow-green hover:glow-green-strong hover:scale-[1.02] transition-all duration-300 px-8"
                size="lg"
              >
                <Send className="mr-2 h-4 w-4" />
                Enviar Mensagem via WhatsApp
              </Button>
            </div>
          </motion.div>

          {/* Socials */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="flex flex-col justify-center"
          >
            <h3 className="font-heading text-xl font-semibold text-foreground">
              Me encontre nas redes
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Sinta-se à vontade para conectar-se comigo em qualquer plataforma.
            </p>

            {socials.length > 0 ? (
              <div className="mt-8 grid grid-cols-2 gap-4">
                {socials.map((social, i) => {
                  const content = (
                    <motion.div
                      key={social.label}
                      initial={{ opacity: 0, y: 20 }}
                      animate={inView ? { opacity: 1, y: 0 } : {}}
                      transition={{ duration: 0.5, delay: 0.4 + i * 0.1 }}
                      whileHover={{ y: -3, scale: 1.02 }}
                      className="group flex items-center gap-3 rounded-xl border border-border bg-card p-4 transition-all duration-300 hover:border-primary/40 hover:glow-green cursor-pointer"
                    >
                      <social.icon className={`h-5 w-5 text-muted-foreground transition-colors duration-300 ${social.color}`} />
                      <span className="text-sm font-medium text-foreground">
                        {social.label}
                      </span>
                    </motion.div>
                  );

                  if (social.onClick) {
                    return (
                      <div key={social.label} onClick={social.onClick}>
                        {content}
                      </div>
                    );
                  }

                  return (
                    <a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {content}
                    </a>
                  );
                })}
              </div>
            ) : (
              <p className="mt-8 text-sm text-muted-foreground">Nenhuma rede social cadastrada.</p>
            )}

            <motion.div
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ delay: 0.8 }}
              className="mt-8 rounded-2xl border border-border bg-card p-5"
            >
              <p className="text-sm text-muted-foreground leading-relaxed">
                💡 <span className="text-foreground font-medium">Resposta rápida</span> — Geralmente respondo em menos de 24 horas. Vamos criar algo incrível juntos!
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
