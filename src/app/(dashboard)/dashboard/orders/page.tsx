"use client"
import { useState } from "react";
import AddOrderModal from "./AddOrderModal";
import OrderTable from "./OrderTable";

export default function OrderPage() {
  const [reload, setReload] = useState(false);

  return (
    <main className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Orders</h1>
      <AddOrderModal onOrderCreated={() => setReload(!reload)} />
      <OrderTable key={reload ? '1' : '0'} />
    </main>
  );
}
