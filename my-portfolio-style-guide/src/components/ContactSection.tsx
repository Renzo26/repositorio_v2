import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Github, Linkedin, Mail, Globe, Send } from "lucide-react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchProfile } from "@/lib/api";

const ContactSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const { data: profile } = useQuery({ queryKey: ["profile"], queryFn: fetchProfile });

  const socials = [
    profile?.githubUrl && { icon: Github, label: "GitHub", href: profile.githubUrl, color: "group-hover:text-foreground" },
    profile?.linkedinUrl && { icon: Linkedin, label: "LinkedIn", href: profile.linkedinUrl, color: "group-hover:text-blue-400" },
    profile?.email && { icon: Mail, label: "Email", href: `mailto:${profile.email}`, color: "group-hover:text-primary" },
    profile?.websiteUrl && { icon: Globe, label: "Website", href: profile.websiteUrl, color: "group-hover:text-emerald-400" },
  ].filter(Boolean) as { icon: React.ElementType; label: string; href: string; color: string }[];

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
          {/* Form */}
          <motion.form
            initial={{ opacity: 0, x: -40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="space-y-5 rounded-2xl border border-border bg-card p-6 sm:p-8 relative overflow-hidden"
            onSubmit={(e) => e.preventDefault()}
          >
            <div className="absolute top-0 right-0 w-40 h-40 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="relative space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <Input
                  placeholder="Seu nome"
                  className="rounded-xl border-border bg-secondary placeholder:text-muted-foreground focus:border-primary/40 focus:glow-green transition-all duration-300"
                />
                <Input
                  type="email"
                  placeholder="Seu email"
                  className="rounded-xl border-border bg-secondary placeholder:text-muted-foreground focus:border-primary/40 transition-all duration-300"
                />
              </div>
              <Input
                placeholder="Assunto"
                className="rounded-xl border-border bg-secondary placeholder:text-muted-foreground focus:border-primary/40 transition-all duration-300"
              />
              <Textarea
                placeholder="Sua mensagem..."
                rows={5}
                className="rounded-xl border-border bg-secondary placeholder:text-muted-foreground focus:border-primary/40 transition-all duration-300 resize-none"
              />
              <Button className="w-full rounded-full font-semibold glow-green hover:glow-green-strong hover:scale-[1.02] transition-all duration-300" size="lg">
                <Send className="mr-2 h-4 w-4" />
                Enviar Mensagem
              </Button>
            </div>
          </motion.form>

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
                {socials.map((social, i) => (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, y: 20 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.5, delay: 0.4 + i * 0.1 }}
                    whileHover={{ y: -3, scale: 1.02 }}
                    className="group flex items-center gap-3 rounded-xl border border-border bg-card p-4 transition-all duration-300 hover:border-primary/40 hover:glow-green"
                  >
                    <social.icon className={`h-5 w-5 text-muted-foreground transition-colors duration-300 ${social.color}`} />
                    <span className="text-sm font-medium text-foreground">
                      {social.label}
                    </span>
                  </motion.a>
                ))}
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
