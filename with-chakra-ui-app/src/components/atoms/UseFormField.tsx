import React from "react";
import { UseFormRegisterReturn } from "react-hook-form";
import validation from "../../validation";

interface UseFormFieldProps {
  register: (titleToLowerCase: any, required: any) => UseFormRegisterReturn;
  errors: any;
  title: string;
  pattern?: {
    value: RegExp;
    message: string;
  };
  type?: string;
}

const UseFormField: React.FC<UseFormFieldProps> = ({
  register,
  errors,
  title,
  pattern,
  type,
}) => {
  const formInputRequired = "This field is required";
  const titleToLowerCase: string = title.replaceAll(" ", "").toLowerCase();

  return (
    <div>
      <label htmlFor={titleToLowerCase}>{title}</label>
      <input
        type={type ?? "text"}
        id={titleToLowerCase}
        {...register(titleToLowerCase, {
          required: formInputRequired,
          pattern: pattern ?? null,
        })}
      />
      {errors[titleToLowerCase] && (
        <span className="text-danger">{errors[titleToLowerCase].message}</span>
      )}
    </div>
  );
};

export default UseFormField;
