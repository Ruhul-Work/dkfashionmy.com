import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

/* Logo preloader: DK logo reveals with a stepped beat, then curtain lifts */
export default function Preloader({ onDone }: { onDone: () => void }) {
  const [lift, setLift] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setLift(true), 1600)
    const t2 = setTimeout(onDone, 2400)
    return () => {
      clearTimeout(t)
      clearTimeout(t2)
    }
  }, [onDone])

  return (
    <motion.div
      className="fixed inset-0 z-[80] flex items-center justify-center bg-ivory"
      initial={{ y: 0 }}
      animate={lift ? { y: '-100%' } : {}}
      transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
    >
      {/* soft halo pulse behind the logo */}
      <motion.div
        className="absolute h-56 w-56 rounded-full bg-caramel/15"
        style={{ filter: 'blur(40px)' }}
        animate={{ scale: [0.8, 1.15, 1], opacity: [0, 0.9, 0.6] }}
        transition={{ duration: 1.8, ease: 'easeInOut' }}
      />

      {/* the actual brand logo */}
      <motion.img
        src="/dk.png"
        alt="DK Fashion"
        draggable={false}
        className="relative w-44 mix-blend-multiply sm:w-56"
        initial={{ opacity: 0, scale: 0.82, filter: 'blur(8px)' }}
        animate={lift ? { opacity: 0, scale: 1.06 } : { opacity: 1, scale: 1, filter: 'blur(0px)' }}
        transition={
          lift
            ? { duration: 0.7, ease: [0.76, 0, 0.24, 1] }
            : { duration: 0.9, ease: [0.22, 0.61, 0.36, 1] }
        }
      />

      {/* tagline reveal on its own beat */}
      <motion.p
        className="absolute bottom-16 text-xs uppercase tracking-[0.4em] text-olive"
        initial={{ opacity: 0, y: 10 }}
        animate={lift ? { opacity: 0 } : { opacity: 1, y: 0 }}
        transition={{
          opacity: { delay: 0.7, duration: 0.6 },
          y: { delay: 0.7, duration: 0.6 },
        }}
      >
        Sewn with patience
      </motion.p>
    </motion.div>
  )
}
