import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

/* Soft image with gradient fallback (image standard requirement) */
export default function SoftImage({
  src,
  alt,
  className = '',
  imgClassName = '',
}: {
  src: string
  alt: string
  className?: string
  imgClassName?: string
}) {
  const [ok, setOk] = useState(true)
  const [loaded, setLoaded] = useState(false)

  return (
    <div className={`relative overflow-hidden img-fallback ${className}`}>
      {ok && (
        <motion.img
          src={src}
          alt={alt}
          loading="lazy"
          onLoad={() => setLoaded(true)}
          onError={() => setOk(false)}
          className={`h-full w-full object-cover transition-opacity duration-700 ${imgClassName} ${loaded ? 'opacity-100' : 'opacity-0'}`}
        />
      )}
    </div>
  )
}

export function SoftImageBlur({
  src,
  alt,
  className = '',
}: {
  src: string
  alt: string
  className?: string
}) {
  const [ok, setOk] = useState(true)
  return (
    <div className={`relative overflow-hidden img-fallback ${className}`}>
      <AnimatePresence>
        {ok && (
          <motion.img
            key={src}
            src={src}
            alt={alt}
            loading="lazy"
            onError={() => setOk(false)}
            className="h-full w-full object-cover"
            initial={{ opacity: 0, scale: 1.06 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 0.61, 0.36, 1] }}
          />
        )}
      </AnimatePresence>
      {!ok && (
        <div className="absolute inset-0 flex items-center justify-center text-4xl text-ivory/70">
          DK
        </div>
      )}
    </div>
  )
}
