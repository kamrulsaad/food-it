"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import {
  CreateMenuItemSchema,
  CreateMenuItemType,
} from "@/validations/menu-item";
import FileUpload from "@/components/global/file-upload";
import { MenuItem } from "../../../prisma/generated/prisma";

interface EditMenuItemFormProps {
  menuItem: MenuItem;
}

export default function EditMenuItemForm({ menuItem }: EditMenuItemFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<CreateMenuItemType>({
    resolver: zodResolver(CreateMenuItemSchema),
    mode: "onSubmit",
    defaultValues: {
      name: menuItem.name || "",
      description: menuItem.description || "",
      price: menuItem.price.toString() || "",
      imageUrl: menuItem.imageUrl || "",
    },
  });

  const onSubmit = async (values: CreateMenuItemType) => {
    try {
      setIsLoading(true);

      const res = await fetch(`/api/menu-items/${menuItem.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!res.ok) throw new Error();

      toast.success("Menu item updated!");
      router.push("/dash/owner/menu");
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Menu Item</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Item name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Item description" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price (৳)</FormLabel>
                  <FormControl>
                    <Input placeholder="99.00" {...field} />
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
                      endpoint="menuItem"
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              className="cursor-pointer"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? "Saving..." : "Update Item"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
