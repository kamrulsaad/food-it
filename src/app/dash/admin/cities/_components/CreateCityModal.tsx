"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import CreateCityForm from "@/components/forms/CityForm";

export function CityFormModal() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Add City</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create City</DialogTitle>
        </DialogHeader>
        <CreateCityForm />
      </DialogContent>
    </Dialog>
  );
}
