import { Button } from "@/components/ui/button";
import { ArrowDown, Mail } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchProfile } from "@/lib/api";

const roles = ["Full-Stack", "Front-End", "Back-End", "UI/UX"];

const HeroSection = () => {
  const [roleIndex, setRoleIndex] = useState(0);
  const { data: profile } = useQuery({ queryKey: ["profile"], queryFn: fetchProfile });

  useEffect(() => {
    const interval = setInterval(() => {
      setRoleIndex((prev) => (prev + 1) % roles.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const name = profile?.name ?? "Seu Nome";
  const bio = profile?.bio ?? "Crio experiências digitais incríveis com código limpo e design moderno. Apaixonado por transformar ideias em produtos que fazem a diferença.";
  const title = profile?.title ?? "Desenvolvedor";
  const heroGreeting = profile?.heroGreeting ?? "Hey, eu sou";

  return (
    <section id="hero" className="relative flex min-h-screen items-center pt-20 overflow-hidden">
      {/* Grid background */}
      <div className="absolute inset-0 grid-bg opacity-40" />

      {/* Radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px]" />

      <div className="relative mx-auto grid max-w-6xl gap-12 px-6 md:grid-cols-2 md:items-center">
        {/* Left - Text */}
        <div className="order-2 md:order-1">
          <motion.p
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-primary"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
            Disponível para projetos
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="font-heading text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl lg:text-6xl"
          >
            {heroGreeting}{" "}
            <span className="text-gradient">{name}</span> 👋
          </motion.h1>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-3 flex items-center gap-2"
          >
            <span className="text-lg text-muted-foreground">{title}</span>
            <span className="relative h-8 w-32 overflow-hidden">
              {roles.map((role, i) => (
                <motion.span
                  key={role}
                  className="absolute left-0 font-heading text-lg font-bold text-primary"
                  initial={{ y: 30, opacity: 0 }}
                  animate={{
                    y: roleIndex === i ? 0 : -30,
                    opacity: roleIndex === i ? 1 : 0,
                  }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                >
                  {role}
                </motion.span>
              ))}
            </span>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mt-6 max-w-lg text-base leading-relaxed text-muted-foreground sm:text-lg"
          >
            {bio}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="mt-8 flex flex-wrap gap-4"
          >
            <Button size="lg" className="rounded-full px-8 font-semibold glow-green hover:glow-green-strong transition-all duration-300 hover:scale-105" asChild>
              <a href="#contact">
                <Mail className="mr-2 h-4 w-4" />
                Fale Comigo
              </a>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="rounded-full border-border px-8 font-semibold text-foreground hover:bg-secondary hover:scale-105 transition-all duration-300"
              asChild
            >
              <a href="#projects">
                Ver Portfólio
                <ArrowDown className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </motion.div>
        </div>

        {/* Right - Avatar */}
        <div className="order-1 flex justify-center md:order-2 md:justify-end">
          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <div className="h-64 w-64 overflow-hidden rounded-3xl border border-primary/20 bg-card sm:h-80 sm:w-80 glow-green">
              {profile?.avatarUrl ? (
                <img src={profile.avatarUrl} alt={name} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-7xl">
                  🧑‍💻
                </div>
              )}
            </div>

            {/* Glow behind */}
            <div className="absolute -inset-8 -z-10 rounded-3xl bg-primary/8 blur-3xl" />
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex flex-col items-center gap-2 text-muted-foreground"
        >
          <span className="text-xs">Scroll</span>
          <div className="h-8 w-5 rounded-full border border-muted-foreground/30 flex items-start justify-center p-1">
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="h-1.5 w-1.5 rounded-full bg-primary"
            />
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
