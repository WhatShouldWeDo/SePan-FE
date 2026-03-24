import { clsx, type ClassValue } from "clsx"
import { extendTailwindMerge } from "tailwind-merge"

const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [
        {
          text: [
            "display-1", "display-2",
            "heading-1", "heading-2", "heading-3",
            "title-1", "title-2", "title-3", "title-4",
            "body-1", "body-2", "body-3",
            "label-1", "label-2", "label-3", "label-4",
            "caption-1", "caption-2", "caption-3",
          ],
        },
      ],
    },
  },
})

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(...inputs))
}
