import { useToast } from "../../contexts/toast";

export function AuthFooter() {
  const { toast } = useToast();

  const legalPage = (title: string) => {
    toast({
      title,
      description: "This starter template does not include legal pages.",
      variant: "info",
    });
  };

  return (
    <p className="mt-8 text-center text-xs text-muted-foreground">
      <span className="mr-1">© 2026 Admin Starter</span>
      <button
        type="button"
        onClick={() => legalPage("Terms of Service")}
        className="ml-1 text-primary hover:text-primary-hover underline underline-offset-4"
      >
        Terms of Service
      </button>
      <span className="mx-1">•</span>
      <button
        type="button"
        onClick={() => legalPage("Privacy Policy")}
        className="ml-1 text-primary hover:text-primary-hover underline underline-offset-4"
      >
        Privacy Policy
      </button>
    </p>
  );
}
