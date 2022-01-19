import React, { useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import UseFormField from "../components/atoms/UseFormField";
import { useFormContext } from "../context/useFormContext";
import { useLoginMutation } from "../generated/graphql";
import { loginFormModel } from "../types/loginFormModel";

interface LoginProps {}

const Login: React.FC<LoginProps> = () => {
  const [loginMutation] = useLoginMutation();
  const { setFormError } = useFormContext();
  const formInputRequired = "This form is required";
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<loginFormModel>();

  const UseFormFieldProps = {
    register,
    errors,
  };

  const submit: SubmitHandler<loginFormModel> = async (
    values: loginFormModel
  ) => {
    const data = await loginMutation({
      variables: { options: values },
    });
    if (data?.data?.login.errors) {
      return setFormError({ data, target: "login", setError });
    }
  };

  return (
    <form onSubmit={handleSubmit(submit)}>
      <UseFormField {...UseFormFieldProps} title="Username" />
      <UseFormField {...UseFormFieldProps} title="Password" />
      <button type="submit">Login</button>
    </form>
  );
};

export default Login;
