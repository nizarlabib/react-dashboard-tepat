import { useState, type FormEvent } from "react";
import type { LucideIcon } from "lucide-react";
import {
  Bell,
  Check,
  Lock,
  Monitor,
  Moon,
  Palette,
  Save,
  Settings,
  ShieldCheck,
  Sun,
  Trash2,
  User,
} from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { Avatar } from "../../components/ui/Avatar";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";
import { Modal } from "../../components/ui/Modal";
import { Switch } from "../../components/ui/Switch";
import { Tabs, type TabItem } from "../../components/ui/Tabs";
import { Textarea } from "../../components/ui/Textarea";
import { PageContainer } from "../../components/layout/PageContainer";
import { useToast } from "../../contexts/toast";
import { useTheme, type Theme } from "../../contexts/theme";
import { currentUser } from "../../mock/data";
import { cn } from "../../lib/utils";

const tabItems: TabItem[] = [
  { value: "general", label: "General", icon: Settings },
  { value: "profile", label: "Profile", icon: User },
  { value: "security", label: "Security", icon: ShieldCheck },
  { value: "notifications", label: "Notifications", icon: Bell },
  { value: "appearance", label: "Appearance", icon: Palette },
];

const themeOptions: Array<{
  value: Theme;
  label: string;
  description: string;
  icon: LucideIcon;
}> = [
  {
    value: "light",
    label: "Light",
    description: "Clean and bright interface.",
    icon: Sun,
  },
  {
    value: "dark",
    label: "Dark",
    description: "Reduced glare for low light.",
    icon: Moon,
  },
  {
    value: "system",
    label: "System",
    description: "Match your device settings.",
    icon: Monitor,
  },
];

function SectionHeading({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div>
      <h2 className="text-sm font-semibold text-foreground">{title}</h2>
      <p className="mt-1 text-xs text-muted-foreground">{description}</p>
    </div>
  );
}

