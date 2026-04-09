import { useState, useEffect, useRef } from 'react'

const ITEM_MIN_WIDTH = 72
const GAP = 6
const TARGET_ROWS = 8

export function useGridPageSize() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [pageSize, setPageSize] = useState(100)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const compute = (width: number) => {
      const cols = Math.max(1, Math.floor((width + GAP) / (ITEM_MIN_WIDTH + GAP)))
      setPageSize(cols * TARGET_ROWS)
    }

    compute(el.clientWidth)

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0]
      if (entry) compute(entry.contentRect.width)
    })

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return { containerRef, pageSize }
}
