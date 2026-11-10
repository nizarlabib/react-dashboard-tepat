import { useEffect, useMemo, useState, type FormEvent } from "react";
import {
  Copy,
  Eye,
  MoreHorizontal,
  Package,
  Plus,
  Search,
} from "lucide-react";
import { DataTable, type DataTableColumn } from "../../components/data-display/DataTable";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { Card, CardDescription, CardHeader, CardTitle } from "../../components/ui/Card";
import { Dropdown, DropdownItem } from "../../components/ui/Dropdown";
import { Input } from "../../components/ui/Input";
import { Modal } from "../../components/ui/Modal";
import { Pagination } from "../../components/ui/Pagination";
import { Select } from "../../components/ui/Select";
import { PageContainer } from "../../components/layout/PageContainer";
import { productStatusMeta } from "../../lib/status";
import { copyToClipboard, formatCurrency } from "../../lib/utils";
import { useDebounce } from "../../hooks/useDebounce";
import { usePagination } from "../../hooks/usePagination";
import { productService } from "../../services/product.service";
import { useToast } from "../../contexts/toast";
import type { Product, ProductStatus } from "../../types";

const categoryFormOptions = [
  { label: "Software", value: "Software" },
  { label: "Hardware", value: "Hardware" },
  { label: "Accessories", value: "Accessories" },
  { label: "Wearables", value: "Wearables" },
  { label: "Subscription", value: "Subscription" },
];

interface ProductFormState {
  name: string;
  category: string;
  price: string;
  stock: string;
}

const emptyProductForm: ProductFormState = {
  name: "",
  category: "Software",
  price: "",
  stock: "",
};

function getStockStatus(stock: number): ProductStatus {
  if (stock === 0) {
    return "out_of_stock";
  }

  if (stock < 10) {
    return "low_stock";
  }

  return "in_stock";
}

