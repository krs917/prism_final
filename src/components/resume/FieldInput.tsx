import { InputHTMLAttributes, TextareaHTMLAttributes, useState } from "react";

interface FieldInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export const FieldInput = ({ label, id, ...props }: FieldInputProps) => {
  const [focused, setFocused] = useState(false);
  return (
    <div>
      <label htmlFor={id} className={`field-label ${focused ? "field-label-active" : ""}`}>
        {label}
      </label>
      <input
        id={id}
        className="field-input"
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        {...props}
      />
    </div>
  );
};

interface FieldTextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
}

export const FieldTextarea = ({ label, id, ...props }: FieldTextareaProps) => {
  const [focused, setFocused] = useState(false);
  return (
    <div>
      <label htmlFor={id} className={`field-label ${focused ? "field-label-active" : ""}`}>
        {label}
      </label>
      <textarea
        id={id}
        className="field-input min-h-[80px] resize-y"
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        {...props}
      />
    </div>
  );
};
