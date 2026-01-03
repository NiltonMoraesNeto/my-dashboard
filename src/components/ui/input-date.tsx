import * as React from "react";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn, parseDateFromInput } from "@/lib/utils";

interface InputDateProps {
  value?: Date | string;
  onChange?: (date: Date | undefined) => void;
  onBlur?: () => void;
  id?: string;
  className?: string;
  disabled?: boolean;
  placeholder?: string;
}

export function InputDate({
  value,
  onChange,
  onBlur,
  id,
  className,
  disabled,
  placeholder = "Selecione uma data",
}: InputDateProps) {
  const [open, setOpen] = React.useState(false);

  // Converter string para Date se necessário
  const dateValue = React.useMemo(() => {
    if (!value) return undefined;
    if (value instanceof Date) return value;
    if (typeof value === "string") {
      try {
        const parsed = parseDateFromInput(value);
        return Number.isNaN(parsed.getTime()) ? undefined : parsed;
      } catch {
        return undefined;
      }
    }
    return undefined;
  }, [value]);

  const handleSelect = (date: Date | undefined) => {
    if (onChange) {
      onChange(date);
    }
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          id={id}
          disabled={disabled}
          className={cn(
            "w-full justify-start text-left font-normal",
            !dateValue && "text-muted-foreground",
            className
          )}
          type="button"
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {dateValue ? (
            format(dateValue, "dd/MM/yyyy", { locale: ptBR })
          ) : (
            <span>{placeholder}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start" onBlur={onBlur}>
        <Calendar
          mode="single"
          selected={dateValue}
          captionLayout="dropdown"
          onSelect={handleSelect}
          locale={ptBR}
        />
      </PopoverContent>
    </Popover>
  );
}

