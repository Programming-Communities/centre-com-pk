import { Metadata } from "next";
import PostsClient from "./PostsClient";
export const metadata: Metadata = { title: "Posts - Admin" };
export default function Page() { return <PostsClient />; }
