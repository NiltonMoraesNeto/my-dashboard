import CurrencyInput, {
  type CurrencyInputOnChangeValues,
} from "react-currency-input-field";
import { cn } from "@/lib/utils";

interface InputMoneyProps {
  value?: number | string;
  onChange?: (value: number | undefined) => void;
  onBlur?: () => void;
  id?: string;
  name?: string;
  className?: string;
  disabled?: boolean;
}

export function InputMoney({
  value,
  onChange,
  onBlur,
  className,
  id,
  name,
  disabled,
}: InputMoneyProps) {
  const handleValueChange = (
    value: string | undefined,
    _name?: string,
    values?: CurrencyInputOnChangeValues
  ) => {
    if (onChange) {
      // O react-currency-input-field retorna o valor float no objeto values
      // ou podemos usar parseFloat diretamente do value
      const numValue =
        values?.float !== undefined
          ? values.float
          : value
            ? parseFloat(value)
            : undefined;
      onChange(numValue ?? undefined);
    }
  };

  // Converter o valor numérico para número para exibição
  // O CurrencyInput espera o valor como número
  const displayValue =
    value !== undefined && value !== null
      ? typeof value === "number"
        ? value
        : parseFloat(String(value))
      : undefined;

  return (
    <CurrencyInput
      id={id}
      name={name || id}
      value={displayValue}
      onValueChange={handleValueChange}
      onBlur={onBlur}
      disabled={disabled}
      decimalsLimit={2}
      decimalSeparator=","
      groupSeparator="."
      prefix="R$ "
      allowDecimals={true}
      allowNegativeValue={false}
      className={cn(
        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        className
      )}
    />
  );
}
