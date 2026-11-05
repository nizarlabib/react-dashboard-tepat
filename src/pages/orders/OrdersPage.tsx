import { useEffect, useMemo, useState } from "react";
import {
  Copy,
  Download,
  Eye,
  MoreHorizontal,
  Search,
} from "lucide-react";
import { DataTable, type DataTableColumn } from "../../components/data-display/DataTable";
import { Avatar } from "../../components/ui/Avatar";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { Card, CardDescription, CardHeader, CardTitle } from "../../components/ui/Card";
import { Dropdown, DropdownItem } from "../../components/ui/Dropdown";
import { Input } from "../../components/ui/Input";
import { Modal } from "../../components/ui/Modal";
import { Pagination } from "../../components/ui/Pagination";
import { Select } from "../../components/ui/Select";
import { PageContainer } from "../../components/layout/PageContainer";
import { downloadCsv } from "../../lib/csv";
import { transactionStatusMeta } from "../../lib/status";
import { copyToClipboard, formatCurrency, formatDate } from "../../lib/utils";
import { useDebounce } from "../../hooks/useDebounce";
import { usePagination } from "../../hooks/usePagination";
import { orderService } from "../../services/order.service";
import { useToast } from "../../contexts/toast";
import type { Transaction, TransactionStatus } from "../../types";

const statusOptions = [
  { label: "All statuses", value: "all" },
  { label: "Completed", value: "completed" },
  { label: "Pending", value: "pending" },
  { label: "Failed", value: "failed" },
  { label: "Refunded", value: "refunded" },
];

type StatusFilter = TransactionStatus | "all";

