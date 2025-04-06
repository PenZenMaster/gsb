export function Card({ children, ...props }) {
  return <div className="border rounded shadow" {...props}>{children}</div>;
}

export function CardContent({ children, ...props }) {
  return <div className="p-4" {...props}>{children}</div>;
}
