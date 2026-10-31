import React from 'react'
import { Fade, Grow } from '@mui/material'

/**
 * Wraps children with a smooth fade+rise-in animation on mount.
 * Use `variant="grow"` for a scale-in effect (good for cards/charts),
 * default fades and slides up slightly.
 */
export default function FadeInSection({ children, delay = 0, variant = 'fade', ...props }) {
  const timeout = 500

  if (variant === 'grow') {
    return (
      <Grow in timeout={timeout} style={{ transitionDelay: `${delay}ms` }} {...props}>
        <div>{children}</div>
      </Grow>
    )
  }

  return (
    <Fade in timeout={timeout} style={{ transitionDelay: `${delay}ms` }} {...props}>
      <div
        style={{
          animation: `fadeSlideUp 0.5s cubic-bezier(.4,0,.2,1) ${delay}ms both`,
        }}
      >
        {children}
      </div>
    </Fade>
  )
}
