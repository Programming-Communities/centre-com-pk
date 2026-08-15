import { Metadata } from "next";
import CommentsClient from "./CommentsClient";

export const metadata: Metadata = { title: "Comments Manager - Admin" };

export default function Page() {
  return <CommentsClient />;
}
