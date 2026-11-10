import { useEffect, useMemo, useState, type FormEvent } from "react";
import {
  Copy,
  MoreHorizontal,
  Search,
  UserPlus,
  Eye,
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
import { userStatusMeta } from "../../lib/status";
import { copyToClipboard, formatDate } from "../../lib/utils";
import { useDebounce } from "../../hooks/useDebounce";
import { usePagination } from "../../hooks/usePagination";
import { userService } from "../../services/user.service";
import { useToast } from "../../contexts/toast";
import type { User, UserStatus } from "../../types";

const statusOptions = [
  { label: "All statuses", value: "all" },
  { label: "Active", value: "active" },
  { label: "Invited", value: "invited" },
  { label: "Inactive", value: "inactive" },
];

const roleOptions = [
  { label: "Admin", value: "Admin" },
  { label: "Manager", value: "Manager" },
  { label: "Developer", value: "Developer" },
  { label: "Viewer", value: "Viewer" },
];

type StatusFilter = UserStatus | "all";

interface InviteFormState {
  name: string;
  email: string;
  role: User["role"];
}

const emptyInviteForm: InviteFormState = {
  name: "",
  email: "",
  role: "Viewer",
};

export function UsersPage() {
  const { toast } = useToast();
  const [userList, setUserList] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteForm, setInviteForm] =
    useState<InviteFormState>(emptyInviteForm);
  const [inviteErrors, setInviteErrors] = useState<{
    name?: string;
    email?: string;
  }>({});
  const [loading, setLoading] = useState(true);

  const debouncedSearch = useDebounce(search, 300);

  useEffect(() => {
    userService
      .getUsers({ status: status === "all" ? undefined : status })
      .then(
        (data) => {
          setUserList(data);
          setLoading(false);
        },
        () => setLoading(false),
      );
  }, [status]);

  const filteredUsers = useMemo(() => {
    const query = debouncedSearch.trim().toLowerCase();

    return userList.filter((user) => {
      const matchesSearch =
        !query ||
        [user.name, user.email, user.role].some((value) =>
          value.toLowerCase().includes(query),
        );
      const matchesStatus = status === "all" || user.status === status;

      return matchesSearch && matchesStatus;
    });
  }, [userList, debouncedSearch, status]);

  const pagination = usePagination(filteredUsers, 8);

  useEffect(() => {
    pagination.setPage(1);
  }, [debouncedSearch, pagination]);

  const resetFilters = () => {
    setSearch("");
    setStatus("all");
    pagination.setPage(1);
  };

  const copyEmail = async (email: string) => {
    const copied = await copyToClipboard(email);

    toast({
      title: copied ? "Email copied" : "Unable to copy",
      description: copied ? email : "Clipboard access is not available.",
      variant: copied ? "success" : "error",
    });
  };

  const openInvite = () => {
    setInviteForm(emptyInviteForm);
    setInviteErrors({});
    setInviteOpen(true);
  };

  const closeInvite = () => {
    setInviteOpen(false);
    setInviteForm(emptyInviteForm);
    setInviteErrors({});
  };

  const submitInvite = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const errors: { name?: string; email?: string } = {};

    if (!inviteForm.name.trim()) {
      errors.name = "Enter a name for this teammate.";
    }

    if (!inviteForm.email.trim()) {
      errors.email = "Enter an email address.";
    } else if (!/^\S+@\S+\.\S+$/.test(inviteForm.email.trim())) {
      errors.email = "Enter a valid email address.";
    }

    if (Object.keys(errors).length > 0) {
      setInviteErrors(errors);
      return;
    }

    const newUser: User = {
      id: `usr_${Date.now()}`,
      name: inviteForm.name.trim(),
      email: inviteForm.email.trim(),
      role: inviteForm.role,
      status: "invited",
      joinedAt: new Date().toISOString().slice(0, 10),
      lastActive: "Invitation sent",
    };

    setUserList((current) => [newUser, ...current]);
    closeInvite();
    setStatus("all");
    setSearch("");
    pagination.setPage(1);

    toast({
      title: "Invitation sent",
      description: `${newUser.name} has been invited as ${newUser.role.toLowerCase()}.`,
      variant: "success",
    });
  };

  const columns: DataTableColumn<User>[] = [
    {
      key: "user",
      header: "User",
      cell: (user) => (
        <div className="flex items-center gap-2.5">
          <Avatar name={user.name} size="sm" />
          <div className="min-w-0">
            <p className="text-xs font-medium text-foreground">{user.name}</p>
            <p className="truncate text-xs text-muted-foreground">
              {user.email}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: "role",
      header: "Role",
      cell: (user) => (
        <span className="text-xs text-muted-foreground">{user.role}</span>
      ),
    },
    {
      key: "status",
      header: "Status",
      cell: (user) => {
        const meta = userStatusMeta[user.status];
        return <Badge variant={meta.variant}>{meta.label}</Badge>;
      },
    },
    {
      key: "joined",
      header: "Joined",
      cell: (user) => (
        <span className="text-xs text-muted-foreground">
          {formatDate(user.joinedAt)}
        </span>
      ),
    },
    {
      key: "lastActive",
      header: "Last active",
      cell: (user) => (
        <span className="text-xs text-muted-foreground">{user.lastActive}</span>
      ),
    },
    {
      key: "actions",
      header: "",
      align: "right",
      cell: (user) => (
        <Dropdown
          ariaLabel={`Actions for ${user.name}`}
          triggerClassName="p-1.5 text-muted-foreground hover:bg-subtle hover:text-foreground"
          panelClassName="w-48"
          trigger={<MoreHorizontal className="size-4" />}
        >
          <DropdownItem icon={Eye} onSelect={() => setSelectedUser(user)}>
            View details
          </DropdownItem>
          <DropdownItem
            icon={Copy}
            onSelect={() => void copyEmail(user.email)}
          >
            Copy email
          </DropdownItem>
        </Dropdown>
      ),
    },
  ];

  return (
    <PageContainer
      title="Users"
      description="Manage teammates, roles, and workspace access."
      actions={
        <Button leftIcon={<UserPlus className="size-4" />} onClick={openInvite}>
          Invite user
        </Button>
      }
    >
      <Card>
        <CardHeader className="flex-col gap-4 sm:flex-row sm:items-center">
          <div>
            <CardTitle>All users</CardTitle>
            <CardDescription>
              {pagination.totalItems} teammates in this workspace
            </CardDescription>
          </div>
          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
            <Input
              leadingIcon={Search}
              placeholder="Search users..."
              aria-label="Search users"
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
              getRowKey={(user) => user.id}
              loading={loading}
            emptyTitle="No users found"
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
            itemLabel="users"
          />
        </div>
      </Card>

      <Modal
        open={selectedUser !== null}
        onClose={() => setSelectedUser(null)}
        title="User details"
        description={selectedUser?.email}
        size="sm"
        footer={
          <Button variant="outline" onClick={() => setSelectedUser(null)}>
            Close
          </Button>
        }
      >
        {selectedUser ? (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Avatar name={selectedUser.name} size="lg" />
              <div>
                <p className="text-sm font-semibold text-foreground">
                  {selectedUser.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {selectedUser.role}
                </p>
              </div>
            </div>
            <dl className="space-y-3 text-sm">
              <div className="flex items-center justify-between gap-4">
                <dt className="text-muted-foreground">Status</dt>
                <dd>
                  <Badge variant={userStatusMeta[selectedUser.status].variant}>
                    {userStatusMeta[selectedUser.status].label}
                  </Badge>
                </dd>
              </div>
              <div className="flex items-center justify-between gap-4">
                <dt className="text-muted-foreground">Joined</dt>
                <dd className="text-foreground">
                  {formatDate(selectedUser.joinedAt)}
                </dd>
              </div>
              <div className="flex items-center justify-between gap-4">
                <dt className="text-muted-foreground">Last active</dt>
                <dd className="text-foreground">{selectedUser.lastActive}</dd>
              </div>
            </dl>
          </div>
        ) : null}
      </Modal>

      <Modal
        open={inviteOpen}
        onClose={closeInvite}
        title="Invite a teammate"
        description="They will receive an email invitation to join this workspace."
        size="sm"
        footer={
          <>
            <Button variant="outline" onClick={closeInvite}>
              Cancel
            </Button>
            <Button type="submit" form="invite-user-form">
              Send invitation
            </Button>
          </>
        }
      >
        <form
          id="invite-user-form"
          noValidate
          onSubmit={submitInvite}
          className="space-y-4"
        >
          <Input
            label="Full name"
            placeholder="Jane Cooper"
            value={inviteForm.name}
            onChange={(event) =>
              setInviteForm((current) => ({
                ...current,
                name: event.target.value,
              }))
            }
            error={inviteErrors.name}
          />
          <Input
            label="Email address"
            type="email"
            placeholder="jane@company.com"
            value={inviteForm.email}
            onChange={(event) =>
              setInviteForm((current) => ({
                ...current,
                email: event.target.value,
              }))
            }
            error={inviteErrors.email}
          />
          <Select
            label="Role"
            options={roleOptions}
            value={inviteForm.role}
            onChange={(event) =>
              setInviteForm((current) => ({
                ...current,
                role: event.target.value as User["role"],
              }))
            }
          />
        </form>
      </Modal>
    </PageContainer>
  );
}
