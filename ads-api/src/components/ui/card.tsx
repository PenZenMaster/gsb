import * as React from "react"

export const Card = ({ children, className }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={`bg-white shadow rounded p-4 ${className || ""}`}>
    {children}
  </div>
)