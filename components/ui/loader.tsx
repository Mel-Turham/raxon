import type React from "react"

import { createKeys } from "@/shared/lib/keys"
import { cn } from "@/shared/lib/utils"

const SPOKES = createKeys(12, "spoke")

type LoaderProps = Omit<React.ComponentProps<"span">, "children">

function Loader({ className, ...props }: LoaderProps) {
  return (
    <>
      <style>{`
        @keyframes loading-ui-classic-fade {
          0% {
            opacity: 1;
          }

          100% {
            opacity: 0.15;
          }
        }
      `}</style>
      <span
        role="status"
        className={cn("box-border inline-block size-5", className)}
        {...props}
      >
        <span
          aria-hidden="true"
          className="relative top-1/2 left-1/2 block size-full"
        >
          {SPOKES.map((key, position) => (
            <span
              key={key}
              className="absolute top-[-3.9%] left-[-10%] block h-[8%] w-[24%] rounded-(--radius) bg-current"
              style={{
                transform: `rotate(${position * 30}deg) translate(146%)`,
                animation:
                  "loading-ui-classic-fade var(--duration, 1.2s) linear infinite",
                animationDelay: `calc(var(--duration, 1.2s) / 12 * ${position - 12})`,
              }}
            />
          ))}
        </span>
        <span className="sr-only">Loading</span>
      </span>
    </>
  )
}

export { Loader }
