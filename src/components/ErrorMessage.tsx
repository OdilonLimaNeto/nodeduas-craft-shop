import { useFormContext } from "react-hook-form";
import { cn } from "@/lib/utils";

// TODO: Componente precisa ser reavaliado
interface ErrorMessageProps {
  field: string;
  className?: string;
}

function get(obj: unknown, path: string): unknown {
  const travel = (regexp: RegExp) =>
    String.prototype.split
      .call(path, regexp)
      .filter(Boolean)
      .reduce(
        (res: unknown, key: string) => {
          if (res == null) return undefined;
          const isArrayIndex = /^\d+$/.test(key);
          if (Array.isArray(res)) {
            return isArrayIndex ? res[Number(key)] : undefined;
          }
          if (typeof res === "object") {
            const record = res as Record<string, unknown>;
            const propKey = isArrayIndex ? String(Number(key)) : key;
            return record[propKey];
          }
          return undefined;
        },
        obj,
      );

  const result = travel(/[,[\]]+?/) || travel(/[,[\].]+?/);

  return result;
}

function extractMessage(value: unknown): string | null {
  if (typeof value === "string" || typeof value === "number") {
    return String(value);
  }
  if (value && typeof value === "object") {
    const withMessage = value as { message?: unknown };
    if (
      typeof withMessage.message === "string" ||
      typeof withMessage.message === "number"
    ) {
      return String(withMessage.message);
    }
  }
  return null;
}

export function ErrorMessage({ field, className }: ErrorMessageProps) {
  const {
    formState: { errors },
  } = useFormContext();

  const fieldError = get(errors, field);
  const message = extractMessage(fieldError);

  if (!message) {
    return null;
  }

  return (
    <span className={cn("text-xs text-destructive mt-1", className)}>
      {message}
    </span>
  );
}
