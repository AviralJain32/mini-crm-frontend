'use client';
import { useState,useEffect } from 'react';
import api from '@/services/api';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from 'sonner';
import { Card } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';

interface Customer {
  _id: string;
  name: string;
  email: string;
  phone: string;
  totalSpend: number;
  visits: number;
  lastVisit: string;
  createdAt: string;
}

function AddCustomerModal() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);  // Added loading state

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    totalSpend: '',
    visits: '',
    lastVisit: ''
  });

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const payload: any = {
      name: form.name,
      email: form.email,
      phone: form.phone
    };

    if (form.totalSpend) payload.totalSpend = parseFloat(form.totalSpend);
    if (form.visits) payload.visits = parseInt(form.visits);
    if (form.lastVisit) payload.lastVisit = new Date(form.lastVisit);

    try {
      const res = await api.post('/customers', payload);
      toast.success(res?.data?.message || "Successfully added customer.");
      setForm({ name: '', email: '', phone: '', totalSpend: '', visits: '', lastVisit: '' });
      setOpen(false);
    } catch (err: any) {
      const message = err?.response?.data?.message || "Failed to add customer.";
      toast.error(message);
    } finally {
      setLoading(false);  
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Add Customer</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Customer</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input name="name" placeholder="Name *" value={form.name} onChange={handleChange} required />
          <Input name="email" placeholder="Email *" value={form.email} onChange={handleChange} required />
          <Input name="phone" placeholder="Phone *" value={form.phone} onChange={handleChange} required />
          <Input name="totalSpend" placeholder="Total Spend (optional)" value={form.totalSpend} onChange={handleChange} />
          <Input name="visits" placeholder="Visits (optional)" value={form.visits} onChange={handleChange} />
          <Input name="lastVisit" placeholder="Last Visit (optional)" type="date" value={form.lastVisit} onChange={handleChange} />
          <DialogFooter>
            <Button type="submit" disabled={loading}> {/* Disable button while loading */}
              {loading ? 'Submitting...' : 'Submit'} {/* Change text while loading */}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}


function CustomerTable() {
  const [customers, setCustomers] = useState<Customer[]>([]);

  useEffect(() => {
    api.get('/customers/allCustomers')
      .then(res => {
        setCustomers(res.data.data);
      })
      .catch(err => {
        const msg = err?.response?.data?.message || "Failed to fetch customers.";
        toast(msg);
      });
  }, []);

  return (
    <div className="max-w-6xl mx-auto py-10 px-4">
    <Card className="p-4 mt-4">
      <h2 className="text-xl font-bold mb-4">Customer List</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Total Spend</TableHead>
            <TableHead>Visits</TableHead>
            <TableHead>Last Visit</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
            {customers.length > 0 ? (
                customers.map((c) => (
                <TableRow key={c._id}>
                    <TableCell>{c.name}</TableCell>
                    <TableCell>{c.email}</TableCell>
                    <TableCell>{c.phone}</TableCell>
                    <TableCell>₹{c.totalSpend}</TableCell>
                    <TableCell>{c.visits}</TableCell>
                    <TableCell>{new Date(c.lastVisit).toLocaleDateString()}</TableCell>
                </TableRow>
                ))
            ) : (
                <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground">
                    No customers found.
                </TableCell>
                </TableRow>
            )}
            </TableBody>
      </Table>
    </Card>
    </div>
  );
}

export default function Home() {
  return (
    <main className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Customers</h1>
      <AddCustomerModal />
      <CustomerTable />
    </main>
  );
}