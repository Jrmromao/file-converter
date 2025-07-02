"use client";
import { signOut } from "next-auth/react";
import { ReactNode } from "react";

export function SignOutButton({ children }: { children?: ReactNode }) {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/" })}
      className="w-full text-left px-5 py-2 rounded-full font-medium bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-zinc-700 shadow transition-all duration-200"
    >
      {children || "Sign Out"}
    </button>
  );
} 