import { useState } from "react";
import { Palette } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const colorThemes = [
  { name: "Vermelho", hue: "0 84% 60%", glowHsl: "0 84% 60%" },
  { name: "Azul", hue: "217 91% 60%", glowHsl: "217 91% 60%" },
  { name: "Verde", hue: "142 71% 45%", glowHsl: "142 71% 45%" },
  { name: "Roxo", hue: "270 70% 60%", glowHsl: "270 70% 60%" },
  { name: "Laranja", hue: "25 95% 53%", glowHsl: "25 95% 53%" },
  { name: "Rosa", hue: "330 80% 60%", glowHsl: "330 80% 60%" },
];

const applyTheme = (theme: typeof colorThemes[0]) => {
  const root = document.documentElement;
  root.style.setProperty("--primary", theme.hue);
  root.style.setProperty("--accent", theme.hue);
  root.style.setProperty("--ring", theme.hue);
  root.style.setProperty("--sidebar-primary", theme.hue);
  root.style.setProperty("--sidebar-ring", theme.hue);
};

const ColorSwitcher = () => {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);

  const handleSelect = (index: number) => {
    setActive(index);
    applyTheme(colorThemes[index]);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.8 }}
            transition={{ duration: 0.25 }}
            className="flex flex-col gap-2 rounded-2xl border border-border bg-card/90 backdrop-blur-xl p-3 shadow-2xl"
          >
            {colorThemes.map((theme, i) => (
              <motion.button
                key={theme.name}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => handleSelect(i)}
                className={`flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-all hover:bg-secondary ${
                  active === i ? "bg-secondary ring-1 ring-primary/50" : ""
                }`}
              >
                <span
                  className={`h-4 w-4 rounded-full ring-2 ring-offset-2 ring-offset-card ${active === i ? "ring-foreground" : "ring-transparent"}`}
                  style={{ backgroundColor: `hsl(${theme.hue})` }}
                />
                <span className="text-foreground">{theme.name}</span>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setOpen(!open)}
        className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg glow-green transition-shadow duration-300 hover:glow-green-strong"
      >
        <Palette size={20} />
      </motion.button>
    </div>
  );
};

export default ColorSwitcher;
