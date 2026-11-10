import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Link as LinkIcon } from "lucide-react";
import { AuthLayout } from "../../components/auth/AuthLayout";
import { AuthBranding } from "../../components/auth/AuthBranding";
import { AuthFormContainer } from "../../components/auth/AuthFormContainer";
import { AuthFooter } from "../../components/auth/AuthFooter";
import { PasswordInput } from "../../components/auth/PasswordInput";
import { Button } from "../../components/ui/Button";
import { Checkbox } from "../../components/ui/Checkbox";
import { Input } from "../../components/ui/Input";
import { useToast } from "../../contexts/toast";
import { useAuth } from "../../contexts/auth";

export function LoginPage() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (isAuthenticated) {
    navigate("/dashboard", { replace: true });
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Enter a valid email address.");
      return;
    }

    if (!password) {
      setError("Enter your password.");
      return;
    }

    setError("");
    setLoading(true);

    const result = await login(email, password);

    setLoading(false);

    if (result.ok) {
      navigate("/dashboard", { replace: true });
    } else {
      setError(result.error ?? "Sign in failed. Please try again.");
    }
  };

  const signInWithGoogle = () => {
    toast({
      title: "Sign in with Google",
      description: "Social sign-in is not connected in this demo.",
      variant: "info",
    });
  };

  return (
    <AuthLayout>
      <div className="w-full max-w-[960px]">
        <div className="flex flex-col lg:flex-row gap-8 items-start lg:items-center">
          <div className="flex-1 hidden lg:flex flex-col justify-center min-w-0">
            <AuthBranding />
          </div>

          <div className="flex-1 max-w-[420px] w-full">
            <AuthFormContainer
              title="Welcome back"
              description="Enter your credentials to access your account."
            >
              <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                <Input
                  label="Email address"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  error={error.includes("email") ? error : undefined}
                />
                <PasswordInput
                  label="Password"
                  value={password}
                  onChange={(value) => setPassword(value)}
                  error={error.includes("password") ? error : undefined}
                />
                <div className="flex items-center justify-between gap-3">
                  <Checkbox
                    id="remember-me"
                    label="Remember me"
                    defaultChecked
                  />
                  <Link
                    to="/forgot-password"
                    className="text-xs text-primary hover:text-primary-hover underline underline-offset-4"
                  >
                    Forgot password?
                  </Link>
                </div>
                <Button
                  type="submit"
                  fullWidth
                  loading={loading}
                  disabled={loading}
                >
                  Sign in
                </Button>
                <div className="relative my-5">
                  <div className="border-t border-border" />
                  <span className="absolute -top-px left-1/2 -translate-x-1/2 px-2 bg-surface text-xs font-medium text-muted-foreground">
                    Or
                  </span>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  fullWidth
                  leftIcon={<LinkIcon className="size-4" />}
                  onClick={signInWithGoogle}
                >
                  Continue with Google
                </Button>
                <p className="mt-6 text-center text-xs">
                  Don't have an account?{" "}
                  <Link
                    to="/register"
                    className="text-primary hover:text-primary-hover font-medium"
                  >
                    Create an account
                  </Link>
                </p>
              </form>
            </AuthFormContainer>
            <AuthFooter />
          </div>
        </div>
      </div>
    </AuthLayout>
  );
}
