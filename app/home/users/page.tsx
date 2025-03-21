"use client";
import { Page, UserLogin } from "@/types";
import { Card } from "@heroui/card";
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

export default function Users() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [rows, setRows] = useState(10);

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

  const { data, isLoading, mutate } = useSWR(`${url}`, fetcher, {
    keepPreviousData: true,
  });
  const pages = useMemo(() => {
    return data?.totalElements ? Math.ceil(data.totalElements / rows) : 0;
  }, [data?.totalElements, rows]);
  console.info(data);
  const loadingState = isLoading ? "loading" : "idle";

  const items: UserLogin[] = data?.content ?? [];

  const renderCell = useCallback((rec: UserLogin, columnKey: React.Key) => {
    const cellValue = rec[columnKey as keyof UserLogin];

    if (columnKey === "action") {
      return (
        <div className="relative flex items-center justify-center gap-4">
          Actions
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
      <div className="px-2">
        <h3>Filters</h3>
        <div className="py-2 ">
          <Input
            label="Email"
            type="text"
            onValueChange={setSearchEmail}
            labelPlacement="outside"
            size="sm"
          />
        </div>
      </div>
    ),
    []
  );

  const pagination = useMemo(
    () => (
      <div className="flex w-full justify-between">
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
    []
  );

  return (
    <main className="container mx-auto max-w-7xl pt-16 px-6 flex-grow">
      <h1 className="text-3xl font-bold">Users</h1>
      <Card className="mx-auto w-80 py-4">
        <Table
          className="max-w-[1000px]"
          aria-label="Example table with client async pagination"
          topContentPlacement="outside"
          topContent={filters}
          bottomContent={pagination}
        >
          <TableHeader>
            <TableColumn key="email">Email</TableColumn>
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
      </Card>
    </main>
  );
}
