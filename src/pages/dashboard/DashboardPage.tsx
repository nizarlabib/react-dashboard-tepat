import { useEffect, useMemo, useState } from "react";
import {
  Copy,
  Download,
  Eye,
  MoreHorizontal,
  Search,
} from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ActivityFeed } from "../../components/data-display/ActivityFeed";
import { ChartContainer } from "../../components/data-display/ChartContainer";
import { DataTable, type DataTableColumn } from "../../components/data-display/DataTable";
import { StatCard } from "../../components/data-display/StatCard";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/Card";
import { Dropdown, DropdownItem } from "../../components/ui/Dropdown";
import { Input } from "../../components/ui/Input";
import { Modal } from "../../components/ui/Modal";
import { Pagination } from "../../components/ui/Pagination";
import { Select } from "../../components/ui/Select";
import { PageContainer } from "../../components/layout/PageContainer";
import { chartAxisTick, chartGridStroke, chartTooltipStyle } from "../../lib/chart";
import { downloadCsv } from "../../lib/csv";
import { transactionStatusMeta } from "../../lib/status";
import {
  copyToClipboard,
  formatCurrency,
  formatDate,
  getInitials,
} from "../../lib/utils";
import { useDebounce } from "../../hooks/useDebounce";
import { usePagination } from "../../hooks/usePagination";
import { dashboardService } from "../../services/dashboard.service";
import { useToast } from "../../contexts/toast";
import {
  overviewStats,
  recentActivities,
  revenueByRange,
} from "../../mock/data";
import { chartRangeOptions } from "../../constants/navigation";
import type { ChartRange, Transaction, TransactionStatus } from "../../types";

const statusOptions = [
  { label: "All statuses", value: "all" },
  { label: "Completed", value: "completed" },
  { label: "Pending", value: "pending" },
  { label: "Failed", value: "failed" },
  { label: "Refunded", value: "refunded" },
];

type StatusFilter = TransactionStatus | "all";

