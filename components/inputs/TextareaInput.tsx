import { cn } from "@/lib/utils";
import React from "react";

type TextareaInputProps = {
  label: string;
  labelClassName?: string;
  holderClassName?: string;
  value: string;
  placeholder: string;
  editable?: boolean;
  handleChange: (value: string) => void;
};
function TextareaInput({
  label,
  labelClassName,
  holderClassName,
  value,
  placeholder,
  editable = true,
  handleChange,
}: TextareaInputProps) {
  const inputIdentifier = label.toLowerCase().replace(" ", "_");
  return (
    <div className="flex w-full flex-col gap-1">
      <label
        htmlFor={inputIdentifier}
        className={cn("text-foreground text-sm font-medium tracking-tight", labelClassName)}
      >
        {label}
      </label>
      <textarea
        disabled={!editable}
        placeholder={placeholder}
        value={value}
        onChange={(e) => {
          handleChange(e.target.value);
        }}
        className={cn(
          "border-border bg-background text-primary field-sizing-content min-h-[80px] w-full resize-none rounded-md border p-3 text-sm placeholder:italic font-medium outline-hidden lg:min-h-[65px] dark:bg-[#121212]",
          holderClassName,
        )}
      />
    </div>
  );
}

export default TextareaInput;
