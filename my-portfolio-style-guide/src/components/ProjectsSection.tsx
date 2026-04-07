import { ExternalLink, Github, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchProjects, type Project } from "@/lib/api";

const EMOJIS = ["🛒", "✅", "📊", "💬", "🚀", "🎯", "🔧", "💡"];
const COLORS = [
  "from-primary/20 to-emerald-600/10",
  "from-blue-500/20 to-cyan-500/10",
  "from-purple-500/20 to-pink-500/10",
  "from-orange-500/20 to-yellow-500/10",
];

const ProjectModal = ({ project, onClose }: { project: Project; onClose: () => void }) => (
  <AnimatePresence>
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 20 }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-lg rounded-2xl border border-border bg-card shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Imagem ou gradiente */}
        {project.imageUrl ? (
          <div className="h-52 overflow-hidden">
            <img src={project.imageUrl} alt={project.title} className="w-full h-full object-cover" />
          </div>
        ) : (
          <div className="h-52 flex items-center justify-center bg-gradient-to-br from-primary/20 to-emerald-600/10">
            <span className="text-7xl">🚀</span>
          </div>
        )}

        {/* Botão fechar */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 rounded-full bg-black/50 p-1.5 text-white hover:bg-black/80 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="p-6 space-y-4">
          <h3 className="font-heading text-2xl font-bold text-foreground">{project.title}</h3>

          <p className="text-sm leading-relaxed text-muted-foreground">{project.description}</p>

          {project.technologies.length > 0 && (
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest mb-2">Tecnologias</p>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tag) => (
                  <span key={tag} className="rounded-full border border-border bg-secondary px-3 py-1 text-xs text-muted-foreground">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            {project.repoUrl && (
              <Button size="sm" variant="outline" className="rounded-full" asChild>
                <a href={project.repoUrl} target="_blank" rel="noopener noreferrer">
                  <Github className="mr-1.5 h-3.5 w-3.5" /> Ver Código
                </a>
              </Button>
            )}
            {project.demoUrl && (
              <Button size="sm" className="rounded-full glow-green" asChild>
                <a href={project.demoUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="mr-1.5 h-3.5 w-3.5" /> Ver Demo
                </a>
              </Button>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  </AnimatePresence>
);

const ProjectsSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const { data: projects = [], isLoading } = useQuery({ queryKey: ["projects"], queryFn: fetchProjects });
  const [projetoSelecionado, setProjetoSelecionado] = useState<Project | null>(null);

  return (
    <section id="projects" className="py-20 relative">
      <div className="mx-auto max-w-6xl px-6" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <p className="mb-2 text-sm font-medium uppercase tracking-widest text-primary">
            Portfólio
          </p>
          <h2 className="font-heading text-3xl font-bold text-foreground sm:text-4xl">
            Projetos em Destaque 🔥
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Uma seleção dos meus trabalhos mais recentes e impactantes.
          </p>
        </motion.div>

        {isLoading && (
          <div className="grid gap-6 sm:grid-cols-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="rounded-2xl border border-border bg-card h-80 animate-pulse" />
            ))}
          </div>
        )}

        {!isLoading && projects.length === 0 && (
          <p className="text-center text-muted-foreground">Nenhum projeto cadastrado ainda.</p>
        )}

        {projetoSelecionado && (
          <ProjectModal project={projetoSelecionado} onClose={() => setProjetoSelecionado(null)} />
        )}

        <div className="grid gap-6 sm:grid-cols-2">
          {projects.map((project, i) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 50 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.15, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -6 }}
              onClick={() => setProjetoSelecionado(project)}
              className="group relative rounded-2xl border border-border bg-card overflow-hidden transition-all duration-500 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5 cursor-pointer"
            >
              {/* Image or gradient */}
              {project.imageUrl ? (
                <div className="h-48 overflow-hidden">
                  <img
                    src={project.imageUrl}
                    alt={project.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
              ) : (
                <div className={`flex h-48 items-center justify-center bg-gradient-to-br ${COLORS[i % COLORS.length]} relative overflow-hidden`}>
                  <motion.span
                    className="text-6xl relative z-10"
                    whileHover={{ scale: 1.2, rotate: 10 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    {EMOJIS[i % EMOJIS.length]}
                  </motion.span>
                  <div className="absolute inset-0 grid-bg opacity-30" />
                </div>
              )}

              <div className="p-6">
                <h3 className="font-heading text-xl font-semibold text-foreground group-hover:text-primary transition-colors duration-300">
                  {project.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {project.description}
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  {project.technologies.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-border bg-secondary px-3 py-1 text-xs text-muted-foreground transition-colors duration-300 group-hover:border-primary/20 group-hover:text-foreground"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="mt-5 flex gap-3" onClick={(e) => e.stopPropagation()}>
                  {project.repoUrl && (
                    <Button size="sm" variant="outline" className="rounded-full text-xs hover:border-primary/40 transition-all duration-300" asChild>
                      <a href={project.repoUrl} target="_blank" rel="noopener noreferrer">
                        <Github className="mr-1.5 h-3.5 w-3.5" />
                        Código
                      </a>
                    </Button>
                  )}
                  {project.demoUrl && (
                    <Button size="sm" className="rounded-full text-xs glow-green hover:glow-green-strong transition-all duration-300" asChild>
                      <a href={project.demoUrl} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="mr-1.5 h-3.5 w-3.5" />
                        Demo
                      </a>
                    </Button>
                  )}
                  <Button size="sm" variant="ghost" className="rounded-full text-xs ml-auto text-muted-foreground">
                    Ver detalhes →
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
