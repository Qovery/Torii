import {DialogIds} from "@/enums/dialog-ids.enum";
import {useAtomValue} from "jotai";
import Dialog from "../common/Dialog";
import {selectedServiceAtom} from "@/atoms/service.atoms";

export interface SelfServiceEditProps {}

export function SelfServiceEditDialog() {
  const selectedService = useAtomValue(selectedServiceAtom);

  return (
    <Dialog id={DialogIds.EditService} title={selectedService?.name as string}>
      <></>
    </Dialog>
  );
}
