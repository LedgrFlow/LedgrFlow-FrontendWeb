import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const defaultOptions = {
  value: "apple",
  label: "Apple",
};

export type SelectBaseProps = {
  label?: string;
  labelOptions?: string;
  options?: (typeof defaultOptions)[];
  onChange?: (value: string) => void;
  defaultValue?: string;
};

export function SelectBase({
  label,
  options,
  labelOptions,
  onChange,
  defaultValue,
}: SelectBaseProps) {
  return (
    <Select onValueChange={onChange} defaultValue={defaultValue}>
      <SelectTrigger className="w-[180px] dark:text-white">
        <SelectValue placeholder={label} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>{labelOptions}</SelectLabel>
          {options?.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
