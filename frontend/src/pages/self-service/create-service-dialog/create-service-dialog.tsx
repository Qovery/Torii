import { DialogIds } from "@/enums/dialog-ids.enum";
import { createDynamicSchema } from "@/lib/create-dynamic-schema";
import { Field } from "@/types/catalog.type";
import { yupResolver } from "@hookform/resolvers/yup";
import { useAtomValue, useSetAtom } from "jotai";
import { useForm } from "react-hook-form";
import Dialog from "@/components/Dialog";
import DyanmicFields from "@/components/DynamicFields";
import { Form } from "@/components/Form";
import { FormButtons } from "@/components/FormButtons";
import { useRef } from "react";
import { executeServiceMutation, selectedServiceAtom } from "./atoms";
import { dialogOpenedAtomFamily } from "@/pages/atoms";

export type ExecuteServicePayload = {
  name: string;
  description: string;
  ttl: number;
  seed: boolean;
};

export function CreateServiceDialog() {
  const selectedService = useAtomValue(selectedServiceAtom);
  const setCreateDialogOpened = useSetAtom(
    dialogOpenedAtomFamily(DialogIds.CreateService),
  );

  const initialFocus = {
    name: "name",
    ref: useRef(null),
  };

  const form = useForm({
    resolver: yupResolver(
      createDynamicSchema<ExecuteServicePayload>(
        selectedService?.fields as Field[],
      ),
    ),
    mode: "onChange",
  });

  const {
    mutateAsync: executeService,
    status,
    error,
  } = useAtomValue(executeServiceMutation);

  const handleSubmit = async (payload: ExecuteServicePayload) => {
    await executeService(payload);
    setCreateDialogOpened(false);
  };

  return (
    <Dialog
      id={DialogIds.CreateService}
      title={selectedService?.name as string}
      initialFocus={initialFocus.ref}
      customFooter
    >
      <Form formRef={form} onSubmit={handleSubmit}>
        <DyanmicFields
          fields={selectedService?.fields as Field[]}
          initialFocus={initialFocus}
        />
        <FormButtons
          valid={form.formState.isValid}
          onCancel={() => setCreateDialogOpened(false)}
        />
      </Form>
      {status === "error" && (
        <div className="mt-4">{JSON.stringify(error)}</div>
      )}
    </Dialog>
  );
}
