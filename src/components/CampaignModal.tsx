// 'use client'

// import { useForm } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { z } from 'zod';
// import axios from 'axios';
// import { toast } from 'sonner';
// import { useRouter } from 'next/navigation';

// import { Input } from '@/components/ui/input';
// import { Button } from '@/components/ui/button';
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
// } from '@/components/ui/dialog';

// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from '@/components/ui/form';

// const campaignSchema = z.object({
//   campaignName: z.string().min(1, 'Campaign name is required'),
//   message: z.string().min(1, 'Message is required'),
// });

// type CampaignFormData = z.infer<typeof campaignSchema>;

// interface CampaignModalProps {
//   open: boolean;
//   onOpenChange: (open: boolean) => void;
//   segmentId: string | null;
// }

// export const CampaignModal = ({
//   open,
//   onOpenChange,
//   segmentId,
// }: CampaignModalProps) => {
//   const router = useRouter();
//   const form = useForm<CampaignFormData>({
//     resolver: zodResolver(campaignSchema),
//   });

//   const onSubmit = async (data: CampaignFormData) => {
//     if (!segmentId) return toast.error('No segment ID provided');

//     try {
//       await axios.post(
//         `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/campaign`,
//         {
//           segmentId,
//           campaignName: data.campaignName,
//           message: data.message,
//         },
//         { withCredentials: true }
//       );

//       toast.success('Campaign created successfully');
//       onOpenChange(false);
//       router.push(`/campaigns?segmentId=${segmentId}`);
//     } catch (err: any) {
//       toast.error(err?.response?.data?.message || 'Failed to create campaign');
//     }
//   };

//   return (
//     <Dialog open={open} onOpenChange={onOpenChange}>
//       <DialogContent>
//         <DialogHeader>
//           <DialogTitle>Create Campaign</DialogTitle>
//         </DialogHeader>

//         <Form {...form}>
//           <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
//             <FormField
//               control={form.control}
//               name="campaignName"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Campaign Name</FormLabel>
//                   <FormControl>
//                     <Input placeholder="Holiday Sale" {...field} />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//             <FormField
//               control={form.control}
//               name="message"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Message</FormLabel>
//                   <FormControl>
//                     <Input placeholder="Enjoy 25% off on your next order!" {...field} />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//             <Button type="submit" disabled={form.formState.isSubmitting}>
//               {form.formState.isSubmitting ? 'Creating...' : 'Create Campaign'}
//             </Button>
//           </form>
//         </Form>
//       </DialogContent>
//     </Dialog>
//   );
// };
