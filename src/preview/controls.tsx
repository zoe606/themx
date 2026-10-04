/** @jsxImportSource react */
import * as React from "react";
import type { ComponentProps, HTMLAttributes } from "react";
import type { UiLibrary } from "../lib/promptOptions";
import { Button as ShadcnButton, type ButtonProps } from "./ui/button";
import { Input as ShadcnInput } from "./ui/input";
import { Card as ShadcnCard } from "./ui/card";
import { Badge as ShadcnBadge, type BadgeProps } from "./ui/badge";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "./ui/table";

function CustomButton({ variant = "default", className = "", ...props }: ButtonProps) {
  return <button className={`control custom-button custom-${variant} ${className}`} {...props} />;
}
function DaisyButton({ variant = "default", className = "", ...props }: ButtonProps) {
  const variants = { default: "btn-primary", secondary: "btn-secondary", outline: "btn-outline", ghost: "btn-ghost", link: "btn-link", destructive: "btn-error" };
  return <button className={`btn control ${variants[variant ?? "default"]} ${className}`} {...props} />;
}
function NativeButton({ className = "", ...props }: ButtonProps) { return <ShadcnButton className={`control ${className}`} {...props} />; }
function CustomInput({ className = "", ...props }: ComponentProps<"input">) { return <input className={`control custom-input ${className}`} {...props} />; }
function DaisyInput({ className = "", ...props }: ComponentProps<"input">) { return <input className={`input input-bordered control ${className}`} {...props} />; }
function NativeInput({ className = "", ...props }: ComponentProps<"input">) { return <ShadcnInput className={`control ${className}`} {...props} />; }
function CustomCard({ className = "", ...props }: HTMLAttributes<HTMLDivElement>) { return <div className={`panel ${className}`} {...props} />; }
function DaisyCard({ className = "", ...props }: HTMLAttributes<HTMLDivElement>) { return <div className={`card panel ${className}`} {...props} />; }
function NativeCard({ className = "", ...props }: HTMLAttributes<HTMLDivElement>) { return <ShadcnCard className={`panel ${className}`} {...props} />; }
function CustomBadge({ variant, className = "", ...props }: BadgeProps) { return <div className={`badge-label ${className}`} {...props} />; }
function DaisyBadge({ variant, className = "", ...props }: BadgeProps) { return <div className={`badge badge-outline ${className}`} {...props} />; }
function NativeBadge({ className = "", ...props }: BadgeProps) { return <ShadcnBadge className={`badge-label ${className}`} {...props} />; }
function CustomTable({ className = "", ...props }: ComponentProps<"table">) { return <table className={`stock-table ${className}`} {...props} />; }
function DaisyTable({ className = "", ...props }: ComponentProps<"table">) { return <table className={`table stock-table ${className}`} {...props} />; }
function NativeTable({ className = "", ...props }: ComponentProps<"table">) { return <Table className={`stock-table ${className}`} {...props} />; }
const tableParts = { Thead: "thead", Tbody: "tbody", Tr: "tr", Th: "th", Td: "td" } as const;
const custom = { Button: CustomButton, Input: CustomInput, Card: CustomCard, Badge: CustomBadge, Table: CustomTable, ...tableParts };
const daisyui = { Button: DaisyButton, Input: DaisyInput, Card: DaisyCard, Badge: DaisyBadge, Table: DaisyTable, ...tableParts };
const shadcn = { Button: NativeButton, Input: NativeInput, Card: NativeCard, Badge: NativeBadge, Table: NativeTable, Thead: TableHeader, Tbody: TableBody, Tr: TableRow, Th: TableHead, Td: TableCell };

export function getControls(library: UiLibrary) { return { custom, daisyui, shadcn }[library]; }
