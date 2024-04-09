import { selectedServiceAtom } from "@/atoms/catalog.atoms";
import { DialogIds } from "@/enums/dialog-ids.enum";
import { useAtomValue } from "jotai";
import Dialog from "../common/Dialog";

export interface SelfServiceEditProps {}

export function SelfServiceEdit() {
  const selectedService = useAtomValue(selectedServiceAtom);

  return (
    <Dialog id={DialogIds.EditService} title={selectedService?.name as string}>
      {}
    </Dialog>
  );
}
