"use client";

import { useFormStatus } from "react-dom";

import { Button } from "./button";

type SubmitButtonProps = {
  label: string;
  pendingLabel?: string;
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md";
  className?: string;
};

export function SubmitButton({
  label,
  pendingLabel,
  variant,
  size,
  className,
}: SubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      variant={variant}
      size={size}
      className={className}
      disabled={pending}
    >
      {pending ? pendingLabel ?? "Saving..." : label}
    </Button>
  );
}
