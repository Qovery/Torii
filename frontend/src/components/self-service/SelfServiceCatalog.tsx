import {
  catalogsAtom,
  selectedCatalogSlugAtom,
  selectedServiceSlugAtom,
} from "@/atoms/catalog.atoms";
import { dialogOpenedAtomFamily } from "@/atoms/dialog.atoms";
import EmptyState from "@/components/common/EmptyState.tsx";
import SelfServiceCard from "@/components/self-service/SelfServiceCard.tsx";
import { DialogIds } from "@/enums/dialog-ids.enum";
import { useAtom, useSetAtom } from "jotai";
import { SelfServiceCreateDialog } from "./SelfServiceCreateDialog";
import { SelfServiceEditDialog } from "./SelfServiceEditDialog";

export default function SelfServiceCatalog() {
  const [{ data }] = useAtom(catalogsAtom);
  const setSelectedCatalogSlug = useSetAtom(selectedCatalogSlugAtom);
  const setSelectedServiceSlug = useSetAtom(selectedServiceSlugAtom);

  const [createDialogOpened, setCreateDialogOpened] = useAtom(
    dialogOpenedAtomFamily(DialogIds.CreateService)
  );

  const [editDialogOpened, setEditDialogOpened] = useAtom(
    dialogOpenedAtomFamily(DialogIds.EditService)
  );

  if (data.length === 0) {
    return (
      <div className="my-5">
        <EmptyState
          text="No Services"
          subText="This catalog has no services."
        />
      </div>
    );
  }

  const handleOnCreateClicked = (serviceSlug: string, catalogSlug: string) => {
    setCreateDialogOpened(true);
    setSelectedCatalogSlug(catalogSlug);
    setSelectedServiceSlug(serviceSlug);
  };

  const handleOnEditClicked = (serviceSlug: string, catalogSlug: string) => {
    setEditDialogOpened(true);
    setSelectedCatalogSlug(catalogSlug);
    setSelectedServiceSlug(serviceSlug);
  };

  return (
    <>
      <ul role="list" className="space-y-6">
        {data.map((catalog) => (
          <li key={catalog.slug}>
            <h2 className="text-xl font-bold mb-4">{catalog.name}</h2>
            <ul
              role="list"
              className="grid grid-cols-1 gap-x-6 gap-y-8 lg:grid-cols-3 xl:gap-x-8"
            >
              {catalog.services.map((service) => (
                <li key={service.slug}>
                  <SelfServiceCard
                    service={service}
                    onCreateClicked={() =>
                      handleOnCreateClicked(service.slug, catalog.slug)
                    }
                    onEditClicked={() =>
                      handleOnEditClicked(service.slug, catalog.slug)
                    }
                    onViewRunsClicked={() => {}}
                  />
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
      {createDialogOpened && <SelfServiceCreateDialog />}
      {editDialogOpened && <SelfServiceEditDialog />}
    </>
  );
}