export function SettingsPage() {
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();
  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get("tab");
  const activeTab =
    tabParam && tabItems.some((item) => item.value === tabParam)
      ? tabParam
      : "general";

  const [profile, setProfile] = useState({
    name: currentUser.name,
    email: currentUser.email,
    bio: "Product-focused builder helping teams ship polished experiences.",
  });
  const [profileErrors, setProfileErrors] = useState<{
    name?: string;
    email?: string;
  }>({});

  const [passwords, setPasswords] = useState({
    current: "",
    next: "",
    confirm: "",
  });
  const [passwordErrors, setPasswordErrors] = useState<{
    current?: string;
    next?: string;
    confirm?: string;
  }>({});

  const [preferences, setPreferences] = useState({
    emailDigest: true,
    productUpdates: false,
    securityAlerts: true,
    desktopNotifications: true,
  });

  const [deleteOpen, setDeleteOpen] = useState(false);

  const changeTab = (value: string) => {
    setSearchParams({ tab: value }, { replace: true });
  };

  const saveProfile = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const errors: { name?: string; email?: string } = {};

    if (!profile.name.trim()) {
      errors.name = "Enter your full name.";
    }

    if (!profile.email.trim()) {
      errors.email = "Enter your email address.";
    } else if (!/^\S+@\S+\.\S+$/.test(profile.email.trim())) {
      errors.email = "Enter a valid email address.";
    }

    if (Object.keys(errors).length > 0) {
      setProfileErrors(errors);
      return;
    }

    setProfileErrors({});
    toast({
      title: "Profile updated",
      description: "Your profile details have been saved.",
      variant: "success",
    });
  };

  const savePassword = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const errors: { current?: string; next?: string; confirm?: string } = {};

    if (!passwords.current) {
      errors.current = "Enter your current password.";
    }

    if (passwords.next.length < 8) {
      errors.next = "Use at least 8 characters.";
    }

    if (passwords.confirm !== passwords.next) {
      errors.confirm = "Passwords do not match.";
    }

    if (Object.keys(errors).length > 0) {
      setPasswordErrors(errors);
      return;
    }

    setPasswordErrors({});
    setPasswords({ current: "", next: "", confirm: "" });
    toast({
      title: "Password updated",
      description: "Your password has been changed successfully.",
      variant: "success",
    });
  };

  const savePreferences = () => {
    toast({
      title: "Preferences saved",
      description: "Your notification settings have been updated.",
      variant: "success",
    });
  };

  const updatePreference = (key: keyof typeof preferences, value: boolean) => {
    setPreferences((current) => ({ ...current, [key]: value }));
  };

  const changeTheme = (nextTheme: Theme) => {
    setTheme(nextTheme);
    toast({
      title: "Appearance updated",
      description: `Theme set to ${nextTheme}.`,
      variant: "success",
    });
  };

  const confirmDelete = () => {
    setDeleteOpen(false);
    toast({
      title: "Account deletion is disabled",
      description: "This starter template does not include an auth backend.",
      variant: "info",
    });
  };

  return (
    <PageContainer
      title="Settings"
      description="Manage your profile, account security, and preferences."
    >
      <Card className="overflow-hidden">
        <div className="px-5 pt-2">
          <Tabs
            items={tabItems}
            value={activeTab}
            onChange={changeTab}
          />
        </div>
        <div className="p-5">
          {activeTab === "profile" ? (
            <div role="tabpanel" className="max-w-2xl space-y-6">
              <SectionHeading
                title="Profile settings"
                description="Update how your name and details appear across the workspace."
              />

              <div className="flex items-center gap-4">
                <Avatar name={profile.name || currentUser.name} size="lg" />
                <div>
                  <p className="text-sm font-medium text-foreground">
                    Profile photo
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    Initials are generated automatically in this starter.
                  </p>
                </div>
              </div>

              <form noValidate onSubmit={saveProfile} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <Input
                    label="Full name"
                    value={profile.name}
                    onChange={(event) =>
                      setProfile((current) => ({
                        ...current,
                        name: event.target.value,
                      }))
                    }
                    error={profileErrors.name}
                  />
                  <Input
                    label="Email address"
                    type="email"
                    value={profile.email}
                    onChange={(event) =>
                      setProfile((current) => ({
                        ...current,
                        email: event.target.value,
                      }))
                    }
                    error={profileErrors.email}
                  />
                </div>
                <Textarea
                  label="Bio"
                  rows={4}
                  value={profile.bio}
                  onChange={(event) =>
                    setProfile((current) => ({
                      ...current,
                      bio: event.target.value,
                    }))
                  }
                  hint="Keep it short. This appears on your profile card."
                />
                <div className="flex justify-end">
                  <Button
                    type="submit"
                    leftIcon={<Save className="size-4" />}
                  >
                    Save changes
                  </Button>
                </div>
              </form>
            </div>
          ) : null}

          {activeTab === "general" || activeTab === "security" ? (
            <div role="tabpanel" className="max-w-2xl space-y-6">
              <SectionHeading
                title="Workspace information"
                description="Core details associated with your account."
              />

              <div className="grid gap-4 rounded-xl border border-border p-4 sm:grid-cols-2">
                <div>
                  <p className="text-xs text-muted-foreground">Workspace</p>
                  <p className="mt-0.5 text-sm font-medium text-foreground">
                    Acme Studio
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Plan</p>
                  <p className="mt-0.5 text-sm font-medium text-foreground">
                    {currentUser.plan}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Role</p>
                  <p className="mt-0.5 text-sm font-medium text-foreground">
                    {currentUser.role}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Member since</p>
                  <p className="mt-0.5 text-sm font-medium text-foreground">
                    January 2024
                  </p>
                </div>
              </div>

              <div className="border-t border-border pt-6">
                <SectionHeading
                  title="Change password"
                  description="Use at least 8 characters for a stronger password."
                />
                <form
                  noValidate
                  onSubmit={savePassword}
                  className="mt-4 space-y-4"
                >
                  <Input
                    label="Current password"
                    type="password"
                    autoComplete="current-password"
                    value={passwords.current}
                    onChange={(event) =>
                      setPasswords((current) => ({
                        ...current,
                        current: event.target.value,
                      }))
                    }
                    error={passwordErrors.current}
                  />
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Input
                      label="New password"
                      type="password"
                      autoComplete="new-password"
                      value={passwords.next}
                      onChange={(event) =>
                        setPasswords((current) => ({
                          ...current,
                          next: event.target.value,
                        }))
                      }
                      error={passwordErrors.next}
                    />
                    <Input
                      label="Confirm password"
                      type="password"
                      autoComplete="new-password"
                      value={passwords.confirm}
                      onChange={(event) =>
                        setPasswords((current) => ({
                          ...current,
                          confirm: event.target.value,
                        }))
                      }
                      error={passwordErrors.confirm}
                    />
                  </div>
                  <div className="flex justify-end">
                    <Button
                      type="submit"
                      variant="outline"
                      leftIcon={<Lock className="size-4" />}
                    >
                      Update password
                    </Button>
                  </div>
                </form>
              </div>

              <div className="rounded-xl border border-danger/30 bg-danger/5 p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      Delete account
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      Permanently remove your account and all workspace data.
                    </p>
                  </div>
                  <Button
                    variant="destructive"
                    leftIcon={<Trash2 className="size-4" />}
                    onClick={() => setDeleteOpen(true)}
                  >
                    Delete account
                  </Button>
                </div>
              </div>
            </div>
          ) : null}

          {activeTab === "notifications" ? (
            <div role="tabpanel" className="max-w-2xl space-y-6">
              <SectionHeading
                title="Notification preferences"
                description="Choose which updates you want to receive."
              />

              <div className="divide-y divide-border rounded-xl border border-border">
                <div className="p-4">
                  <Switch
                    checked={preferences.emailDigest}
                    onCheckedChange={(checked) =>
                      updatePreference("emailDigest", checked)
                    }
                    label="Weekly email digest"
                    description="A summary of workspace activity every Monday."
                  />
                </div>
                <div className="p-4">
                  <Switch
                    checked={preferences.productUpdates}
                    onCheckedChange={(checked) =>
                      updatePreference("productUpdates", checked)
                    }
                    label="Product updates"
                    description="News about new features and improvements."
                  />
                </div>
                <div className="p-4">
                  <Switch
                    checked={preferences.securityAlerts}
                    onCheckedChange={(checked) =>
                      updatePreference("securityAlerts", checked)
                    }
                    label="Security alerts"
                    description="Important notices about your account security."
                  />
                </div>
                <div className="p-4">
                  <Switch
                    checked={preferences.desktopNotifications}
                    onCheckedChange={(checked) =>
                      updatePreference("desktopNotifications", checked)
                    }
                    label="Desktop notifications"
                    description="Show browser notifications for new activity."
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  leftIcon={<Save className="size-4" />}
                  onClick={savePreferences}
                >
                  Save preferences
                </Button>
              </div>
            </div>
          ) : null}

          {activeTab === "appearance" ? (
            <div role="tabpanel" className="max-w-2xl space-y-6">
              <SectionHeading
                title="Appearance"
                description="Customize how the dashboard looks on this device."
              />

              <div
                role="radiogroup"
                aria-label="Theme"
                className="grid gap-3 sm:grid-cols-3"
              >
                {themeOptions.map((option) => {
                  const Icon = option.icon;
                  const isActive = theme === option.value;

                  return (
                    <button
                      key={option.value}
                      type="button"
                      role="radio"
                      aria-checked={isActive}
                      onClick={() => changeTheme(option.value)}
                      className={cn(
                        "rounded-xl border p-4 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                        isActive
                          ? "border-primary bg-primary/5"
                          : "border-border hover:bg-subtle",
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <Icon
                          className={cn(
                            "size-4",
                            isActive ? "text-primary" : "text-muted-foreground",
                          )}
                          aria-hidden="true"
                        />
                        <span
                          className={cn(
                            "flex size-4 items-center justify-center rounded-full border",
                            isActive
                              ? "border-primary bg-primary text-primary-foreground"
                              : "border-border",
                          )}
                        >
                          {isActive ? (
                            <Check className="size-3" aria-hidden="true" />
                          ) : null}
                        </span>
                      </div>
                      <p className="mt-3 text-sm font-medium text-foreground">
                        {option.label}
                      </p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {option.description}
                      </p>
                    </button>
                  );
                })}
              </div>

              <p className="text-xs text-muted-foreground">
                Your selection is saved locally and applies immediately across
                the dashboard.
              </p>
            </div>
          ) : null}
        </div>
      </Card>

      <Modal
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        title="Delete account?"
        description="This action cannot be undone."
        size="sm"
        footer={
          <>
            <Button variant="outline" onClick={() => setDeleteOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              leftIcon={<Trash2 className="size-4" />}
              onClick={confirmDelete}
            >
              Delete account
            </Button>
          </>
        }
      >
        <p className="text-sm text-muted-foreground">
          Deleting your account removes your profile, workspace access, and all
          associated data. In this starter template, the action is disabled
          because authentication is not connected.
        </p>
      </Modal>
    </PageContainer>
  );
}
