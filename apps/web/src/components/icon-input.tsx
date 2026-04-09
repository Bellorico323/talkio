export function IconInputRoot({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-input/50 file:text-foreground placeholder:text-muted-foreground focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/30 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 group flex h-9 w-full min-w-0 items-center gap-2 rounded-3xl border border-transparent px-3 py-1 text-base outline-none transition-[color,box-shadow,background-color] file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm">
      {children}
    </div>
  )
}

export function IconInputControl({
  className,
  type,
  ...props
}: React.ComponentProps<'input'>) {
  return <input type={type} {...props} className="w-full outline-none" />
}
