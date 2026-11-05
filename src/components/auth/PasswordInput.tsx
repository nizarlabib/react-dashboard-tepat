import { useId, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "../../lib/utils";

export interface PasswordInputProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "type" | "onChange"
  > {
  label?: string;
  error?: string;
  onChange?: (value: string) => void;
}

export function PasswordInput({
  label,
  error,
  id,
  value,
  onChange,
  ...props
}: PasswordInputProps) {
  const [show, setShow] = useState(false);
  const generatedId = useId();
  const inputId = id ?? `password-input-${generatedId}`;
  const Icon = show ? EyeOff : Eye;

  return (
    <div className="w-full">
      {label ? (
        <label
          htmlFor={inputId}
          className="mb-1.5 block text-xs font-medium text-foreground"
        >
          {label}
        </label>
      ) : null}
      <div className="relative">
        <input
          id={inputId}
          type={show ? "text" : "password"}
          value={value ?? ""}
          onChange={(event) => onChange?.(event.target.value)}
          className={cn(
            "h-10 w-full rounded-lg border border-border bg-surface px-3 pr-10 text-sm text-foreground placeholder:text-muted-foreground/70 transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20",
            error && "border-danger focus:border-danger focus:ring-danger/20",
          )}
          {...props}
        />
        <button
          type="button"
          onClick={() => setShow((current) => !current)}
          className="absolute inset-y-0 right-2 flex items-center pr-1 text-muted-foreground hover:text-foreground"
          aria-label={show ? "Hide password" : "Show password"}
        >
          <Icon className="size-4" aria-hidden="true" />
        </button>
      </div>
      {error ? (
        <p id={`${inputId}-error`} className="mt-1.5 text-xs text-danger">
          {error}
        </p>
      ) : null}
    </div>
  );
}
