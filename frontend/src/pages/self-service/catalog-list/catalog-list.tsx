import EmptyState from "@/components/EmptyState";
import { Form } from "@/components/Form";
import { Input } from "@/components/Input";
import { DialogIds } from "@/enums/dialog-ids.enum";
import { dialogOpenedAtomFamily } from "@/pages/atoms";
import { yupResolver } from "@hookform/resolvers/yup";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { Suspense, useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import * as yup from "yup";
import { CreateServiceDialog } from "../create-service-dialog/create-service-dialog";
import {
  filteredCatalogsAtom,
  selectedCatalogSlugAtom,
  selectedServiceSlugAtom,
  textSearchAtom,
} from "./atoms";
import ServiceCard from "./service-card";
import Subheader from "@/components/Subheader";

export const CatalogList = () => {
  return (
    <>
      <div className="mb-6">
        <Subheader pageTitle="Self Service" />
      </div>
      <Suspense fallback={<div>Loading...</div>}>
        <List />
      </Suspense>
    </>
  );
};

const List = () => {
  const catalogs = useAtomValue(filteredCatalogsAtom);
  const setSelectedCatalogSlug = useSetAtom(selectedCatalogSlugAtom);
  const setSelectedServiceSlug = useSetAtom(selectedServiceSlugAtom);

  const [createDialogOpened, setCreateDialogOpened] = useAtom(
    dialogOpenedAtomFamily(DialogIds.CreateService),
  );

  if (catalogs.length === 0) {
    return (
      <div className="my-5">
        <EmptyState
          text="Empty catalog"
          subText="There is no item in this catalog."
        />
      </div>
    );
  }

  const handleOnCreateClicked = (serviceSlug: string, catalogSlug: string) => {
    setCreateDialogOpened(true);
    setSelectedCatalogSlug(catalogSlug);
    setSelectedServiceSlug(serviceSlug);
  };

  return (
    <div className="flex flex-col">
      <Search />
      <ul role="list" className="space-y-6">
        {catalogs.map((catalog) => (
          <li key={catalog.slug}>
            <h2 className="mb-4 text-xl font-bold">{catalog.name}</h2>
            <ul
              role="list"
              className="grid grid-cols-1 gap-x-6 gap-y-8 lg:grid-cols-3 xl:gap-x-8"
            >
              {catalog.actions.map((service) => (
                <li key={service.slug}>
                  <ServiceCard
                    service={service}
                    onCreateClicked={() =>
                      handleOnCreateClicked(service.slug, catalog.slug)
                    }
                    onViewRunsClicked={() => {}}
                  />
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
      {createDialogOpened && <CreateServiceDialog />}
    </div>
  );
};

const Search = () => {
  const setTextSearch = useSetAtom(textSearchAtom);

  const schema = yup.object({
    search: yup.string().required(),
  });

  const form = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  const search = useWatch({
    control: form.control,
    name: "search",
  });

  useEffect(() => {
    setTextSearch(search);
  }, [setTextSearch, search]);

  return (
    <div className="flex">
      <Form formRef={form}>
        <Input id="search" name="search" placeholder="Search" />
      </Form>
    </div>
  );
};

export default CatalogList;
