"use client";
import { AutocompleteField, Page } from "@/types";
import { Autocomplete, AutocompleteItem } from "@heroui/autocomplete";
import { useState } from "react";
import useSWR from "swr";

interface Prop<T> {
  url: string;
  value: T | any;
  setValue: (id: string) => void;
  label?: string;
  placeholder?: string;
  addLabel?: (value: T) => string;
  className?: string;
}

export const AsyncAutocomplete = <T,>({
  url,
  value,
  setValue,
  label,
  placeholder,
  addLabel,
  className,
}: Prop<T>) => {
  const [searchName, setSearchName] = useState<string>("");
  const [isLoadingPlants, setIsLoadingPlants] = useState<boolean>(false);
  const initAutocompleteField: AutocompleteField | null =
    value === null || value === undefined
      ? null
      : {
          label: addLabel ? addLabel(value) : value.name || "",
          key: value.id || "",
        };
  const [autocompleteField, setAutocompleteField] =
    useState<AutocompleteField | null>(initAutocompleteField);
  if (searchName) {
    url = `${url}&name=${searchName}`;
  }
  async function fetcher(
    input: RequestInfo,
    init?: RequestInit
  ): Promise<AutocompleteField[]> {
    const res = await fetch(input, init);
    if (!res.ok) {
      return [];
    }
    const data: Page<any> = await res.json();
    const autocompleteData: AutocompleteField[] = data.content.map(
      (item: any) => ({
        label: addLabel ? addLabel(item) : item.name,
        key: item.id || "",
      })
    );
    setIsLoadingPlants(false);
    return autocompleteData;
  }
  const {
    data: options = [],
    isLoading,
    mutate,
    isValidating,
  } = useSWR(`${url}`, fetcher, {
    keepPreviousData: true,
  });

  const onSelectionChange = (id: any) => {
    if (!id) {
      return;
    }
    console.info("key changed to:", id);
    setValue(id);
    // find element in autocompleteField
    const selectedPlant = options?.find((item: any) => item.key === id);
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

  return (
    <Autocomplete
      className={className || ""}
      allowsCustomValue={true}
      defaultInputValue={initAutocompleteField?.label}
      defaultItems={options}
      label={label}
      placeholder={placeholder}
      onInputChange={onInputChange}
      onSelectionChange={onSelectionChange}
      isLoading={isLoadingPlants}
    >
      {(item) => (
        <AutocompleteItem key={item.key}>{item.label}</AutocompleteItem>
      )}
    </Autocomplete>
  );
};
