"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Card, CardContent } from "../ui/card";
import { Loader2 } from "lucide-react";

import { CategorySchema, CategoryTypes } from "@/validations/category";
import FileUpload from "../global/file-upload";
import { City } from "../../../prisma/generated/prisma";
import { useRouter } from "next/navigation";
import { categoryExists } from "@/queries/categories";

const CategoryForm = ({ category }: { category?: City }) => {
  const router = useRouter();

  const defaultValues = {
    name: category?.name || "",
    imageUrl: category?.imageUrl || "",
  };

  const form = useForm<CategoryTypes>({
    mode: "onSubmit",
    resolver: zodResolver(CategorySchema),
    defaultValues,
  });

  const isLoading = form.formState.isSubmitting;

  const handleSubmit = async (values: CategoryTypes) => {
    try {
      const existingCategory = await categoryExists(values.name);

      if (existingCategory) {
        toast.error("Category with this name already exists.");
        return;
      }

      if (category) {
        const res = await fetch(`/api/categories/${category.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        });

        if (!res.ok) {
          throw new Error("Failed to update category");
        }

        router.back();
        toast.success("Category updated successfully!");
        return;
      } else {
        const res = await fetch("/api/categories", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        });

        if (!res.ok) {
          throw new Error("Failed to create category");
        }

        form.reset();
        router.refresh();
        toast.success("Category created successfully!");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong.");
    }
  };

  return (
    <Card className="w-full border-none shadow-none">
      <CardContent className="px-0">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter Category name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image</FormLabel>
                  <FormControl>
                    <FileUpload
                      endpoint="category"
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full cursor-pointer"
            >
              {isLoading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              {defaultValues.name ? "Edit" : "Create"} Category
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default CategoryForm;
