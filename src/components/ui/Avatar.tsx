import { cn, getInitials } from "../../lib/utils";

export type AvatarSize = "sm" | "md" | "lg";

const sizeStyles: Record<AvatarSize, string> = {
  sm: "size-7 text-xs",
  md: "size-9 text-xs",
  lg: "size-12 text-sm",
};

export interface AvatarProps {
  name: string;
  src?: string;
  size?: AvatarSize;
  className?: string;
}

export function Avatar({ name, src, size = "md", className }: AvatarProps) {
  const sharedClass = cn(
    "inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary/10 font-semibold text-primary",
    sizeStyles[size],
    className,
  );

  if (src) {
    return (
      <img src={src} alt={name} className={cn(sharedClass, "object-cover")} />
    );
  }

  return (
    <span role="img" aria-label={name} className={sharedClass}>
      {getInitials(name)}
    </span>
  );
}
