import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface AnimationWrapperProps {
  stepKey: number;
  direction: 1 | -1;
  children: ReactNode;
}

export default function AnimationWrapper({
  stepKey,
  children,
}: AnimationWrapperProps) {
  return (
    <motion.div
      key={stepKey}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      {children}
    </motion.div>
  );
}
