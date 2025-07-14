"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { format, setHours, setMinutes } from "date-fns";
import { useState } from "react";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Props {
  id: string;
  currentDateTime: Date;
  onSuccess: () => void;
}

export default function EditTimeModal({
  id,
  currentDateTime,
  onSuccess,
}: Props) {
  const [open, setOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(currentDateTime);
  const [hour, setHour] = useState(format(currentDateTime, "hh")); // 01-12
  const [minute, setMinute] = useState(format(currentDateTime, "mm")); // 00-59
  const [ampm, setAmpm] = useState(format(currentDateTime, "a")); // AM or PM

  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);

    let parsedHour = parseInt(hour);
    if (ampm === "PM" && parsedHour < 12) parsedHour += 12;
    if (ampm === "AM" && parsedHour === 12) parsedHour = 0;

    const updatedDateTime = setMinutes(
      setHours(selectedDate, parsedHour),
      parseInt(minute)
    );

    const now = new Date();
    if (updatedDateTime < now) {
      toast.error("Cannot schedule for a past time");
      setSaving(false);
      return;
    }

    const res = await fetch(`/api/customer/preorders/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ scheduledDate: updatedDateTime }),
    });

    if (res.ok) {
      toast.success("Pre-order schedule updated");
      setOpen(false);
      onSuccess();
    } else {
      toast.error("Failed to update pre-order");
    }

    setSaving(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full mt-2 cursor-pointer">
          Edit Time
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Scheduled Time</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-1 block">
              Select Date
            </label>
            <Calendar
              className="w-full"
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && setSelectedDate(date)}
              disabled={(date) =>
                date < new Date(new Date().setHours(0, 0, 0, 0))
              }
            />
          </div>

          <div className="grid grid-cols-3 gap-2">
            {/* Hour */}
            <div>
              <label className="text-sm font-medium block">Hour</label>
              <Select value={hour} onValueChange={setHour}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Hour" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 12 }, (_, i) => {
                    const val = (i + 1).toString().padStart(2, "0");
                    return (
                      <SelectItem key={val} value={val}>
                        {val}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>

            {/* Minute */}
            <div>
              <label className="text-sm font-medium block">Minutes</label>
              <Select value={minute} onValueChange={setMinute}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Minutes" />
                </SelectTrigger>
                <SelectContent>
                  {["00", "10", "20", "30", "40", "50"].map((min) => (
                    <SelectItem key={min} value={min}>
                      {min}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* AM/PM */}
            <div>
              <label className="text-sm font-medium block">AM/PM</label>
              <Select value={ampm} onValueChange={setAmpm}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="AM/PM" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="AM">AM</SelectItem>
                  <SelectItem value="PM">PM</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <DialogFooter className="mt-4">
          <Button
            className="cursor-pointer"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
