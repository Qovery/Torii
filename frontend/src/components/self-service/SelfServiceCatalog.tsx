import { catalogsAtom, selectedServiceSlugAtom } from "@/atoms/catalog.atoms";
import { dialogOpenedAtomFamily } from "@/atoms/dialog.atoms";
import EmptyState from "@/components/common/EmptyState.tsx";
import SelfServiceCard from "@/components/self-service/SelfServiceCard.tsx";
import { DialogIds } from "@/enums/dialog-ids.enum";
import { useAtom, useSetAtom } from "jotai";
import { SelfServiceCreate } from "./SelfServiceCreate";
import { SelfServiceEdit } from "./SelfServiceEdit";

export interface SelfServiceCatalog {}

export default function SelfServiceCatalog() {
  const [{ data, status, error }] = useAtom(catalogsAtom);
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

  const handleOnCreateClicked = (slug: string) => {
    setCreateDialogOpened(true);
    setSelectedServiceSlug(slug);
  };

  const handleOnEditClicked = (slug: string) => {
    setEditDialogOpened(true);
    setSelectedServiceSlug(slug);
  };

  return (
    <>
      <ul
        role="list"
        className="grid grid-cols-1 gap-x-6 gap-y-8 lg:grid-cols-3 xl:gap-x-8"
      >
        {data.map((service) => (
          <li key={service.slug}>
            <SelfServiceCard
              slug={service.slug}
              title={service.name}
              description={service.description}
              serviceCount={service.services.length}
              icon={null}
              onCreateClicked={handleOnCreateClicked}
              onEditClicked={handleOnEditClicked}
            />
          </li>
        ))}
      </ul>
      {createDialogOpened && <SelfServiceCreate />}
      {editDialogOpened && <SelfServiceEdit />}
    </>
  );
}
