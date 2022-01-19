import { useContext, createContext } from "react";
import { useForm } from "react-hook-form";
import { loginFormModel } from "../types/loginFormModel";

interface UseFormContextProps {
  setFormError?: any;
}

interface SetFormErrorProps {
  data: any;
  target: string;
  setError: Function;
}

const IsUseFormContext = createContext<UseFormContextProps>({});

export function useFormContext() {
  return useContext(IsUseFormContext);
}

export function UseFormContextProvider({ children }: any) {
  const setFormError = ({ data, target, setError }: SetFormErrorProps) => {
    return setError(data?.data[target]?.errors[0]?.field as any, {
      type: "manual",
      message: data?.data[target]?.errors[0]?.message,
    });
  };
  return (
    <IsUseFormContext.Provider value={{ setFormError }}>
      {children}
    </IsUseFormContext.Provider>
  );
}
