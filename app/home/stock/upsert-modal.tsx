"use client";
import { ModalContent, ModalHeader, ModalFooter, Modal } from "@heroui/modal";
import { Button } from "@heroui/button";
import { Stock, AutocompleteField, Plant } from "@/types";
import { Input } from "@heroui/input";
import { Autocomplete, AutocompleteItem, Page } from "@heroui/autocomplete";
import { useState } from "react";
import useSWR from "swr";
import { useRouter } from "next/navigation";

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
  const router = useRouter();
  let url = `/api/plant?rows=2`;
  const [searchName, setSearchName] = useState<string>("");
  const [isLoadingPlants, setIsLoadingPlants] = useState<boolean>(false);
  const [autocompleteField, setAutocompleteField] =
    useState<AutocompleteField | null>(null);
  if (searchName) {
    url = `${url}&name=${searchName}`;
  }
  async function fetcher(
    input: RequestInfo,
    init?: RequestInit
  ): Promise<AutocompleteField[]> {
    const res = await fetch(input, init);
    if (!res.ok) {
      await fetch("/api/logout", { method: "POST" });
      router.push("/");
    }
    const data: Page<Plant> = await res.json();
    const autocompleteData: AutocompleteField[] = data.content.map(
      (item: Plant) => ({
        label: item.name + " - " + item.type,
        key: item.id,
        description: "Plant " + item.name + " with type " + item.type + ".",
      })
    );

    setIsLoadingPlants(false);
    return autocompleteData;
  }
  const {
    data: plants,
    isLoading,
    mutate,
    isValidating,
  } = useSWR(`${url}`, fetcher, {
    keepPreviousData: true,
  });

  const onSelectionChange = (id: any) => {
    console.info("key changed to:", id);
    setInput({ ...input, plant: { id: id } });
    // find element in autocompleteField
    const selectedPlant = plants?.find((item: any) => item.key === id);
    if (!selectedPlant) {
      return;
    }
    setAutocompleteField(selectedPlant);
  };

  const onInputChange = (value: string) => {
    setIsLoadingPlants(true);

    setSearchName(value);
    mutate();
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
                <Autocomplete
                  allowsCustomValue={true}
                  defaultItems={plants}
                  label="Plant"
                  placeholder="Search a plant"
                  onInputChange={onInputChange}
                  onSelectionChange={onSelectionChange}
                  isLoading={isLoadingPlants}
                  description={autocompleteField?.description || "-"}
                >
                  {(item) => (
                    <AutocompleteItem key={item.key}>
                      {item.label}
                    </AutocompleteItem>
                  )}
                </Autocomplete>
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