export function DashboardPage() {
  const { toast } = useToast();
  const [range, setRange] = useState<ChartRange>("12m");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);
  const [loading, setLoading] = useState(true);

  const debouncedSearch = useDebounce(search, 300);
  const chartData = revenueByRange[range];

  useEffect(() => {
    dashboardService.getTransactions().then(
      (data) => {
        setTransactions(data);
        setLoading(false);
      },
      () => setLoading(false),
    );
  }, []);

  const filteredTransactions = useMemo(() => {
    const query = debouncedSearch.trim().toLowerCase();

    return transactions.filter((transaction) => {
      const matchesSearch =
        !query ||
        [transaction.customer, transaction.email, transaction.id].some((value) =>
          value.toLowerCase().includes(query),
        );
      const matchesStatus =
        status === "all" || transaction.status === status;

      return matchesSearch && matchesStatus;
    });
  }, [transactions, debouncedSearch, status]);

  const pagination = usePagination(filteredTransactions, 6);

  // Reset to the first page whenever the debounced search value changes.
  useEffect(() => {
    pagination.setPage(1);
  }, [debouncedSearch, pagination]);

  const resetFilters = () => {
    setSearch("");
    setStatus("all");
    pagination.setPage(1);
  };

  const copyTransactionId = async (id: string) => {
    const copied = await copyToClipboard(id);

    toast({
      title: copied ? "Transaction ID copied" : "Unable to copy",
      description: copied ? id : "Clipboard access is not available.",
      variant: copied ? "success" : "error",
    });
  };

  const exportReport = () => {
    downloadCsv(
      `revenue-${range}.csv`,
      chartData.map((point) => ({
        Period: point.label,
        Revenue: point.revenue,
        Expenses: point.expenses,
      })),
    );

    const rangeLabel =
      chartRangeOptions.find((option) => option.value === range)?.label ??
      "selected period";

    toast({
      title: "Report downloaded",
      description: `Revenue data for ${rangeLabel.toLowerCase()} is ready.`,
      variant: "success",
    });
  };

  const columns: DataTableColumn<Transaction>[] = [
    {
      key: "customer",
      header: "Customer",
      cell: (transaction) => (
        <div className="flex items-center gap-2.5">
          <span className="flex size-7 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
            {getInitials(transaction.customer)}
          </span>
          <div className="min-w-0">
            <p className="text-xs font-medium text-foreground">
              {transaction.customer}
            </p>
            <p className="truncate text-xs text-muted-foreground">
              {transaction.email}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: "id",
      header: "Transaction",
      cell: (transaction) => (
        <span className="font-mono text-xs text-muted-foreground">
          {transaction.id}
        </span>
      ),
    },
    {
      key: "date",
      header: "Date",
      cell: (transaction) => (
        <span className="text-xs text-muted-foreground">
          {formatDate(transaction.date)}
        </span>
      ),
    },
    {
      key: "amount",
      header: "Amount",
      align: "right",
      cell: (transaction) => (
        <span className="text-xs font-medium tabular-nums text-foreground">
          {formatCurrency(transaction.amount)}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      cell: (transaction) => {
        const meta = transactionStatusMeta[transaction.status];

        return <Badge variant={meta.variant}>{meta.label}</Badge>;
      },
    },
    {
      key: "actions",
      header: "",
      align: "right",
      cell: (transaction) => (
        <Dropdown
          ariaLabel={`Actions for ${transaction.id}`}
          triggerClassName="p-1.5 text-muted-foreground hover:bg-subtle hover:text-foreground"
          panelClassName="w-48"
          trigger={<MoreHorizontal className="size-4" />}
        >
          <DropdownItem
            icon={Eye}
            onSelect={() => setSelectedTransaction(transaction)}
          >
            View details
          </DropdownItem>
          <DropdownItem
            icon={Copy}
            onSelect={() => void copyTransactionId(transaction.id)}
          >
            Copy transaction ID
          </DropdownItem>
        </Dropdown>
      ),
    },
  ];

  return (
    <PageContainer
      title="Dashboard"
      description="Welcome back! Here's what's happening with your workspace."
      actions={
        <>
          <Select
            aria-label="Date range"
            options={chartRangeOptions}
            value={range}
            onChange={(event) => setRange(event.target.value as ChartRange)}
            containerClassName="w-40"
          />
          <Button
            variant="outline"
            leftIcon={<Download className="size-4" />}
            onClick={exportReport}
          >
            Export
          </Button>
        </>
      }
    >
      <div className="space-y-6">
        <section
          aria-label="Key statistics"
          className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
        >
          {overviewStats.map((stat) => (
            <StatCard key={stat.label} stat={stat} />
          ))}
        </section>

        <div className="grid gap-4 lg:grid-cols-3">
          <ChartContainer
            className="lg:col-span-2"
            title="Revenue overview"
            description="Revenue and expenses over the selected period"
            action={
              <Select
                aria-label="Chart period"
                options={chartRangeOptions}
                value={range}
                onChange={(event) => setRange(event.target.value as ChartRange)}
                containerClassName="w-36"
              />
            }
          >
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={chartData}
                  margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient
                      id="revenueFill"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="0%"
                        stopColor="var(--color-primary)"
                        stopOpacity={0.2}
                      />
                      <stop
                        offset="100%"
                        stopColor="var(--color-primary)"
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    vertical={false}
                    stroke={chartGridStroke}
                    strokeDasharray="3 3"
                  />
                  <XAxis
                    dataKey="label"
                    tickLine={false}
                    axisLine={false}
                    tick={chartAxisTick}
                    dy={8}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tick={chartAxisTick}
                    tickFormatter={(value) => `$${Number(value) / 1000}k`}
                    width={48}
                  />
                  <RechartsTooltip
                    contentStyle={chartTooltipStyle}
                    labelStyle={{ color: "var(--color-foreground)" }}
                    itemStyle={{ color: "var(--color-foreground)" }}
                    formatter={(value) => formatCurrency(Number(value))}
                  />
                  <Legend
                    iconType="circle"
                    iconSize={8}
                    wrapperStyle={{ fontSize: 12, paddingTop: 12 }}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    name="Revenue"
                    stroke="var(--color-primary)"
                    strokeWidth={2}
                    fill="url(#revenueFill)"
                  />
                  <Area
                    type="monotone"
                    dataKey="expenses"
                    name="Expenses"
                    stroke="var(--color-muted-foreground)"
                    strokeWidth={2}
                    fill="transparent"
                    strokeDasharray="4 4"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </ChartContainer>

          <Card>
            <CardHeader>
              <div>
                <CardTitle>Recent activity</CardTitle>
                <CardDescription>
                  Latest events across your workspace
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <ActivityFeed activities={recentActivities} />
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="flex-col gap-4 sm:flex-row sm:items-center">
            <div>
              <CardTitle>Recent transactions</CardTitle>
              <CardDescription>
                Search, filter, and review the latest payments
              </CardDescription>
            </div>
            <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
              <Input
                leadingIcon={Search}
                placeholder="Search transactions..."
                aria-label="Search transactions"
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
              getRowKey={(transaction) => transaction.id}
              loading={loading}
              emptyTitle="No transactions found"
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
              itemLabel="transactions"
            />
          </div>
        </Card>
      </div>

      <Modal
        open={selectedTransaction !== null}
        onClose={() => setSelectedTransaction(null)}
        title="Transaction details"
        description={selectedTransaction?.id}
        size="sm"
        footer={
          <Button
            variant="outline"
            onClick={() => setSelectedTransaction(null)}
          >
            Close
          </Button>
        }
      >
        {selectedTransaction ? (
          <dl className="space-y-3 text-sm">
            <div className="flex items-center justify-between gap-4">
              <dt className="text-muted-foreground">Customer</dt>
              <dd className="font-medium text-foreground">
                {selectedTransaction.customer}
              </dd>
            </div>
            <div className="flex items-center justify-between gap-4">
              <dt className="text-muted-foreground">Email</dt>
              <dd className="truncate text-foreground">
                {selectedTransaction.email}
              </dd>
            </div>
            <div className="flex items-center justify-between gap-4">
              <dt className="text-muted-foreground">Date</dt>
              <dd className="text-foreground">
                {formatDate(selectedTransaction.date)}
              </dd>
            </div>
            <div className="flex items-center justify-between gap-4">
              <dt className="text-muted-foreground">Payment method</dt>
              <dd className="text-foreground">
                {selectedTransaction.method}
              </dd>
            </div>
            <div className="flex items-center justify-between gap-4">
              <dt className="text-muted-foreground">Amount</dt>
              <dd className="font-medium tabular-nums text-foreground">
                {formatCurrency(selectedTransaction.amount)}
              </dd>
            </div>
            <div className="flex items-center justify-between gap-4">
              <dt className="text-muted-foreground">Status</dt>
              <dd>
                <Badge
                  variant={
                    transactionStatusMeta[selectedTransaction.status].variant
                  }
                >
                  {transactionStatusMeta[selectedTransaction.status].label}
                </Badge>
              </dd>
            </div>
          </dl>
        ) : null}
      </Modal>
    </PageContainer>
  );
}
