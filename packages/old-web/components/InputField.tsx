import { useField } from "formik";
import React from "react";
import { Input, InputProps } from "./Input";

export const InputField: React.FC<
  InputProps & { label?: string; description?: string }
> = React.forwardRef(({ textarea, label, description, ...props }, ref) => {
  const [field, meta] = useField(props as any);

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={props.name} className="font-bold mb-1 inline-block">
          {label}
        </label>
      )}
      {description && (
        <p className="text-gray-600 font-normal small mb-3">{description}</p>
      )}
      <Input
        ref={ref}
        error={meta.touched && !!meta.error}
        textarea={textarea}
        {...field}
        {...props}
      />
      {meta.touched && !!meta.error ? (
        <p className="mt-1 small text-red">{meta.error}</p>
      ) : null}
    </div>
  );
});

InputField.displayName = "InputField";
