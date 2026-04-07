import { motion } from "framer-motion";

const Footer = () => {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className="border-t border-border py-8"
    >
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 sm:flex-row">
        <p className="font-heading text-sm font-semibold text-foreground">
          <span className="text-primary">&lt;</span>Dev <span className="text-primary">/&gt;</span>
        </p>
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} — Feito com 💙 e muito café
        </p>
      </div>
    </motion.footer>
  );
};

export default Footer;
