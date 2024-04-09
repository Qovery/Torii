import { selectedServiceAtom } from "@/atoms/catalog.atoms";
import { DialogIds } from "@/enums/dialog-ids.enum";
import { useAtomValue } from "jotai";
import Dialog from "../common/Dialog";
import DyanmicFields from "../common/DyanmicFields";
import { Field } from "@/types/catalog.type";

export interface SelfServiceCreateProps {}

export function SelfServiceCreate() {
  const selectedService = useAtomValue(selectedServiceAtom);

  return (
    <Dialog
      id={DialogIds.CreateService}
      title={selectedService?.name as string}
    >
      <div className="space-y-6 py-6 sm:space-y-0 sm:py-0">
        <DyanmicFields fields={selectedService?.fields as Field[]} />
      </div>
    </Dialog>
  );
}
