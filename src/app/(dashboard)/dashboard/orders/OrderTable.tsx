'use client';
import { useEffect, useState } from 'react';
import api from '@/services/api';
import { Card } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { toast } from 'sonner';

interface Order {
  _id: string;
  amount: number;
  date: string;
  customerId: {
    name: string;
    email: string;
    phone: string;
  };
}

export default function OrderTable() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    api.get('/orders/allOrders')
      .then(res => setOrders(res.data.data))
      .catch(() => toast.error("Failed to fetch orders"));
  }, []);

  console.log(orders)

  return (
    <div className="max-w-6xl mx-auto py-10 px-4">
      <Card className="p-4 mt-4">
        <h2 className="text-xl font-bold mb-4">Order List</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.length > 0 ? (
              orders.map((o) => (
                <TableRow key={o._id}>
                  <TableCell>{o.customerId.name} ({o.customerId.email})</TableCell>
                  <TableCell>₹{o.amount}</TableCell>
                  <TableCell>{new Date(o.date).toLocaleDateString()}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} className="text-center text-muted-foreground">
                  No orders found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
