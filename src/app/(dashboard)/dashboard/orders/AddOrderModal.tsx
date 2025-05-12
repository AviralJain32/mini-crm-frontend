'use client';
import { useEffect, useState } from 'react';
import { Label } from "@/components/ui/label";
import api from '@/services/api';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectItem, SelectTrigger, SelectContent, SelectValue } from '@/components/ui/select';
import { AxiosErrorType } from '@/types/ErrorType';

interface Customer {
  _id: string;
  name: string;
  email: string;
}

export default function AddOrderModal({ onOrderCreated }: { onOrderCreated: () => void }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [form, setForm] = useState({
    customerId: '',
    amount: '',
    date: ''
  });

  useEffect(() => {
    api.get('/customers/allCustomers')
      .then(res => setCustomers(res.data.data))
      .catch(() => toast.error('Failed to fetch customers.'));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res=await api.post('/orders', {
        ...form,
        amount: parseFloat(form.amount),
        date: new Date(form.date)
      });
      toast.success(res?.data?.message || "Successfully added customer.");
      onOrderCreated();
      setForm({ customerId: '', amount: '', date: '' });
      setOpen(false);
    } catch (err: unknown) {
      const error = err as AxiosErrorType
      const message = error?.response?.data?.message || "Failed to add customer.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
    <DialogTrigger asChild>
        <Button>Add Order</Button>
    </DialogTrigger>
    <DialogContent>
        <DialogHeader>
        <DialogTitle>Create New Order</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">

        <div className="space-y-1">
            <Label htmlFor="customer">Customer</Label>
            <Select
            value={form.customerId}
            onValueChange={(val) => setForm({ ...form, customerId: val })}
            >
            <SelectTrigger id="customer">
                <SelectValue placeholder="Select Customer" />
            </SelectTrigger>
            <SelectContent>
                {customers.map((c) => (
                <SelectItem key={c._id} value={c._id}>
                    {c.name} ({c.email})
                </SelectItem>
                ))}
            </SelectContent>
            </Select>
        </div>

        <div className="space-y-1">
            <Label htmlFor="amount">Amount</Label>
            <Input
            id="amount"
            name="amount"
            type="number"
            placeholder="Amount"
            value={form.amount}
            onChange={handleChange}
            required
            />
        </div>

        <div className="space-y-1">
            <Label htmlFor="date">Date</Label>
            <Input
            id="date"
            name="date"
            type="date"
            value={form.date}
            onChange={handleChange}
            required
            />
        </div>

        <DialogFooter>
            <Button type="submit" disabled={loading}>
            {loading ? "Submitting..." : "Submit"}
            </Button>
        </DialogFooter>
        </form>
    </DialogContent>
    </Dialog>
  );
}
