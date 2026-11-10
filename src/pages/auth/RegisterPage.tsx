import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthLayout } from "../../components/auth/AuthLayout";
import { AuthBranding } from "../../components/auth/AuthBranding";
import { AuthFormContainer } from "../../components/auth/AuthFormContainer";
import { PasswordInput } from "../../components/auth/PasswordInput";
import { Button } from "../../components/ui/Button";
import { Checkbox } from "../../components/ui/Checkbox";
import { Input } from "../../components/ui/Input";
import { useToast } from "../../contexts/toast";
import { useAuth } from "../../contexts/auth";

export function RegisterPage() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) {
    navigate("/dashboard", { replace: true });
  }

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [terms, setTerms] = useState(false);
  const [error, setError] = useState("");

  const legalPage = (title: string) => {
    toast({
      title,
      description: "This starter template does not include legal pages.",
      variant: "info",
    });
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!form.name.trim()) {
      setError("Enter your full name.");
      return;
    }

    if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setError("Enter a valid email address.");
      return;
    }

    if (form.password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!terms) {
      setError("You must accept the terms and conditions.");
      return;
    }

    setError("");
    setLoading(true);

    // Frontend-only mock registration. No account is actually created.
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "Account created",
        description:
          "This is a demonstration. Sign in with your demo credentials to continue.",
        variant: "success",
      });
      navigate("/login", { replace: true });
    }, 800);
  };

  return (
    <AuthLayout>
      <div className="w-full max-w-sm">
        <AuthBranding compact />
        <AuthFormContainer
          title="Create an account"
          description="Join Admin Starter. It only takes a minute."
        >
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <Input
              label="Full name"
              autoComplete="name"
              value={form.name}
              onChange={(event) =>
                setForm((current) => ({ ...current, name: event.target.value }))
              }
              error={error.includes("name") ? error : undefined}
            />
            <Input
              label="Email address"
              type="email"
              autoComplete="email"
              value={form.email}
              onChange={(event) =>
                setForm((current) => ({ ...current, email: event.target.value }))
              }
              error={error.includes("email") ? error : undefined}
            />
            <PasswordInput
              label="Password"
              value={form.password}
              onChange={(value) =>
                setForm((current) => ({ ...current, password: value }))
              }
              error={error.includes("Password") ? error : undefined}
            />
            <PasswordInput
              label="Confirm password"
              value={form.confirmPassword}
              onChange={(value) =>
                setForm(
                  (current) => ({ ...current, confirmPassword: value }),
                )
              }
              error={error.includes("match") ? error : undefined}
            />
            <div className="flex items-start gap-2">
              <Checkbox
                id="terms"
                checked={terms}
                onCheckedChange={(checked) => setTerms(checked)}
                label={
                  <>
                    I agree to the{" "}
                    <button
                      type="button"
                      onClick={() => legalPage("Terms of Service")}
                      className="text-primary underline underline-offset-4"
                    >
                      Terms of Service
                    </button>{" "}
                    and{" "}
                    <button
                      type="button"
                      onClick={() => legalPage("Privacy Policy")}
                      className="text-primary underline underline-offset-4"
                    >
                      Privacy Policy
                    </button>
                  </>
                }
              />
            </div>
            <Button type="submit" fullWidth loading={loading} disabled={loading}>
              Create account
            </Button>
            <p className="mt-6 text-center text-xs">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-primary hover:text-primary-hover font-medium"
              >
                Sign in
              </Link>
            </p>
          </form>
        </AuthFormContainer>
      </div>
    </AuthLayout>
  );
}
