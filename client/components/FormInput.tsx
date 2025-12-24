import { InputHTMLAttributes } from "react";

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export default function FormInput({
  label,
  error,
  helperText,
  id,
  className,
  ...props
}: FormInputProps) {
  const inputId = id || props.name;

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-semibold text-foreground mb-2"
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`w-full px-4 py-3 rounded-lg border-2 transition-all focus:outline-none ${
          error
            ? "border-red-500 focus:border-red-600 bg-red-50"
            : "border-border focus:border-primary-600 bg-white"
        } ${className}`}
        {...props}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
      {helperText && !error && (
        <p className="text-muted-foreground text-sm mt-1">{helperText}</p>
      )}
    </div>
  );
}
