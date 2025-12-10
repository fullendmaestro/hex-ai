"use client";

import * as React from "react";
import Link from "next/link";
import {
  IconChevronDown,
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
  IconDotsVertical,
  IconLayoutColumns,
  IconExternalLink,
  IconSparkles,
  IconShieldCheck,
  IconClock,
} from "@tabler/icons-react";
import { useChatContext } from "@/components/chat";
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";

import { useIsMobile } from "@/hooks/use-mobile";
import { Badge } from "@hex-ai/ui/components/badge";
import { Button } from "@hex-ai/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@hex-ai/ui/components/dropdown-menu";
import { Input } from "@hex-ai/ui/components/input";
import { Label } from "@hex-ai/ui/components/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@hex-ai/ui/components/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@hex-ai/ui/components/table";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@hex-ai/ui/components/tabs";
import type { AVSData, OperatorData } from "@/app/home/actions";

// Column definitions for AVS
const avsColumns: ColumnDef<AVSData>[] = [
  {
    accessorKey: "metadataName",
    header: "Name",
    cell: ({ row }) => (
      <Link
        href={`/avs/${row.original.address}`}
        className="flex items-center gap-3 hover:underline py-2"
      >
        {row.original.metadataLogo && (
          <img
            src={row.original.metadataLogo}
            alt={row.original.metadataName}
            className="h-10 w-10 rounded-full object-cover flex-shrink-0"
          />
        )}
        <div className="flex flex-col gap-1">
          <span className="font-semibold text-base">
            {row.original.metadataName || "Unknown"}
          </span>
          <span className="font-mono text-xs text-muted-foreground">
            {row.original.address.slice(0, 8)}...
            {row.original.address.slice(-6)}
          </span>
        </div>
      </Link>
    ),
  },
  {
    accessorKey: "chain",
    header: "Chain",
    cell: () => (
      <div className="flex items-center gap-2">
        <span className="font-medium">Ethereum</span>
        <Badge variant="secondary" className="text-xs">
          Mainnet
        </Badge>
      </div>
    ),
  },
  {
    accessorKey: "totalOperators",
    header: () => <div className="text-right">Operators</div>,
    cell: ({ row }) => (
      <div className="text-right font-medium">
        {row.original.totalOperators.toLocaleString()}
      </div>
    ),
  },
  {
    accessorKey: "totalStakers",
    header: () => <div className="text-right">Stakers</div>,
    cell: ({ row }) => (
      <div className="text-right font-medium">
        {row.original.totalStakers.toLocaleString()}
      </div>
    ),
  },
  {
    accessorKey: "maxApy",
    header: () => <div className="text-right">Max APY</div>,
    cell: ({ row }) => (
      <div className="text-right">
        {row.original.maxApy && parseFloat(row.original.maxApy) > 0 ? (
          <Badge
            variant="outline"
            className="text-green-600 dark:text-green-400"
          >
            {parseFloat(row.original.maxApy).toFixed(2)}%
          </Badge>
        ) : (
          <span className="text-muted-foreground">N/A</span>
        )}
      </div>
    ),
  },
  {
    accessorKey: "analysis",
    header: () => <div className="text-center">AI Analysis</div>,
    cell: ({ row }) => {
      const analysis = row.original.analysis;
      if (!analysis) {
        return (
          <div className="flex items-center justify-center gap-2 text-muted-foreground">
            <IconClock className="h-4 w-4" />
            <span className="text-xs">Pending</span>
          </div>
        );
      }

      const getRiskColor = (risk: string) => {
        switch (risk) {
          case "low":
            return "bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800";
          case "medium":
            return "bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800";
          case "high":
            return "bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800";
          default:
            return "";
        }
      };

      return (
        <div className="flex flex-col items-center gap-1">
          <Badge
            className={`${getRiskColor(analysis.risk_score)} font-semibold uppercase text-xs`}
          >
            {analysis.risk_score} Risk
          </Badge>
          <span className="text-xs text-muted-foreground">
            Score: {analysis.overall_score}/100
          </span>
        </div>
      );
    },
  },
  {
    id: "askAI",
    header: () => <div className="text-center">Ask AI</div>,
    cell: ({ row }) => {
      const { openChatWithInput } = useChatContext();
      return (
        <div className="text-center">
          <Button
            variant="outline"
            size="sm"
            className="h-8 gap-2"
            onClick={() => {
              const query = `AVS: ${row.original.address} on Ethereum Mainnet`;
              openChatWithInput(query);
            }}
          >
            <IconSparkles className="h-4 w-4" />
            Ask AI
          </Button>
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="data-[state=open]:bg-muted text-muted-foreground flex size-8"
            size="icon"
          >
            <IconDotsVertical />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          {row.original.metadataWebsite && (
            <DropdownMenuItem asChild>
              <a
                href={row.original.metadataWebsite}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                <IconExternalLink className="h-4 w-4" />
                Visit Website
              </a>
            </DropdownMenuItem>
          )}
          <DropdownMenuItem asChild>
            <a
              href={`https://etherscan.io/address/${row.original.address}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2"
            >
              <IconExternalLink className="h-4 w-4" />
              View on Etherscan
            </a>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>View Details</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];

// Column definitions for Operators
const operatorColumns: ColumnDef<OperatorData>[] = [
  {
    accessorKey: "metadataName",
    header: "Name",
    cell: ({ row }) => (
      <Link
        href={`/operators/${row.original.address}`}
        className="flex items-center gap-3 hover:underline py-2"
      >
        {row.original.metadataLogo && (
          <img
            src={row.original.metadataLogo}
            alt={row.original.metadataName || "Operator"}
            className="h-10 w-10 rounded-full object-cover flex-shrink-0"
          />
        )}
        <div className="flex flex-col gap-1">
          <span className="font-semibold text-base">
            {row.original.metadataName || "Unknown Operator"}
          </span>
          <span className="font-mono text-xs text-muted-foreground">
            {row.original.address.slice(0, 8)}...
            {row.original.address.slice(-6)}
          </span>
        </div>
      </Link>
    ),
  },
  {
    accessorKey: "chain",
    header: "Chain",
    cell: () => (
      <div className="flex items-center gap-2">
        <span className="font-medium">Ethereum</span>
        <Badge variant="secondary" className="text-xs">
          Mainnet
        </Badge>
      </div>
    ),
  },
  {
    accessorKey: "totalAvs",
    header: () => <div className="text-right">AVS Count</div>,
    cell: ({ row }) => (
      <div className="text-right font-medium">
        {row.original.totalAvs.toLocaleString()}
      </div>
    ),
  },
  {
    accessorKey: "totalStakers",
    header: () => <div className="text-right">Stakers</div>,
    cell: ({ row }) => (
      <div className="text-right font-medium">
        {row.original.totalStakers.toLocaleString()}
      </div>
    ),
  },
  {
    accessorKey: "maxApy",
    header: () => <div className="text-right">Max APY</div>,
    cell: ({ row }) => (
      <div className="text-right">
        {row.original.maxApy && parseFloat(row.original.maxApy) > 0 ? (
          <Badge
            variant="outline"
            className="text-green-600 dark:text-green-400"
          >
            {parseFloat(row.original.maxApy).toFixed(2)}%
          </Badge>
        ) : (
          <span className="text-muted-foreground">N/A</span>
        )}
      </div>
    ),
  },
  {
    id: "askAI",
    header: () => <div className="text-center">Ask AI</div>,
    cell: ({ row }) => {
      const { openChatWithInput } = useChatContext();
      return (
        <div className="text-center">
          <Button
            variant="outline"
            size="sm"
            className="h-8 gap-2"
            onClick={() => {
              const query = `Operator: ${row.original.address} on Ethereum Mainnet`;
              openChatWithInput(query);
            }}
          >
            <IconSparkles className="h-4 w-4" />
            Ask AI
          </Button>
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="data-[state=open]:bg-muted text-muted-foreground flex size-8"
            size="icon"
          >
            <IconDotsVertical />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          {row.original.metadataWebsite && (
            <DropdownMenuItem asChild>
              <a
                href={row.original.metadataWebsite}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                <IconExternalLink className="h-4 w-4" />
                Visit Website
              </a>
            </DropdownMenuItem>
          )}
          <DropdownMenuItem asChild>
            <a
              href={`https://etherscan.io/address/${row.original.address}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2"
            >
              <IconExternalLink className="h-4 w-4" />
              View on Etherscan
            </a>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>View Details</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];

interface DataTableProps {
  avsData: AVSData[];
  operatorsData: OperatorData[];
}

export function DataTable({ avsData, operatorsData }: DataTableProps) {
  const [activeTab, setActiveTab] = React.useState("avs");

  return (
    <Tabs
      value={activeTab}
      onValueChange={setActiveTab}
      className="w-full flex-col justify-start gap-6"
    >
      <div className="flex items-center justify-between px-4 lg:px-6">
        <Label htmlFor="view-selector" className="sr-only">
          View
        </Label>
        <Select value={activeTab} onValueChange={setActiveTab}>
          <SelectTrigger
            className="flex w-fit @4xl/main:hidden"
            size="sm"
            id="view-selector"
          >
            <SelectValue placeholder="Select a view" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="avs">AVS</SelectItem>
            <SelectItem value="operators">Operators</SelectItem>
          </SelectContent>
        </Select>
        <TabsList className="**:data-[slot=badge]:bg-muted-foreground/30 hidden **:data-[slot=badge]:size-5 **:data-[slot=badge]:rounded-full **:data-[slot=badge]:px-1 @4xl/main:flex">
          <TabsTrigger value="avs">
            AVS <Badge variant="secondary">{avsData.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="operators">
            Operators <Badge variant="secondary">{operatorsData.length}</Badge>
          </TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="avs" className="px-4 lg:px-6">
        <EigenLayerTable data={avsData} columns={avsColumns} />
      </TabsContent>

      <TabsContent value="operators" className="px-4 lg:px-6">
        <EigenLayerTable data={operatorsData} columns={operatorColumns} />
      </TabsContent>
    </Tabs>
  );
}

function EigenLayerTable<TData>({
  data,
  columns,
}: {
  data: TData[];
  columns: ColumnDef<TData>[];
}) {
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-2">
        <Input
          placeholder="Search..."
          value={
            (table.getColumn("metadataName")?.getFilterValue() as string) ??
            (table.getColumn("name")?.getFilterValue() as string) ??
            ""
          }
          onChange={(event) => {
            const nameColumn =
              table.getColumn("metadataName") || table.getColumn("name");
            nameColumn?.setFilterValue(event.target.value);
          }}
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <IconLayoutColumns />
              <span className="hidden lg:inline">Columns</span>
              <IconChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="overflow-hidden rounded-lg border">
        <Table>
          <TableHeader className="bg-muted">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} colSpan={header.colSpan}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="h-20"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="py-4">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-muted-foreground hidden flex-1 text-sm lg:flex">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="flex w-full items-center gap-8 lg:w-fit">
          <div className="hidden items-center gap-2 lg:flex">
            <Label htmlFor="rows-per-page" className="text-sm font-medium">
              Rows per page
            </Label>
            <Select
              value={`${table.getState().pagination.pageSize}`}
              onValueChange={(value) => {
                table.setPageSize(Number(value));
              }}
            >
              <SelectTrigger size="sm" className="w-20" id="rows-per-page">
                <SelectValue
                  placeholder={table.getState().pagination.pageSize}
                />
              </SelectTrigger>
              <SelectContent side="top">
                {[10, 20, 30, 40, 50].map((pageSize) => (
                  <SelectItem key={pageSize} value={`${pageSize}`}>
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex w-fit items-center justify-center text-sm font-medium">
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </div>
          <div className="ml-auto flex items-center gap-2 lg:ml-0">
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">Go to first page</span>
              <IconChevronsLeft />
            </Button>
            <Button
              variant="outline"
              className="size-8"
              size="icon"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">Go to previous page</span>
              <IconChevronLeft />
            </Button>
            <Button
              variant="outline"
              className="size-8"
              size="icon"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">Go to next page</span>
              <IconChevronRight />
            </Button>
            <Button
              variant="outline"
              className="hidden size-8 lg:flex"
              size="icon"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">Go to last page</span>
              <IconChevronsRight />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
