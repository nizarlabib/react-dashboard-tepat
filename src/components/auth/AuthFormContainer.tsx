import type { ReactNode } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/Card";

export interface AuthFormContainerProps {
  title: string;
  description: string;
  children: ReactNode;
}

export function AuthFormContainer({
  title,
  description,
  children,
}: AuthFormContainerProps) {
  return (
    <Card className="w-full max-w-sm p-8">
      <CardHeader className="pb-0">
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="pt-0">{children}</CardContent>
    </Card>
  );
}
