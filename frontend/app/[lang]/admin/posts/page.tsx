import { Metadata } from "next";
import PostsClient from "./PostsClient";

export const metadata: Metadata = { title: "Posts Manager - Admin" };

export default async function Page() {
  return <PostsClient />;
}
