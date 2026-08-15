import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = { title: "Comments Manager - Admin | Centre.com.pk" };

export default function CommentsPage() {
  redirect("/admin/dashboard/comments");
}
