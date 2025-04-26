"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useAuth, useUser } from "@clerk/nextjs";
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
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../ui/card";
import { Loader2 } from "lucide-react";

import CreateRestaurantSchema, {
  CreateRestaurantType,
} from "@/lib/validations/restaurant";
import { useEffect } from "react";

const CreateRestaurantForm = () => {
  const router = useRouter();
  const { userId, isSignedIn } = useAuth();
  const { user } = useUser();

  const form = useForm<CreateRestaurantType>({
    mode: "onSubmit",
    resolver: zodResolver(CreateRestaurantSchema),
    defaultValues: {
      name: "",
      email: user?.emailAddresses[0]?.emailAddress || "",
      phone: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
      logo: "",
      ownerId: userId || "",
    },
  });

  const isLoading = form.formState.isSubmitting;

  const handleSubmit = async (values: CreateRestaurantType) => {
    try {
      const res = await fetch("/api/restaurant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!res.ok) {
        throw new Error("Failed to create restaurant");
      }

      toast.success("Restaurant created successfully!");
      router.push("/dashboard"); // Redirect after creation
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong.");
    }
  };

  useEffect(() => {
    if (!isSignedIn) {
      toast.error("You must be logged in to create a restaurant.", {
        position: "top-center",
        duration: 2000,
        onAutoClose: () => {
          router.push("/");
        },
      });
    }
  }, [router, isSignedIn]);

  if (!isSignedIn) {
    return null;
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl">Create a Restaurant</CardTitle>
        <CardDescription>
          Create a restaurant and start selling food online!
        </CardDescription>
      </CardHeader>
      <CardContent>
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
                  <FormLabel>Restaurant Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your restaurant name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input {...field} disabled />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <Input placeholder="Phone Number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Password for restaurant dashboard"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input placeholder="Full Address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex flex-col md:flex-row gap-4">
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>City</FormLabel>
                    <FormControl>
                      <Input placeholder="City" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>State</FormLabel>
                    <FormControl>
                      <Input placeholder="State" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="zipCode"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Zip Code</FormLabel>
                    <FormControl>
                      <Input placeholder="Zip" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              Submit for Approval
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default CreateRestaurantForm;
