import * as React from "react"

export const Card = ({ children, className }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={`bg-white shadow-md rounded-lg p-6 ${className || ""}`}>
    {children}
  </div>
)

export const CardContent = ({ children, className }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={`mt-2 ${className || ""}`}>
    {children}
  </div>
)