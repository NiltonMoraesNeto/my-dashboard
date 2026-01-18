import * as React from "react";
import { Calendar as CalendarIcon, Clock } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface InputDateTimeProps {
  value?: Date | string;
  onChange?: (date: Date | undefined) => void;
  onBlur?: () => void;
  id?: string;
  className?: string;
  disabled?: boolean;
  placeholder?: string;
}

export function InputDateTime({
  value,
  onChange,
  onBlur,
  id,
  className,
  disabled,
  placeholder = "Selecione data e hora",
}: InputDateTimeProps) {
  const [open, setOpen] = React.useState(false);
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>();
  const [selectedTime, setSelectedTime] = React.useState<string>("");

  // Converter string para Date se necessário
  const dateValue = React.useMemo(() => {
    if (!value) return undefined;
    if (value instanceof Date) return value;
    if (typeof value === "string") {
      try {
        const parsed = new Date(value);
        return Number.isNaN(parsed.getTime()) ? undefined : parsed;
      } catch {
        return undefined;
      }
    }
    return undefined;
  }, [value]);

  React.useEffect(() => {
    if (dateValue) {
      setSelectedDate(dateValue);
      const hours = String(dateValue.getHours()).padStart(2, "0");
      const minutes = String(dateValue.getMinutes()).padStart(2, "0");
      setSelectedTime(`${hours}:${minutes}`);
    }
  }, [dateValue]);

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) {
      setSelectedDate(undefined);
      if (onChange) {
        onChange(undefined);
      }
      return;
    }
    
    setSelectedDate(date);
    
    // Se já tem hora selecionada, combinar com a nova data
    if (selectedTime) {
      const [hours, minutes] = selectedTime.split(":").map(Number);
      const combinedDate = new Date(date);
      combinedDate.setHours(hours || 0, minutes || 0, 0, 0);
      if (onChange) {
        onChange(combinedDate);
      }
    } else {
      // Se não tem hora, usar hora atual ou 00:00
      const combinedDate = new Date(date);
      const now = new Date();
      combinedDate.setHours(now.getHours(), now.getMinutes(), 0, 0);
      setSelectedTime(`${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`);
      if (onChange) {
        onChange(combinedDate);
      }
    }
  };

  const handleTimeChange = (time: string) => {
    setSelectedTime(time);
    if (selectedDate && time) {
      const [hours, minutes] = time.split(":").map(Number);
      const combinedDate = new Date(selectedDate);
      combinedDate.setHours(hours || 0, minutes || 0, 0, 0);
      if (onChange) {
        onChange(combinedDate);
      }
    } else if (!selectedDate && time) {
      // Se não tem data mas tem hora, usar data atual
      const now = new Date();
      const [hours, minutes] = time.split(":").map(Number);
      now.setHours(hours || 0, minutes || 0, 0, 0);
      setSelectedDate(now);
      if (onChange) {
        onChange(now);
      }
    }
  };

  const displayValue = React.useMemo(() => {
    if (!dateValue) return "";
    const dateStr = format(dateValue, "dd/MM/yyyy", { locale: ptBR });
    const timeStr = format(dateValue, "HH:mm", { locale: ptBR });
    return `${dateStr} ${timeStr}`;
  }, [dateValue]);

  return (
    <div className="flex gap-2">
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
              displayValue
            ) : (
              <span>{placeholder}</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start" onBlur={onBlur}>
          <div className="p-3">
            <Calendar
              mode="single"
              selected={selectedDate}
              defaultMonth={selectedDate || new Date()}
              captionLayout="dropdown"
              onSelect={handleDateSelect}
              locale={ptBR}
            />
            <div className="mt-3 pt-3 border-t">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <Input
                  type="time"
                  value={selectedTime}
                  onChange={(e) => handleTimeChange(e.target.value)}
                  className="w-full"
                />
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
