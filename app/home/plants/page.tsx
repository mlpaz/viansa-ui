"use client";
import { Page, Plant } from "@/types";
import { Input } from "@heroui/input";
import { Spinner } from "@heroui/spinner";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/table";
import { useCallback, useMemo, useState } from "react";
import useSWR from "swr";
import { useRouter } from "next/navigation";
import { Pagination } from "@heroui/pagination";
import { Button } from "@heroui/button";
import { UpsertModal } from "@/app/home/plants/upsert-modal";
import { DeleteModal } from "@/app/home/plants/delete-modal";
import { useDisclosure } from "@heroui/modal";
import { Trash2, Edit } from "react-feather";

export default function Plants() {
  const router = useRouter();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const {
    isOpen: isOpenDelete,
    onOpen: onOpenDelete,
    onOpenChange: onOpenDeleteChange,
  } = useDisclosure();
  const [page, setPage] = useState(1);
  const [rows, setRows] = useState(10);
  const [input, setInput] = useState<Plant>({ name: "", type: "" });

  let url = `/api/plant?page=${page - 1}&rows=${rows}`;
  const [searchName, setSearchName] = useState<string>("");
  if (searchName) {
    url = `${url}&name=${searchName}`;
  }

  async function fetcher(
    input: RequestInfo,
    init?: RequestInit
  ): Promise<Page<Plant>> {
    const res = await fetch(input, init);
    if (!res.ok) {
      await fetch("/api/logout", { method: "POST" });
      router.push("/");
    }
    const data: Page<Plant> = await res.json();
    return data;
  }

  async function upsertHandler(input: Plant) {
    const res = await fetch("/api/plant", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(input),
    });
    if (!res.ok) {
      await fetch("/api/logout", { method: "POST" });
      router.push("/");
    }
    mutate();
  }

  async function deleteHandler(id: string) {
    const res = await fetch(`/api/plant/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!res.ok) {
      await fetch("/api/logout", { method: "POST" });
      router.push("/");
    }
    mutate();
  }

  const { data, isLoading, mutate, isValidating } = useSWR(`${url}`, fetcher, {
    keepPreviousData: true,
  });

  const pages = useMemo(() => {
    return data?.totalElements ? Math.ceil(data.totalElements / rows) : 0;
  }, [data?.totalElements, rows]);

  const loadingState = isLoading ? "loading" : "idle";

  const items: Plant[] = data?.content ?? [];

  const renderCell = useCallback((rec: Plant, columnKey: React.Key) => {
    const cellValue = rec[columnKey as keyof Plant];

    if (columnKey === "actions") {
      return (
        <div className="relative flex items-center justify-arround gap-4">
          <Edit
            size={18}
            className="cursor-pointer"
            onClick={() => {
              setInput(rec);
              onOpen();
            }}
          />
          <Trash2
            size={18}
            className="cursor-pointer"
            onClick={() => {
              setInput(rec);
              onOpenDelete();
            }}
          />
        </div>
      );
    } else {
      return <> {cellValue} </>;
    }
  }, []);

  const onRowsPerPageChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setRows(Number(e.target.value));
      setPage(1);
    },
    []
  );

  const filters = useMemo(
    () => (
      <div>
        <h2 className="text-xl font-bold">Filters</h2>
        <div>
          <Input
            label="Name"
            type="text"
            onValueChange={setSearchName}
            size="sm"
            className="w-48 mx-auto mt-2"
          />
        </div>
      </div>
    ),
    []
  );

  const pagination = useMemo(
    () => (
      <div className="flex w-full justify-between gap-2">
        <span className="flex flex-1 items-center text-default-400 text-small">
          Total: <b className="ml-1"> {data?.totalElements} </b>
        </span>
        <Pagination
          className="flex-2"
          isCompact
          showControls
          showShadow
          color="primary"
          page={page}
          total={pages}
          onChange={(page) => setPage(page)}
        />
        <label className="flex justify-end flex-1 items-center text-default-400 text-small">
          <span>Rows:</span>
          <select
            className="bg-transparent outline-none text-default-400 text-small"
            onChange={onRowsPerPageChange}
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>
        </label>
      </div>
    ),
    [data?.totalElements, page, pages]
  );

  return (
    <main className="container mx-auto max-w-7xl pt-16 px-6 flex-grow">
      <UpsertModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        input={input}
        setInput={setInput}
        upsertHandler={upsertHandler}
      />
      <DeleteModal
        isOpen={isOpenDelete}
        onOpenChange={onOpenDeleteChange}
        input={input}
        deleteHandler={deleteHandler}
      />
      <section className="flex justify-center items-center relative mb-6">
        <h1 className="text-3xl font-bold text-center">Plants</h1>
        <Button
          color="primary"
          onPress={() => {
            setInput({ name: "", type: "" });
            onOpen();
          }}
          className="absolute right-0"
        >
          Add Plant
        </Button>
      </section>

      <Table
        className="mx-auto py-4 px-2 min-w-[400px] max-w-[600px]"
        aria-label="Example table with client async pagination"
        topContent={filters}
        bottomContent={pagination}
      >
        <TableHeader>
          <TableColumn key="name">Name</TableColumn>
          <TableColumn key="type">Type</TableColumn>
          <TableColumn key="actions">Actions</TableColumn>
        </TableHeader>
        <TableBody
          items={items}
          emptyContent={"No records to display."}
          loadingContent={<Spinner />}
          loadingState={loadingState}
        >
          {(item) => (
            <TableRow key={item?.id}>
              {(columnKey) => (
                <TableCell>{renderCell(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </main>
  );
}