export function ProductsPage() {
  const { toast } = useToast();
  const [productList, setProductList] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState<ProductFormState>(emptyProductForm);
  const [errors, setErrors] = useState<{
    name?: string;
    price?: string;
    stock?: string;
  }>({});
  const [loading, setLoading] = useState(true);

  const debouncedSearch = useDebounce(search, 300);

  useEffect(() => {
    productService
      .getProducts({
        category: category === "all" ? undefined : category,
      })
      .then(
        (data) => {
          setProductList(data);
          setLoading(false);
        },
        () => setLoading(false),
      );
  }, [category]);

  const categoryOptions = useMemo(
    () => [
      { label: "All categories", value: "all" },
      ...Array.from(new Set(productList.map((product) => product.category))).map(
        (value) => ({ label: value, value }),
      ),
    ],
    [productList],
  );

  const filteredProducts = useMemo(() => {
    const query = debouncedSearch.trim().toLowerCase();

    return productList.filter((product) => {
      const matchesSearch =
        !query ||
        [product.name, product.sku, product.category].some((value) =>
          value.toLowerCase().includes(query),
        );
      const matchesCategory =
        category === "all" || product.category === category;

      return matchesSearch && matchesCategory;
    });
  }, [productList, debouncedSearch, category]);

  const pagination = usePagination(filteredProducts, 8);

  useEffect(() => {
    pagination.setPage(1);
  }, [debouncedSearch, pagination]);

  const resetFilters = () => {
    setSearch("");
    setCategory("all");
    pagination.setPage(1);
  };

  const copySku = async (sku: string) => {
    const copied = await copyToClipboard(sku);

    toast({
      title: copied ? "SKU copied" : "Unable to copy",
      description: copied ? sku : "Clipboard access is not available.",
      variant: copied ? "success" : "error",
    });
  };

  const openForm = () => {
    setForm(emptyProductForm);
    setErrors({});
    setFormOpen(true);
  };

  const closeForm = () => {
    setFormOpen(false);
    setForm(emptyProductForm);
    setErrors({});
  };

  const submitProduct = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextErrors: {
      name?: string;
      price?: string;
      stock?: string;
    } = {};
    const price = Number(form.price);
    const stock = Number(form.stock);

    if (!form.name.trim()) {
      nextErrors.name = "Enter a product name.";
    }

    if (!form.price.trim() || Number.isNaN(price) || price <= 0) {
      nextErrors.price = "Enter a price greater than zero.";
    }

    if (
      !form.stock.trim() ||
      Number.isNaN(stock) ||
      stock < 0 ||
      !Number.isInteger(stock)
    ) {
      nextErrors.stock = "Enter a whole number of units.";
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    const prefix =
      form.name
        .trim()
        .replace(/[^a-zA-Z]/g, "")
        .slice(0, 3)
        .toUpperCase() || "SKU";
    const sku = `${prefix}-${Date.now().toString().slice(-4)}`;

    const newProduct: Product = {
      id: `prd_${Date.now()}`,
      name: form.name.trim(),
      sku,
      category: form.category,
      price,
      stock,
      status: getStockStatus(stock),
    };

    setProductList((current) => [newProduct, ...current]);
    closeForm();
    setCategory("all");
    setSearch("");
    pagination.setPage(1);

    toast({
      title: "Product added",
      description: `${newProduct.name} is now in your catalog.`,
      variant: "success",
    });
  };

  const columns: DataTableColumn<Product>[] = [
    {
      key: "product",
      header: "Product",
      cell: (product) => (
        <div className="flex items-center gap-2.5">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-subtle text-muted-foreground">
            <Package className="size-4" aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <p className="text-xs font-medium text-foreground">
              {product.name}
            </p>
            <p className="font-mono text-xs text-muted-foreground">
              {product.sku}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: "category",
      header: "Category",
      cell: (product) => (
        <span className="text-xs text-muted-foreground">{product.category}</span>
      ),
    },
    {
      key: "price",
      header: "Price",
      align: "right",
      cell: (product) => (
        <span className="text-xs font-medium tabular-nums text-foreground">
          {formatCurrency(product.price, {
            minimumFractionDigits: product.price < 100 ? 2 : 0,
            maximumFractionDigits: 2,
          })}
        </span>
      ),
    },
    {
      key: "stock",
      header: "Stock",
      align: "right",
      cell: (product) => (
        <span className="text-xs text-muted-foreground">
          {product.stock >= 999 ? "Unlimited" : product.stock}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      cell: (product) => {
        const meta = productStatusMeta[product.status];
        return <Badge variant={meta.variant}>{meta.label}</Badge>;
      },
    },
    {
      key: "actions",
      header: "",
      align: "right",
      cell: (product) => (
        <Dropdown
          ariaLabel={`Actions for ${product.name}`}
          triggerClassName="p-1.5 text-muted-foreground hover:bg-subtle hover:text-foreground"
          panelClassName="w-44"
          trigger={<MoreHorizontal className="size-4" />}
        >
          <DropdownItem icon={Eye} onSelect={() => setSelectedProduct(product)}>
            View details
          </DropdownItem>
          <DropdownItem
            icon={Copy}
            onSelect={() => void copySku(product.sku)}
          >
            Copy SKU
          </DropdownItem>
        </Dropdown>
      ),
    },
  ];

  return (
    <PageContainer
      title="Products"
      description="Manage your catalog, pricing, and inventory levels."
      actions={
        <Button leftIcon={<Plus className="size-4" />} onClick={openForm}>
          Add product
        </Button>
      }
    >
      <Card>
        <CardHeader className="flex-col gap-4 sm:flex-row sm:items-center">
          <div>
            <CardTitle>Product catalog</CardTitle>
            <CardDescription>
              {pagination.totalItems} products available
            </CardDescription>
          </div>
          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
            <Input
              leadingIcon={Search}
              placeholder="Search products..."
              aria-label="Search products"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              containerClassName="sm:w-56"
            />
            <Select
              aria-label="Filter by category"
              options={categoryOptions}
              value={category}
              onChange={(event) => {
                setCategory(event.target.value);
                pagination.setPage(1);
              }}
              containerClassName="sm:w-40"
            />
          </div>
        </CardHeader>
        <div className="mt-4 border-t border-border">
            <DataTable
              columns={columns}
              data={pagination.paginated}
              getRowKey={(product) => product.id}
              loading={loading}
            emptyTitle="No products found"
            emptyDescription="Try a different search term or category."
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
            itemLabel="products"
          />
        </div>
      </Card>

      <Modal
        open={selectedProduct !== null}
        onClose={() => setSelectedProduct(null)}
        title="Product details"
        description={selectedProduct?.sku}
        size="sm"
        footer={
          <Button variant="outline" onClick={() => setSelectedProduct(null)}>
            Close
          </Button>
        }
      >
        {selectedProduct ? (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="flex size-12 items-center justify-center rounded-xl bg-subtle text-muted-foreground">
                <Package className="size-5" aria-hidden="true" />
              </span>
              <div>
                <p className="text-sm font-semibold text-foreground">
                  {selectedProduct.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {selectedProduct.category}
                </p>
              </div>
            </div>
            <dl className="space-y-3 text-sm">
              <div className="flex items-center justify-between gap-4">
                <dt className="text-muted-foreground">Price</dt>
                <dd className="font-medium tabular-nums text-foreground">
                  {formatCurrency(selectedProduct.price, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </dd>
              </div>
              <div className="flex items-center justify-between gap-4">
                <dt className="text-muted-foreground">Stock</dt>
                <dd className="text-foreground">
                  {selectedProduct.stock >= 999
                    ? "Unlimited"
                    : `${selectedProduct.stock} units`}
                </dd>
              </div>
              <div className="flex items-center justify-between gap-4">
                <dt className="text-muted-foreground">Status</dt>
                <dd>
                  <Badge
                    variant={productStatusMeta[selectedProduct.status].variant}
                  >
                    {productStatusMeta[selectedProduct.status].label}
                  </Badge>
                </dd>
              </div>
            </dl>
          </div>
        ) : null}
      </Modal>

      <Modal
        open={formOpen}
        onClose={closeForm}
        title="Add product"
        description="Create a new product entry for your catalog."
        size="sm"
        footer={
          <>
            <Button variant="outline" onClick={closeForm}>
              Cancel
            </Button>
            <Button type="submit" form="add-product-form">
              Add product
            </Button>
          </>
        }
      >
        <form
          id="add-product-form"
          noValidate
          onSubmit={submitProduct}
          className="space-y-4"
        >
          <Input
            label="Product name"
            placeholder="Nova Wireless Charger"
            value={form.name}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                name: event.target.value,
              }))
            }
            error={errors.name}
          />
          <Select
            label="Category"
            options={categoryFormOptions}
            value={form.category}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                category: event.target.value,
              }))
            }
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Price (USD)"
              inputMode="decimal"
              placeholder="99"
              value={form.price}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  price: event.target.value,
                }))
              }
              error={errors.price}
            />
            <Input
              label="Stock"
              inputMode="numeric"
              placeholder="25"
              value={form.stock}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  stock: event.target.value,
                }))
              }
              error={errors.stock}
            />
          </div>
        </form>
      </Modal>
    </PageContainer>
  );
}
