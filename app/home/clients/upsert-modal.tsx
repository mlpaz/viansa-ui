"use client";
import { ModalContent, ModalHeader, ModalFooter, Modal } from "@heroui/modal";
import { Button } from "@heroui/button";
import { Client, Location } from "@/types";
import { Input } from "@heroui/input";
import { AsyncAutocomplete } from "@/components/asycAutocomplete";

export const UpsertModal = ({
  isOpen,
  onOpenChange,
  input,
  setInput,
  upsertHandler,
}: {
  isOpen: boolean;
  onOpenChange: () => void;
  input: Client;
  setInput: (input: Client) => void;
  upsertHandler: (input: Client) => void;
}) => {
  const title = input?.id ? "Edit Client" : "Add Client";
  let url = `/api/location?rows=10`;
  const setValue = (id: string) => {
    setInput({ ...input, location: { id } });
  };

  const addLabel = (input: Location) => {
    return input.name + " - " + input.city?.name;
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      backdrop={"blur"}
      size="xl"
    >
      <ModalContent className="px-2">
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1 text-center text-2xl mb-1 ">
              {title}
            </ModalHeader>
            <section className="flex gap-4 flex-wrap justify-center">
              <Input
                className="w-[250px]"
                label="Name"
                placeholder="Enter Client Name"
                type="string"
                value={input.name || ""}
                onChange={(e) => setInput({ ...input, name: e.target.value })}
              />
              <Input
                className="w-[250px]"
                label="Surname"
                placeholder="Enter Client Surname"
                type="string"
                value={input.surname || ""}
                onChange={(e) =>
                  setInput({ ...input, surname: e.target.value })
                }
              />
              <Input
                className="w-[250px]"
                label="Email"
                placeholder="Enter Client Email"
                type="email"
                value={input.email || ""}
                onChange={(e) => setInput({ ...input, email: e.target.value })}
              />
              <Input
                className="w-[250px]"
                label="Cellphone"
                placeholder="Enter Client Cellphone"
                type="string"
                value={input.cellphone || ""}
                onChange={(e) =>
                  setInput({ ...input, cellphone: e.target.value })
                }
              />
              <Input
                className="w-[250px]"
                label="Cuit/Cuil"
                placeholder="Enter Client Cuil/Cuil"
                type="number"
                value={input.cuitCuil.toString()}
                onChange={(e) =>
                  setInput({ ...input, cuitCuil: Number(e.target.value) })
                }
              />
              <Input
                className="w-[250px]"
                label="Geographic Coordinates"
                placeholder="Enter Client Coordinates"
                type="string"
                value={input.coordG || ""}
                onChange={(e) => setInput({ ...input, coordG: e.target.value })}
              />
              <Input
                className="w-[520px]"
                label="Notes"
                placeholder="Enter Client Notes"
                type="string"
                value={input.notation || ""}
                onChange={(e) =>
                  setInput({ ...input, notation: e.target.value })
                }
              />
              <AsyncAutocomplete<Location>
                className="w-[520px]"
                url={url}
                value={input.location}
                setValue={setValue}
                label="Location"
                placeholder="Search a location..."
                addLabel={addLabel}
              />
            </section>
            <ModalFooter className="flex justify-between mt-2">
              <Button
                onPress={() => {
                  upsertHandler(input);
                  onClose();
                }}
                color="primary"
              >
                Confirm
              </Button>
              <Button onPress={onClose}>Close</Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
