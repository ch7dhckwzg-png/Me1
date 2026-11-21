import { motion, useScroll } from "motion/react";

import { cn } from "@/lib/utils"

// Local change: the default purple-to-pink gradient is removed (site rule: no purple).
export function ScrollProgress({
  className,
  ref,
  ...props
}) {
  const { scrollYProgress } = useScroll()

  return (
    <motion.div
      ref={ref}
      className={cn(
        "fixed inset-x-0 top-0 z-50 h-px origin-left",
        className
      )}
      style={{
        scaleX: scrollYProgress,
      }}
      {...props}
    />
  )
}
