import * as React from "react";
import { ChevronDownIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import dayjs, { type Dayjs } from "dayjs";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);

interface DateProps {
  label?: string;
  defaultValue?: string; // se espera formato 'YYYY-MM-DD'
  onChange?: (date: string) => void; // devuelve 'YYYY-MM-DD'
}

export function CalendarSelect({ label, defaultValue, onChange }: DateProps) {
  const initialDate = defaultValue
    ? dayjs(defaultValue, "YYYY-MM-DD")
    : undefined;

  const [open, setOpen] = React.useState(false);
  const [date, setDate] = React.useState<Dayjs | undefined>(initialDate);

  React.useEffect(() => {
    if (onChange && date) {
      onChange(date.format("YYYY-MM-DD"));
    }
  }, [date, onChange]);

  return (
    <div className="flex flex-col gap-3">
      {label && (
        <Label htmlFor="date" className="px-1">
          {label}
        </Label>
      )}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            id="date"
            className="w-48 justify-between font-normal"
          >
            {date ? date.format("YYYY-MM-DD") : "Select date"}
            <ChevronDownIcon />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
          <Calendar
            mode="single"
            selected={date ? date.toDate() : undefined} // <-- aquí convertimos Dayjs a Date
            captionLayout="dropdown"
            onSelect={(selectedDate) => {
              if (selectedDate) {
                setDate(dayjs(selectedDate)); // Date -> Dayjs
              } else {
                setDate(undefined);
              }
              setOpen(false);
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
