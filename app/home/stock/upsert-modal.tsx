"use client";
import { ModalContent, ModalHeader, ModalFooter, Modal } from "@heroui/modal";
import { Button } from "@heroui/button";
import { Stock, AutocompleteField, Plant, Page } from "@/types";
import { Input } from "@heroui/input";
import { Autocomplete, AutocompleteItem } from "@heroui/autocomplete";
import { useState } from "react";
import useSWR from "swr";
import { useRouter } from "next/navigation";
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
  input: Stock;
  setInput: (input: Stock) => void;
  upsertHandler: (input: Stock) => void;
}) => {
  let url = `/api/plant?rows=10`;

  const setValue = (id: string) => {
    setInput({ ...input, plant: { id } });
  };

  const addLabel = (input: Plant) => {
    return input.name + " - " + input.type;
  };

  const title = input.id ? "Edit Stock" : "Add Stock";
  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} backdrop={"blur"}>
      <ModalContent className="px-2">
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1 text-center text-2xl mb-1">
              {title}
            </ModalHeader>
            <section className="flex flex-col gap-4">
              <div className="flex gap-2">
                <Input
                  label="Price"
                  placeholder="Enter Price"
                  type="number"
                  value={input.price.toString()}
                  onChange={(e) =>
                    setInput({ ...input, price: Number(e.target.value) })
                  }
                />
                <Input
                  label="Ammount"
                  placeholder="Enter Ammount"
                  type="string"
                  value={input.amount.toString()}
                  onChange={(e) =>
                    setInput({ ...input, amount: Number(e.target.value) })
                  }
                />
              </div>
              <div className="flex gap-2">
                <AsyncAutocomplete<Plant>
                  url={url}
                  value={input.plant}
                  setValue={setValue}
                  label="Plant"
                  placeholder="Search a plant..."
                  addLabel={addLabel}
                />
              </div>
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
