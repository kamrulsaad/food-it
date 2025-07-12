"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormField,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Loader2 } from "lucide-react";

import { CreateRiderSchema, CreateRiderType } from "@/validations/rider";
import { VEHICLETYPES } from "@/constants/vehicle-types";
import { City } from "../../../prisma/generated/prisma";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Skeleton } from "../global/skeleton";

export default function RiderSignupForm() {
  const { user } = useUser();
  const router = useRouter();

  const [cities, setCities] = useState<City[]>([]);

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const res = await fetch("/api/cities");
        const data = await res.json();
        setCities(data);
      } catch (err) {
        console.error("Failed to load cities", err);
      }
    };

    fetchCities();
  }, []);

  const form = useForm<CreateRiderType>({
    mode: "onSubmit",
    resolver: zodResolver(CreateRiderSchema),
    defaultValues: {
      name: user?.fullName || "",
      email: user?.primaryEmailAddress?.emailAddress || "",
      phone: "",
      address: "",
      cityId: "",
      state: "",
      zipCode: "",
      vehicleType: VEHICLETYPES[0],
    },
  });

  useEffect(() => {
    if (user?.primaryEmailAddress?.emailAddress && user.fullName) {
      form.reset({
        ...form.getValues(),
        email: user.primaryEmailAddress.emailAddress,
        name: user.fullName,
      });
    }
  }, [user, form]);

  if (!user)
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">
            <Skeleton className="h-6 w-40" />
          </CardTitle>
          <CardDescription>
            <Skeleton className="h-4 w-64 mt-2" />
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}

          <div className="flex flex-col md:flex-row gap-4">
            <Skeleton className="h-10 w-full md:w-1/3" />
            <Skeleton className="h-10 w-full md:w-1/3" />
          </div>

          <Skeleton className="h-10 w-full" />
        </CardContent>
      </Card>
    );

  const isLoading = form.formState.isSubmitting;

  const handleSubmit = async (values: CreateRiderType) => {
    try {
      const payload = {
        ...values,
        email: user.primaryEmailAddress?.emailAddress,
        clerkId: user.id,
      };

      const res = await fetch("/api/rider", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to register rider");
      toast.success("Rider registered successfully!");
      router.push("/dash/rider");
    } catch (err) {
      toast.error("Something went wrong.");
      console.error(err);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Rider Registration</CardTitle>
        <CardDescription>
          Become a delivery partner with Food IT.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            <FormItem className="cursor-not-allowed">
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input disabled value={user.fullName || ""} />
              </FormControl>
              <FormMessage />
            </FormItem>

            <FormItem className="cursor-not-allowed">
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  disabled
                  value={user.primaryEmailAddress?.emailAddress || ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your phone number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="vehicleType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Vehicle Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select vehicle type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Types</SelectLabel>
                        {VEHICLETYPES.map((type) => (
                          <SelectItem
                            className="w-full"
                            key={type}
                            value={type}
                          >
                            {type}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Address</FormLabel>
                  <FormControl>
                    <Input placeholder="Address..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="cityId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>City</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a city" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Available Cities</SelectLabel>
                        {cities.map((city) => (
                          <SelectItem
                            className="w-full"
                            key={city.id}
                            value={city.id}
                          >
                            {city.name}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex flex-col md:flex-row gap-4">
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

            <Button
              type="submit"
              className="w-full cursor-pointer"
              disabled={isLoading}
            >
              {isLoading && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
              Register as Rider
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
