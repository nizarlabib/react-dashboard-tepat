import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail } from "lucide-react";
import { AuthLayout } from "../../components/auth/AuthLayout";
import { AuthBranding } from "../../components/auth/AuthBranding";
import { AuthFormContainer } from "../../components/auth/AuthFormContainer";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { useToast } from "../../contexts/toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/Card";

export function ForgotPasswordPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Enter a valid email address.");
      return;
    }

    setError("");
    setSent(true);

    toast({
      title: "Reset link sent",
      description:
        "This is a demonstration — no email is actually sent. Use the demo credentials to sign in instead.",
      variant: "info",
    });
  };

  if (sent) {
    return (
      <AuthLayout>
        <div className="w-full max-w-sm flex flex-col items-center justify-center min-h-[300px]">
          <AuthBranding compact />
          <Card className="w-full p-8 text-center">
            <CardHeader>
              <div className="flex size-12 items-center justify-center rounded-full bg-success/10 text-success mx-auto mb-4">
                <Mail className="size-5" aria-hidden="true" />
              </div>
              <CardTitle className="text-lg">Reset link sent</CardTitle>
              <CardDescription>
                Check your inbox for instructions to reset your password.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-xs text-muted-foreground">
                This is a demonstration — no email is actually sent.
              </p>
              <div className="mt-8">
                <Button
                  fullWidth
                  onClick={() => navigate("/login", { replace: true })}
                >
                  Back to sign in
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <div className="w-full max-w-sm">
        <AuthBranding compact />
        <AuthFormContainer
          title="Forgot password?"
          description="Enter your email and we will send reset instructions."
        >
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <Input
              label="Email address"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              error={error ? error : undefined}
            />
            <Button type="submit" fullWidth>Send reset link</Button>
            <p className="mt-6 text-center text-xs">
              This is a demonstration — no email is actually sent.
            </p>
            <p className="mt-2 text-center text-xs">
              Remember your password?{" "}
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
