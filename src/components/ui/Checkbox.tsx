import { useId, type InputHTMLAttributes, type ReactNode } from "react";
import { cn } from "../../lib/utils";

export interface CheckboxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "onChange"> {
  label?: ReactNode;
  description?: string;
  error?: string;
  onCheckedChange?: (checked: boolean) => void;
}

export function Checkbox({
  label,
  description,
  error,
  className,
  id,
  ...props
}: CheckboxProps) {
  const generatedId = useId();
  const checkboxId = id ?? generatedId;

  return (
    <div className="flex items-start gap-2.5">
      <input
        id={checkboxId}
        type="checkbox"
        checked={props.checked}
        onChange={(event) => {
          props.onCheckedChange?.(event.target.checked);
        }}
        className={cn(
          "mt-0.5 size-4 shrink-0 cursor-pointer rounded border-border accent-primary focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          error && "border-danger",
          className,
        )}
        aria-invalid={error ? true : undefined}
        {...props}
      />
      {label || description ? (
        <div className="min-w-0">
          {label ? (
            <label
              htmlFor={checkboxId}
              className="block cursor-pointer text-sm text-foreground"
            >
              {label}
            </label>
          ) : null}
          {description ? (
            <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
          ) : null}
          {error ? <p className="mt-0.5 text-xs text-danger">{error}</p> : null}
        </div>
      ) : null}
    </div>
  );
}
