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
} from "@/validations/restaurant";
import { useEffect, useState } from "react";
import FileUpload from "../global/file-upload";
import { WEEKDAYS } from "@/constants/weekdays";
import { City } from "../../../prisma/generated/prisma";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Checkbox } from "../ui/checkbox";

const CreateRestaurantForm = () => {
  const router = useRouter();
  const { userId, isSignedIn } = useAuth();
  const { user } = useUser();

  const [cities, setCities] = useState<City[]>([]);

  useEffect(() => {
    const fetchCities = async () => {
      const res = await fetch("/api/cities");
      const data = await res.json();
      setCities(data);
    };

    fetchCities();
  }, []);

  const form = useForm<CreateRestaurantType>({
    mode: "onSubmit",
    resolver: zodResolver(CreateRestaurantSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      address: "",
      cityId: "",
      state: "",
      zipCode: "",
      logo: "",
      ownerId: "",
      coverPhoto: "",
      openingTime: "",
      closingTime: "",
      workingDays: [],
      deliveryTime: "",
      deliveryFee: 0,
      isHomeMade: false,
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
      router.push("/dash/owner"); // Redirect after creation
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

  useEffect(() => {
    if (user?.primaryEmailAddress?.emailAddress) {
      form.setValue("email", user.primaryEmailAddress.emailAddress);
    }

    if (userId) {
      form.setValue("ownerId", userId);
    }
  }, [user?.primaryEmailAddress?.emailAddress, userId, form]);

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
            <div className="flex flex-col md:flex-row gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="flex-1">
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
                  <FormItem className="flex-1 cursor-not-allowed">
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={user?.primaryEmailAddress?.emailAddress}
                        {...field}
                        readOnly
                        className="bg-gray-100 cursor-not-allowed"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex flex-col md:flex-row gap-4">
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem className="flex-1">
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
                name="cityId"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>City</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a city" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {cities.map((city) => (
                          <SelectItem key={city.id} value={city.id}>
                            {city.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex flex-col md:flex-row gap-4">
              <FormField
                control={form.control}
                name="logo"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>
                      Restaurant Logo (Recommended Dimension: 400*400)
                    </FormLabel>
                    <FormControl>
                      <FileUpload
                        endpoint="restaurantLogo"
                        value={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="coverPhoto"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>
                      Cover Photo (Recommended Dimension: 1920*1080)
                    </FormLabel>
                    <FormControl>
                      <FileUpload
                        endpoint="restaurantLogo"
                        value={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="isHomeMade"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-3">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel>Is Homemade?</FormLabel>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex flex-col md:flex-row gap-4">
              <FormField
                control={form.control}
                name="openingTime"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Opening Time</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="closingTime"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Closing Time</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="workingDays"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Working Days</FormLabel>
                  <FormControl>
                    <div className="flex flex-wrap gap-2">
                      {WEEKDAYS.map((day) => (
                        <label
                          key={day}
                          className="flex gap-1 items-center text-sm"
                        >
                          <input
                            type="checkbox"
                            value={day}
                            checked={field.value.includes(day)}
                            onChange={(e) => {
                              const checked = e.target.checked;
                              const newValue = checked
                                ? [...field.value, day]
                                : field.value.filter((d) => d !== day);
                              field.onChange(newValue);
                            }}
                          />
                          {day}
                        </label>
                      ))}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex flex-col md:flex-row gap-4">
              <FormField
                control={form.control}
                name="deliveryTime"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Delivery Time</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 30–45 min" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="deliveryFee"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Delivery Fee (BDT)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

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
              disabled={isLoading}
              className="w-full cursor-pointer"
            >
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
