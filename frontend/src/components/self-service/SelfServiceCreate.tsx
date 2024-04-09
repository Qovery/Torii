import { selectedServiceAtom } from "@/atoms/catalog.atoms";
import { DialogIds } from "@/enums/dialog-ids.enum";
import { useAtomValue } from "jotai";
import Dialog from "../common/Dialog";

export interface SelfServiceCreateProps {}

export function SelfServiceCreate() {
  const selectedService = useAtomValue(selectedServiceAtom);

  return (
    <Dialog
      id={DialogIds.CreateService}
      title={selectedService?.name as string}
    >
      {}
    </Dialog>
  );
}
