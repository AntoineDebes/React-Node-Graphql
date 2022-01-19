import React from "react";
import { UseFormRegisterReturn } from "react-hook-form";

interface UseFormFieldProps {
  register: any;
  errors: any;
  title: string;
}

const UseFormField: React.FC<UseFormFieldProps> = ({
  register,
  errors,
  title,
}) => {
  const formInputRequired = "This field is required";
  const titleToLowerCase = title.replaceAll(" ", "").toLowerCase();

  return (
    <div>
      <label htmlFor="username">{title}</label>
      <input
        type="text"
        id="username"
        {...register(titleToLowerCase, {
          required: formInputRequired,
        })}
      />
      {errors[titleToLowerCase] && (
        <span className="text-danger">{errors[titleToLowerCase].message}</span>
      )}
    </div>
  );
};

export default UseFormField;
