import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState } from "react";

interface InputWithIconProps {
  Icon?: React.FC<any>;
  setValue?: (value?: any) => void;
  value?: any;
  placeholder?: string;
  label: string;
  type?: string;
  disable?: boolean;
  limit?: number;
}

export function InputWithIcon({
  Icon,
  setValue = () => {},
  value = "",
  placeholder = "",
  label = "",
  type = "text",
  disable = false,
}: InputWithIconProps) {
  return (
    <div>
      <label
        // htmlFor="email"
        className="block text-[12px] font-medium text-neutral-700 dark:text-neutral-300 mb-2"
      >
        {label}
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 dark:text-gray-500">
          {Icon && <Icon className="w-4 h-4" />}
        </div>
        <Input
          //   id="email"
          disabled={disable}
          type={type}
          defaultValue={value}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          className="block text-sm w-full pl-10 p"
        />
      </div>
    </div>
  );
}

export function TextAreWithIcon({
  setValue = () => {},
  placeholder = "",
  label = "",
  value = "",
  limit = 500,
}: InputWithIconProps) {
  const [isVeryLong, setIsVeryLong] = useState(false);
  const [countWords, setCountWords] = useState(0);

  useEffect(() => {
    setCountWords(value.length);
    setIsVeryLong(value.length >= limit);
  }, [value, limit]);

  return (
    <div>
      <label
        htmlFor="email"
        className="block text-[12px] font-medium text-gray-700 dark:text-gray-300 mb-2"
      >
        {label}{" "}
        <span className="text-[10px]">
          {countWords}/{limit}
        </span>
        {isVeryLong && <span className="text-red-500">*</span>}
      </label>
      <div className="relative w-full">
        <Textarea
          id="email"
          defaultValue={value}
          onChange={(e) => {
            if (!isVeryLong) {
              setValue(e.target.value);
            }
          }}
          placeholder={placeholder}
          className="block resize-none text-sm w-full px-3 py-3 max-h-[200px]"
          maxLength={limit}
          rows={5}
        
        />
      </div>
    </div>
  );
}

type Option = any;
type OptionsGroup = { [key: string]: Option[] };

type SelectProps = {
  options?: Option[] | OptionsGroup;
  placeholder?: string;
  selectedLabel?: string;
  labelComponent?: React.ReactNode;
  onSelect?: (value: string) => void;
  refId?: string;
  refLabel?: string;
  redValue?: string;
  defaultValue?: string;
  disabled?: boolean;
};

export function SelectComponent({
  options = [],
  placeholder = "Selecciona un valor",
  selectedLabel = "Seleccionado",
  labelComponent = "Selecciona un valor",
  refId = "value",
  refLabel = "label",
  redValue = "value",
  defaultValue = undefined,
  disabled = false,
  onSelect = () => {},
}: SelectProps) {
  const isGrouped = !Array.isArray(options);

  return (
    <div className="w-full">
      <div className="w-full">
        <label
          htmlFor="select"
          className="block text-[12px] font-medium text-gray-700 dark:text-gray-300 mb-2"
        >
          {labelComponent}
        </label>
      </div>

      <Select
        onValueChange={(value) => onSelect?.(value)}
        defaultValue={defaultValue}
        value={defaultValue}
        disabled={disabled}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {isGrouped ? (
            Object.entries(options).map(([groupName, groupOptions]) => (
              <SelectGroup key={groupName}>
                <SelectLabel className="text-sm font-medium text-gray-700 dark:text-neutral-300/60 p-1">
                  {groupName.charAt(0).toUpperCase() + groupName.slice(1)}
                </SelectLabel>
                {groupOptions.map((option) => (
                  <SelectItem key={option[refId]} value={option[redValue]}>
                    {option[refLabel]}
                  </SelectItem>
                ))}
              </SelectGroup>
            ))
          ) : (
            <SelectGroup>
              <SelectLabel className="text-sm font-medium text-gray-700 dark:text-neutral-300/60 p-1">
                {selectedLabel}
              </SelectLabel>
              {(options as Option[]).map((option) => (
                <SelectItem key={option[refId]} value={option[redValue]}>
                  {option[refLabel]}
                </SelectItem>
              ))}
            </SelectGroup>
          )}
        </SelectContent>
      </Select>
    </div>
  );
}

interface SwitchProps {
  checked: boolean;
  onCheckedChange: (value: boolean) => void;
  label?: string;
}

export function SwitchComponent({
  checked,
  onCheckedChange,
  label,
}: SwitchProps) {
  return (
    <div className="flex items-center gap-4">
      <Switch checked={checked} onCheckedChange={(v) => onCheckedChange(v)} />
      <Label>{label}</Label>
    </div>
  );
}
