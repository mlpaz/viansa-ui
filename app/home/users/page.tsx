"use client";
import { UserLogin } from "@/types";
import { Card } from "@heroui/card";
import { Spinner } from "@heroui/spinner";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/table";
import { useCallback } from "react";
import useSWR from "swr";

async function fetcher(
  input: RequestInfo,
  init?: RequestInit
): Promise<UserLogin[]> {
  console.info("input", input);
  const res = await fetch(input, init);
  const data = await res.json();
  console.info("data", data);
  return data;
}

export default function Users() {
  let url = `/api/user`;

  const { data, isLoading, mutate } = useSWR(`${url}`, fetcher, {
    keepPreviousData: true,
  });
  console.info(data);
  const loadingState = isLoading ? "loading" : "idle";

  const items: UserLogin[] = data ?? [];

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

  return (
    <main className="container mx-auto max-w-7xl pt-16 px-6 flex-grow">
      <h1 className="text-3xl font-bold">Users</h1>
      <Card className="mx-auto w-80 py-4">
        <Table
          className="max-w-[1000px]"
          aria-label="Example table with client async pagination"
          topContentPlacement="outside"
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
