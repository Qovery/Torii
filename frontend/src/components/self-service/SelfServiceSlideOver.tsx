import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import TextField from "@/components/self-service/fields/TextField.tsx";
import TextareaField from "@/components/self-service/fields/TextareaField.tsx";
import SwitchField from "@/components/self-service/fields/SwitchField.tsx";
import { API_URL } from "@/config.ts";

export interface SelfServiceSlideOverProps {
  catalogSlug: string;
  service: any;
  onClose: () => void;
}

function getField(field: any, onChange: (value: any) => void): JSX.Element {
  switch (field.type) {
    case "text":
      return <TextField key={field.slug} field={field} />;
    case "number":
      return <TextField key={field.slug} field={field} inputMode="numeric" />;
    case "textarea":
      return <TextareaField key={field.slug} field={field} />;
    case "boolean":
      return (
        <SwitchField
          key={field.slug}
          field={field}
          onChange={(v) => onChange(v)}
        />
      );
    default:
      return <p>'{field.type}' is not a supported field</p>;
  }
}

export default function SelfServiceSlideOver({
  catalogSlug,
  service,
  onClose,
}: SelfServiceSlideOverProps): JSX.Element {
  const handleSubmit = (event: any) => {
    event.preventDefault();

    const fields = [];
    for (const [id, value] of new FormData(event.target)) {
      fields.push([id, value]);
    }

    const payload = Object.fromEntries(fields);

    console.log({ payload: payload });

    fetch(
      `${API_URL}/catalogs/${catalogSlug}/services/${service.slug}/execute`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ payload: payload }),
      }
    )
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
      });
  };

  return (
    <Dialog as="div" className="relative z-10" onClose={onClose}>
      <Transition.Child
        as={Fragment}
        enter="ease-in-out duration-500"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="ease-in-out duration-500"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
      </Transition.Child>

      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10 sm:pl-16">
            <Transition.Child
              as={Fragment}
              enter="transform transition ease-in-out duration-500 sm:duration-700"
              enterFrom="translate-x-full"
              enterTo="translate-x-0"
              leave="transform transition ease-in-out duration-500 sm:duration-700"
              leaveFrom="translate-x-0"
              leaveTo="translate-x-full"
            >
              <Dialog.Panel className="pointer-events-auto w-screen max-w-2xl">
                <form
                  className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl"
                  onSubmit={handleSubmit}
                >
                  <div className="flex-1">
                    {/* Header */}
                    <div className="bg-gray-50 px-4 py-6 sm:px-6">
                      <div className="flex items-start justify-between space-x-3">
                        <div className="space-y-1">
                          <Dialog.Title className="text-base font-semibold leading-6 text-gray-900">
                            {service.name}
                          </Dialog.Title>
                          <p className="text-sm text-gray-500">
                            {service.description}
                          </p>
                        </div>
                        <div className="flex h-7 items-center">
                          <button
                            type="button"
                            className="relative text-gray-400 hover:text-gray-500"
                            onClick={() => onClose()}
                          >
                            <span className="absolute -inset-2.5" />
                            <span className="sr-only">Close panel</span>
                            <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Divider container */}
                    <div className="space-y-6 py-6 sm:space-y-0 sm:py-0">
                      {service.fields.map((field: any) => {
                        return getField(field, (value) => {
                          console.log({ field: field.slug, value: value });
                        });
                      })}
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex-shrink-0 border-t border-gray-200 px-4 py-5 sm:px-6">
                    <div className="flex justify-end space-x-3">
                      <button
                        type="button"
                        className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                        onClick={() => onClose()}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="inline-flex justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                      >
                        Go
                      </button>
                    </div>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </div>
    </Dialog>
  );
}
