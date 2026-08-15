import { Metadata } from "next";
import UsersPageClient from "./UsersPageClient";
export const metadata: Metadata = { title: "Users - Admin" };
export default function Page() { return <UsersPageClient />; }
