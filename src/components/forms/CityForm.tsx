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

import { CreateCitySchema, CreateCityTyes } from "@/validations/city";
import FileUpload from "../global/file-upload";
import { City } from "../../../prisma/generated/prisma";
import { useRouter } from "next/navigation";
import { cityExists } from "@/queries/cities";

const CreateCityForm = ({ city }: { city: City }) => {
  const router = useRouter();

  const defaultValues = {
    name: city?.name || "",
    imageUrl: city?.imageUrl || "",
  };

  const form = useForm<CreateCityTyes>({
    mode: "onSubmit",
    resolver: zodResolver(CreateCitySchema),
    defaultValues,
  });

  const isLoading = form.formState.isSubmitting;

  const handleSubmit = async (values: CreateCityTyes) => {
    try {
      if (city.name) {
        const existingCity = await cityExists(values.name);

        if (existingCity) {
          toast.error("City with this name already exists.");
          return;
        }

        const res = await fetch(`/api/cities/${city.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        });

        if (!res.ok) {
          throw new Error("Failed to update city");
        }

        router.back();
        toast.success("City updated successfully!");
        return;
      } else {
        const res = await fetch("/api/cities", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        });

        if (!res.ok) {
          throw new Error("Failed to create city");
        }

        toast.success("City created successfully!");
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
                  <FormLabel>City Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter City name" {...field} />
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
                      endpoint="city"
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
              {defaultValues.name ? "Edit" : "Create"} City
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default CreateCityForm;
