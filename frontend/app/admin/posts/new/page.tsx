import { Metadata } from "next";
import NewPostClient from "./NewPostClient";
export const metadata: Metadata = { title: "New Post - Admin" };
export default function Page() { return <NewPostClient />; }
