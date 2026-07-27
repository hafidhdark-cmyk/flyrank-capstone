import type {
  ButtonHTMLAttributes,
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  error?: string;
};

export const Input = ({ className = "", error, ...props }: InputProps) => {
  const borderClass = error
    ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
    : "border-gray-300 focus:border-indigo-500 focus:ring-indigo-500/20";

  return (
    <input
      className={`w-full rounded-lg border bg-white px-3 py-2 text-sm text-gray-900 outline-none transition focus:ring-2 ${borderClass} ${className}`}
      {...props}
    />
  );
};

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  error?: string;
};

export const Textarea = ({ className = "", error, ...props }: TextareaProps) => {
  const borderClass = error
    ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
    : "border-gray-300 focus:border-indigo-500 focus:ring-indigo-500/20";

  return (
    <textarea
      className={`w-full resize-y rounded-lg border bg-white px-3 py-2 text-sm text-gray-900 outline-none transition focus:ring-2 ${borderClass} ${className}`}
      rows={4}
      {...props}
    />
  );
};

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  error?: string;
  children: ReactNode;
};

export const Select = ({ className = "", error, children, ...props }: SelectProps) => {
  const borderClass = error
    ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
    : "border-gray-300 focus:border-indigo-500 focus:ring-indigo-500/20";

  return (
    <select
      className={`w-full rounded-lg border bg-white px-3 py-2 text-sm text-gray-900 outline-none transition focus:ring-2 ${borderClass} ${className}`}
      {...props}
    >
      {children}
    </select>
  );
};

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary";
};

export const Button = ({
  className = "",
  variant = "primary",
  type = "button",
  disabled,
  children,
  ...props
}: ButtonProps) => {
  const variantClass =
    variant === "primary"
      ? "bg-indigo-600 text-white hover:bg-indigo-700 disabled:bg-indigo-300"
      : "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:text-gray-400";

  return (
    <button
      type={type}
      disabled={disabled}
      className={`rounded-lg px-4 py-2 text-sm font-medium transition disabled:cursor-not-allowed ${variantClass} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

type FormFieldProps = {
  label: string;
  htmlFor: string;
  error?: string;
  hint?: string;
  children: ReactNode;
};

export const FormField = ({ label, htmlFor, error, hint, children }: FormFieldProps) => {
  return (
    <div className="space-y-1.5">
      <label htmlFor={htmlFor} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      {children}
      {hint && !error ? <p className="text-xs text-gray-500">{hint}</p> : null}
      {error ? (
        <p id={`${htmlFor}-error`} role="alert" className="text-xs text-red-600">
          {error}
        </p>
      ) : null}
    </div>
  );
};

type ToastVariant = "success" | "error";

type ToastProps = {
  message: string;
  variant: ToastVariant;
  onDismiss: () => void;
};

export const Toast = ({ message, variant, onDismiss }: ToastProps) => {
  const variantClass =
    variant === "success"
      ? "border-green-200 bg-green-50 text-green-800"
      : "border-red-200 bg-red-50 text-red-800";

  return (
    <div
      role={variant === "error" ? "alert" : "status"}
      aria-live="polite"
      className={`fixed right-4 top-4 z-50 flex max-w-sm items-start gap-3 rounded-lg border px-4 py-3 text-sm shadow-lg ${variantClass}`}
    >
      <p className="flex-1">{message}</p>
      <button
        type="button"
        onClick={onDismiss}
        aria-label="Dismiss notification"
        className="rounded px-1 text-current opacity-70 transition hover:opacity-100"
      >
        ×
      </button>
    </div>
  );
};
