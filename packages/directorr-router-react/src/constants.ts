import { CSSProperties } from 'react'

export const containerStyle: CSSProperties = {
  position: 'relative',
  height: '100%',
  width: '100%',
}

export const childStyle: CSSProperties = {
  position: 'absolute',
  height: '100%',
  width: '100%',
}

export const hideStyle: CSSProperties = {
  display: 'none',
}

export const animationStyle: CSSProperties = {
  animationDelay: '16ms',
  animationDuration: `${16 * 6}ms`,
  animationFillMode: 'both',
  animationTimingFunction: 'cubic-bezier(0.4, 0.0, 0.6, 1)',
  willChange: 'opacity',
}

export const animationNoneStyle: CSSProperties = {
  animationName: 'router_anim_none',
  animationDuration: '16ms',
  willChange: 'opacity',
}

export const animationLeaveStyle: CSSProperties = {
  animationName: 'router_opacity_leave',
}

export const animationEnterStyle: CSSProperties = {
  animationName: 'router_opacity_enter',
}

export const disableInteractionStyle: CSSProperties = {
  pointerEvents: 'none',
  userSelect: 'none',
}

export const ANIMATIONS = {
  NONE: {
    prev: animationNoneStyle,
    next: animationNoneStyle,
    keyFrames: `
      @keyframes router_anim_none {
        100% {
          opacity: 1;
        }
      }
    `,
  },
  FADE: {
    prev: {
      ...animationStyle,
      ...animationLeaveStyle,
    },
    next: {
      ...animationStyle,
      ...animationEnterStyle,
    },
    keyFrames: `
      @keyframes router_opacity_leave {
        0% {
          opacity: 1;
        }

        100% {
          opacity: 0;
        }
      }

      @keyframes router_opacity_enter {
        0% {
          opacity: 0;
        }

        100% {
          opacity: 1;
        }
      }
    `,
  },
}
