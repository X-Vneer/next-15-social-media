import React from "react"
import { useInView } from "react-intersection-observer"

type Props = {
  onBottomReached: () => void
  className?: string
  children: React.ReactNode
}

const InfiniteScrollContainer = ({ children, className, onBottomReached }: Props) => {
  const { ref } = useInView({
    rootMargin: "200px",
    onChange: (inView) => {
      if (inView) onBottomReached()
    },
  })
  return (
    <div className={className}>
      {children}
      <div ref={ref} className="h-10"></div>
    </div>
  )
}

export default InfiniteScrollContainer
