import React from "react";
import { Formik, Form } from "formik";
import { Box, Button } from "@chakra-ui/react";
import Wrapper from "../components/Wrapper";
import InputField from "../components/InputField";
import { useRegisterMutation } from "../generated/graphql";
import { useRouter } from "next/router";
import { useForm, SubmitHandler } from "react-hook-form";
import UseFormField from "../components/atoms/UseFormField";
import validation from "../validation";

interface RegisterProps {}

const Register: React.FC<RegisterProps> = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const useFormFieldProps = { register, errors };
  const [registerMutation] = useRegisterMutation();
  const route = useRouter();
  const submit: SubmitHandler<any> = async (values: any) => {
    console.log("values", values);
    const response = await registerMutation({
      variables: { options: values },
    });
    console.log("response", response);

    if (response.data?.register.id) return route.push("/");
  };

  return (
    <Wrapper variant="small">
      <form onSubmit={handleSubmit(submit)}>
        <UseFormField {...useFormFieldProps} title="Username" />
        <UseFormField
          {...useFormFieldProps}
          title="Email"
          pattern={validation.email}
        />
        <UseFormField {...useFormFieldProps} title="Password" type="password" />
        <button type="submit">Register</button>
      </form>
    </Wrapper>
  );
};

export default Register;
