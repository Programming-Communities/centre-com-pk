import { Metadata } from "next";
import CategoriesClient from "./CategoriesClient";

export const metadata: Metadata = {
  title: "Categories Manager - Admin | Centre.com.pk",
  description: "Manage blog categories, tool categories, and content categories",
};

export default async function CategoriesPage() {
  return <CategoriesClient />;
}
