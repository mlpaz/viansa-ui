"use client";
import { Page, UserLogin } from "@/types";
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
import { UpsertModal } from "@/app/home/users/upsert-modal";
import { useDisclosure } from "@heroui/modal";
import { Trash2, Edit } from "react-feather";

export default function Users() {
  const router = useRouter();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [page, setPage] = useState(1);
  const [rows, setRows] = useState(10);
  const [refresh, setRefresh] = useState(false);
  const [input, setInput] = useState<UserLogin>({ email: "", password: "" });

  let url = `/api/user?page=${page - 1}&rows=${rows}`;
  console.info(url);
  const [searchEmail, setSearchEmail] = useState<string>("");
  if (searchEmail) {
    url = `${url}&email=${searchEmail}`;
  }

  async function fetcher(
    input: RequestInfo,
    init?: RequestInit
  ): Promise<Page<UserLogin>> {
    const res = await fetch(input, init);
    console.info("res.ok");
    if (!res.ok) {
      await fetch("/api/logout", { method: "POST" });
      router.push("/");
    }
    const data: Page<UserLogin> = await res.json();
    return data;
  }

  async function upsertHandler(input: UserLogin) {
    const res = await fetch("/api/user", {
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
    setRefresh(!refresh);
  }

  async function deleteHandler(id: string) {
    const res = await fetch(`/api/user/${id}`, {
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
  }, [data?.totalElements, rows, refresh]);

  console.info(data);
  const loadingState = isLoading ? "loading" : "idle";

  const items: UserLogin[] = data?.content ?? [];

  const renderCell = useCallback(
    (rec: UserLogin, columnKey: React.Key) => {
      const cellValue = rec[columnKey as keyof UserLogin];

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
                deleteHandler(rec?.id || "");
              }}
            />
          </div>
        );
      } else {
        return <> {cellValue} </>;
      }
    },
    [refresh]
  );

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
            label="Email"
            type="text"
            onValueChange={setSearchEmail}
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
    [data?.totalElements, page, pages, refresh]
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
      <section className="flex justify-center items-center relative mb-6">
        <h1 className="text-3xl font-bold text-center">Users</h1>
        <Button
          onPress={() => {
            setInput({ email: "", password: "" });
            onOpen();
          }}
          className="absolute right-0"
        >
          Add User
        </Button>
      </section>

      <Table
        className="mx-auto py-4 px-2 min-w-[400px] max-w-[600px]"
        aria-label="Example table with client async pagination"
        topContent={filters}
        bottomContent={pagination}
      >
        <TableHeader>
          <TableColumn key="email">Email</TableColumn>
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