export function OrdersPage() {
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [orders, setOrders] = useState<Transaction[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Transaction | null>(null);
  const [loading, setLoading] = useState(true);

  const debouncedSearch = useDebounce(search, 300);

  useEffect(() => {
    orderService
      .getOrders({
        status: status === "all" ? undefined : status,
      })
      .then(
        (data) => {
          setOrders(data);
          setLoading(false);
        },
        () => setLoading(false),
      );
  }, [status]);

  const filteredOrders = useMemo(() => {
    const query = debouncedSearch.trim().toLowerCase();

    return orders.filter((order) => {
      const matchesSearch =
        !query ||
        [order.id, order.customer, order.email, order.method].some((value) =>
          value.toLowerCase().includes(query),
        );
      const matchesStatus = status === "all" || order.status === status;

      return matchesSearch && matchesStatus;
    });
  }, [orders, debouncedSearch, status]);

  const pagination = usePagination(filteredOrders, 8);

  useEffect(() => {
    pagination.setPage(1);
  }, [debouncedSearch, pagination]);

  const resetFilters = () => {
    setSearch("");
    setStatus("all");
    pagination.setPage(1);
  };

  const copyOrderId = async (id: string) => {
    const copied = await copyToClipboard(id);

    toast({
      title: copied ? "Order ID copied" : "Unable to copy",
      description: copied ? id : "Clipboard access is not available.",
      variant: copied ? "success" : "error",
    });
  };

  const exportOrders = () => {
    downloadCsv(
      "orders.csv",
      filteredOrders.map((order) => ({
        Order: order.id,
        Customer: order.customer,
        Email: order.email,
        Date: order.date,
        Amount: order.amount,
        Status: order.status,
        Method: order.method,
      })),
    );

    toast({
      title: "Orders exported",
      description: `${filteredOrders.length} orders downloaded as CSV.`,
      variant: "success",
    });
  };

  const columns: DataTableColumn<Transaction>[] = [
    {
      key: "order",
      header: "Order",
      cell: (order) => (
        <div>
          <p className="font-mono text-xs font-medium text-foreground">
            {order.id}
          </p>
          <p className="text-xs text-muted-foreground">{order.method}</p>
        </div>
      ),
    },
    {
      key: "customer",
      header: "Customer",
      cell: (order) => (
        <div className="flex items-center gap-2.5">
          <Avatar name={order.customer} size="sm" />
          <div className="min-w-0">
            <p className="text-xs font-medium text-foreground">
              {order.customer}
            </p>
            <p className="truncate text-xs text-muted-foreground">
              {order.email}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: "date",
      header: "Date",
      cell: (order) => (
        <span className="text-xs text-muted-foreground">
          {formatDate(order.date)}
        </span>
      ),
    },
    {
      key: "amount",
      header: "Amount",
      align: "right",
      cell: (order) => (
        <span className="text-xs font-medium tabular-nums text-foreground">
          {formatCurrency(order.amount)}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      cell: (order) => {
        const meta = transactionStatusMeta[order.status];
        return <Badge variant={meta.variant}>{meta.label}</Badge>;
      },
    },
    {
      key: "actions",
      header: "",
      align: "right",
      cell: (order) => (
        <Dropdown
          ariaLabel={`Actions for ${order.id}`}
          triggerClassName="p-1.5 text-muted-foreground hover:bg-subtle hover:text-foreground"
          panelClassName="w-48"
          trigger={<MoreHorizontal className="size-4" />}
        >
          <DropdownItem icon={Eye} onSelect={() => setSelectedOrder(order)}>
            View order
          </DropdownItem>
          <DropdownItem
            icon={Copy}
            onSelect={() => void copyOrderId(order.id)}
          >
            Copy order ID
          </DropdownItem>
        </Dropdown>
      ),
    },
  ];

  return (
    <PageContainer
      title="Orders"
      description="Review payments and manage order fulfillment."
      actions={
        <Button
          variant="outline"
          leftIcon={<Download className="size-4" />}
          onClick={exportOrders}
          disabled={filteredOrders.length === 0}
        >
          Export
        </Button>
      }
    >
      <Card>
        <CardHeader className="flex-col gap-4 sm:flex-row sm:items-center">
          <div>
            <CardTitle>All orders</CardTitle>
            <CardDescription>
              {pagination.totalItems} orders match your current view
            </CardDescription>
          </div>
          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
            <Input
              leadingIcon={Search}
              placeholder="Search orders..."
              aria-label="Search orders"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              containerClassName="sm:w-56"
            />
            <Select
              aria-label="Filter by status"
              options={statusOptions}
              value={status}
              onChange={(event) => {
                setStatus(event.target.value as StatusFilter);
                pagination.setPage(1);
              }}
              containerClassName="sm:w-36"
            />
          </div>
        </CardHeader>
        <div className="mt-4 border-t border-border">
            <DataTable
              columns={columns}
              data={pagination.paginated}
              getRowKey={(order) => order.id}
              loading={loading}
            emptyTitle="No orders found"
            emptyDescription="Try a different search term or status filter."
            emptyAction={
              <Button variant="outline" size="sm" onClick={resetFilters}>
                Reset filters
              </Button>
            }
          />
        </div>
        <div className="border-t border-border p-4">
          <Pagination
            page={pagination.page}
            totalPages={pagination.totalPages}
            onPageChange={pagination.setPage}
            startItem={pagination.startItem}
            endItem={pagination.endItem}
            totalItems={pagination.totalItems}
            itemLabel="orders"
          />
        </div>
      </Card>

      <Modal
        open={selectedOrder !== null}
        onClose={() => setSelectedOrder(null)}
        title="Order details"
        description={selectedOrder?.id}
        size="sm"
        footer={
          <Button variant="outline" onClick={() => setSelectedOrder(null)}>
            Close
          </Button>
        }
      >
        {selectedOrder ? (
          <dl className="space-y-3 text-sm">
            <div className="flex items-center justify-between gap-4">
              <dt className="text-muted-foreground">Customer</dt>
              <dd className="font-medium text-foreground">
                {selectedOrder.customer}
              </dd>
            </div>
            <div className="flex items-center justify-between gap-4">
              <dt className="text-muted-foreground">Email</dt>
              <dd className="truncate text-foreground">{selectedOrder.email}</dd>
            </div>
            <div className="flex items-center justify-between gap-4">
              <dt className="text-muted-foreground">Date</dt>
              <dd className="text-foreground">
                {formatDate(selectedOrder.date)}
              </dd>
            </div>
            <div className="flex items-center justify-between gap-4">
              <dt className="text-muted-foreground">Payment method</dt>
              <dd className="text-foreground">{selectedOrder.method}</dd>
            </div>
            <div className="flex items-center justify-between gap-4">
              <dt className="text-muted-foreground">Amount</dt>
              <dd className="font-medium tabular-nums text-foreground">
                {formatCurrency(selectedOrder.amount)}
              </dd>
            </div>
            <div className="flex items-center justify-between gap-4">
              <dt className="text-muted-foreground">Status</dt>
              <dd>
                <Badge
                  variant={transactionStatusMeta[selectedOrder.status].variant}
                >
                  {transactionStatusMeta[selectedOrder.status].label}
                </Badge>
              </dd>
            </div>
          </dl>
        ) : null}
      </Modal>
    </PageContainer>
  );
}
