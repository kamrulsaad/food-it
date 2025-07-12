"use client";

import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pagination } from "@/components/global/pagination";
import { formatDistanceToNow } from "date-fns";

interface Customer {
  id: string;
  email: string;
  clerkID: string;
  orderCount: number;
  lastOrderDate: string | null;
}

const PAGE_SIZE = 15;

export default function AdminCustomerPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchCustomers = async () => {
      const res = await fetch("/api/admin/customers");
      const data = await res.json();
      setCustomers(data);
    };

    fetchCustomers();
  }, []);

  const paginated = customers.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">All Customers</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>#</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Total Orders</TableHead>
            <TableHead>Last Ordered</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginated.map((customer, index) => (
            <TableRow key={customer.id}>
              <TableCell>{(currentPage - 1) * PAGE_SIZE + index + 1}</TableCell>
              <TableCell>{customer.email}</TableCell>
              <TableCell>{customer.orderCount}</TableCell>
              <TableCell>
                {customer.lastOrderDate ? (
                  formatDistanceToNow(new Date(customer.lastOrderDate), {
                    addSuffix: true,
                  })
                ) : (
                  <span className="text-muted-foreground">No orders</span>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="mt-4">
        <Pagination
          currentPage={currentPage}
          totalCount={customers.length}
          pageSize={PAGE_SIZE}
          onPageChange={(page) => setCurrentPage(page)}
        />
      </div>
    </div>
  );
}
