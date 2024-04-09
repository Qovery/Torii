import {
  FieldValues,
  FormProvider,
  SubmitHandler,
  UseFormReturn,
} from "react-hook-form";

export interface FormProps<TFormValues extends FieldValues, TContext> {
  formRef: UseFormReturn<TFormValues, TContext>;
  onSubmit?: SubmitHandler<TFormValues>;
  className?: string;
  children: JSX.Element | JSX.Element[];
}

export function Form<TFormValues extends FieldValues, TContext>({
  onSubmit,
  children,
  className,
  formRef,
}: FormProps<TFormValues, TContext>) {
  return (
    <FormProvider {...formRef}>
      <form
        className={className}
        onSubmit={onSubmit ? formRef.handleSubmit(onSubmit) : () => {}}
      >
        {children}
      </form>
    </FormProvider>
  );
}
