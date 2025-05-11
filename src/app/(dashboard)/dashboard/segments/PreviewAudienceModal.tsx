// 'use client';

// import { useForm } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { z } from 'zod';
// import axios from 'axios';
// import { useState, useEffect } from 'react';
// import { Input } from '@/components/ui/input';
// import { Button } from '@/components/ui/button';
// import {
//   Dialog,
//   DialogContent,
//   DialogTrigger,
//   DialogHeader,
//   DialogTitle,
// } from '@/components/ui/dialog';
// import { Label } from '@/components/ui/label';
// import { toast } from 'sonner';
// import { RuleGroupType } from 'react-querybuilder';
// import { formatQuery } from 'react-querybuilder';
// import { IApiResponse } from '@/types/ApiResponse';
// import { useRouter } from 'next/router';
// import CampaignModal from './CampaignModal';

// const schema = z.object({
//   name: z.string().min(1, 'Segment name is required'),
// });

// type FormData = z.infer<typeof schema>;

// interface SaveSegmentFormProps {
//   query: RuleGroupType;
// }

// export const SaveSegmentForm = ({ query }: SaveSegmentFormProps) => {
//   const [open, setOpen] = useState(false);
//   const [audienceSize, setAudienceSize] = useState<number | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [campaignModalOpen, setCampaignModalOpen] = useState(false);
//   const [segmentId, setSegmentId] = useState<string | null>(null);
//   const router = useRouter()

//   const {
//     register,
//     handleSubmit,
//     formState: { errors, isSubmitting },
//     reset,
//   } = useForm<FormData>({
//     resolver: zodResolver(schema),
//   });

//   const fetchAudienceSize = async () => {
//     try {
//       setLoading(true);
//       setError(null);

//       const mongoQuery = formatQuery(query, { format: 'mongodb', parseNumbers: true });
//       const res = await axios.post(
//         `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/segment/previewAudience`,
//         { mongoQuery },
//         { withCredentials: true } 
//       );

//       setAudienceSize(res.data.data.audienceSize);
//     } catch (err: any) {
//       console.error('Audience fetch failed:', err);
//       const msg = err?.response?.data?.message || 'Failed to preview audience.';
//       setError(msg);
//       toast.error(msg);
//       setAudienceSize(null);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Automatically preview audience size on modal open
//   useEffect(() => {
//     if (open) {
//       fetchAudienceSize();
//       reset(); // Reset form when modal opens
//       setAudienceSize(null);
//       setError(null);
//     }
//   }, [open, reset]);

//   const onSubmit = async (data: FormData) => {
//     if (audienceSize === null || audienceSize <= 0) {
//       const message = 'Audience size must be greater than 0 to save the segment.';
//       toast.error(message);
//       setError(message);
//       return;
//     }

//     try {
//       const mongoQuery = formatQuery(query, { format: 'mongodb', parseNumbers: true });

//       const res=await axios.post<IApiResponse>(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/segment`, {
//         name: data.name,
//         rules: mongoQuery,
        
//       },{ withCredentials: true });

//       if(res.data.success){
//         const segmentId = res.data.data._id;
//         setSegmentId(segmentId);
//         setCampaignModalOpen(true); // open campaign modal
//         setOpen(false);
//         toast.success('Segment saved successfully');
//       }


//       toast.success('Segment saved successfully');
//       setOpen(false);
//     } catch (err: any) {
//       const message = err?.response?.data?.message || 'Failed to save segment.';
//       toast.error(message);
//     }
//   };

//   return (
//     <>
//     <Dialog open={open} onOpenChange={setOpen}>
//       <DialogTrigger asChild>
//         <Button variant="default">Save Segment</Button>
//       </DialogTrigger>

//       <DialogContent>
//         <DialogHeader>
//           <DialogTitle>Save Segment</DialogTitle>
//           <p className="text-sm text-muted-foreground">
//             Enter a name for your segment. Audience size will be previewed automatically.
//           </p>
//         </DialogHeader>

//         <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 mt-4">
//           {/* Segment Name Input */}
//           <div>
//             <Label htmlFor="name" className='mb-3'>Segment Name</Label>
//             <Input id="name" placeholder="e.g., High Spenders" {...register('name')} />
//             {errors.name && (
//               <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>
//             )}
//           </div>

//           {/* Audience Preview */}
//           <div className="rounded border p-4 bg-muted">
//             <p className="text-sm font-medium mb-2">Audience Preview</p>
//             {loading && (
//               <p className="text-sm text-muted-foreground">Calculating audience size...</p>
//             )}
//             {error && <p className="text-sm text-red-500">{error}</p>}
//             {audienceSize !== null && !loading && (
//               <p className="text-lg font-semibold">Audience Size: {audienceSize}</p>
//             )}
//           </div>

//           {/* Submit Button */}
//           <Button type="submit" disabled={isSubmitting || loading}>
//             {isSubmitting || loading ? 'Processing...' : 'Save Segment'}
//           </Button>
//         </form>
//       </DialogContent>
//     </Dialog>

//     <CampaignModal open={campaignModalOpen} onOpenChange={setCampaignModalOpen}></CampaignModal>
//     </>
//   );
// };

'use client'

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { RuleGroupType } from 'react-querybuilder';
import { formatQuery } from 'react-querybuilder';
import { useRouter } from 'next/navigation';

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { AxiosErrorType } from '@/types/ErrorType';

// ------------------ Zod Schemas ------------------
const segmentSchema = z.object({
  name: z.string().min(1, 'Segment name is required'),
});

const campaignSchema = z.object({
  campaignName: z.string().min(1, 'Campaign name is required'),
  message: z.string().min(1, 'Message is required'),
});

type SegmentFormData = z.infer<typeof segmentSchema>;
type CampaignFormData = z.infer<typeof campaignSchema>;

// ------------------ Component ------------------
interface SaveSegmentFormProps {
  query: RuleGroupType;
}

export const PreviewAudienceAndSaveSegmentModal = ({ query }: SaveSegmentFormProps) => {
  const router = useRouter();

  const [openSegmentModal, setOpenSegmentModal] = useState(false);
  const [openCampaignModal, setOpenCampaignModal] = useState(false);
  const [audienceSize, setAudienceSize] = useState<number | null>(null);
  const [segmentId, setSegmentId] = useState<string | null>(null);

  // Segment form
  const segmentForm = useForm<SegmentFormData>({
    resolver: zodResolver(segmentSchema),
  });

  // Campaign form
  const campaignForm = useForm<CampaignFormData>({
    resolver: zodResolver(campaignSchema),
  });

  const fetchAudienceSize = async () => {
    try {
      const mongoQuery = formatQuery(query, { format: 'mongodb', parseNumbers: true });
      const res = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/segment/previewAudience`, {
        mongoQuery,
      }, { withCredentials: true });

      setAudienceSize(res.data.data.audienceSize);
    } catch (err) {
      const error = err as AxiosErrorType
      toast.error(error?.response?.data?.message || 'Failed to preview audience.');
    }
  };

  useEffect(() => {
    if (openSegmentModal) {
      fetchAudienceSize();
      segmentForm.reset();
      setAudienceSize(null);
    }
    /* eslint eqeqeq: "off", curly: "error" */
  }, [openSegmentModal,segmentForm]); 

  const handleSaveSegment = async (data: SegmentFormData) => {
    if (!audienceSize || audienceSize <= 0) {
      return toast.error('Audience size must be greater than 0');
    }

    try {
      const mongoQuery = formatQuery(query, { format: 'mongodb', parseNumbers: true });

      const res = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/segment`, {
        name: data.name,
        rules: mongoQuery,
      }, { withCredentials: true });

      const savedSegmentId = res.data.data._id;
      setSegmentId(savedSegmentId);
      toast.success('Segment saved successfully');
      setOpenSegmentModal(false);
      setOpenCampaignModal(true); // Open campaign modal
    } catch (err) {
      const error = err as AxiosErrorType
      toast.error(error?.response?.data?.message || 'Failed to save segment.');
    }
  };

  const handleSaveCampaign = async (data: CampaignFormData) => {
    if (!segmentId) {return toast.error('Segment not found for campaign')};

    try {
      await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/campaign`, {
        segmentId,
        campaignName: data.campaignName,
        message: data.message,
        audienceSize
      }, { withCredentials: true });

      toast.success('Campaign created successfully');
      setOpenCampaignModal(false);
      router.push(`/dashboard/campaigns`);
    } catch (err) {
      const error = err as AxiosErrorType
      toast.error(error?.response?.data?.message || 'Failed to save campaign.');
    }
  };

  return (
    <>
      {/* Save Segment Button */}
      <Dialog open={openSegmentModal} onOpenChange={setOpenSegmentModal}>
        <DialogTrigger asChild>
          <Button>Save Segment</Button>
        </DialogTrigger>

        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save Segment</DialogTitle>
          </DialogHeader>

          <Form {...segmentForm}>
            <form onSubmit={segmentForm.handleSubmit(handleSaveSegment)} className="space-y-6">
              <FormField
                control={segmentForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Segment Name</FormLabel>
                    <FormControl>
                      <Input placeholder="High Spenders" {...field} />
                    </FormControl>
                    <FormDescription>Give this segment a descriptive name.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="text-sm font-medium">
                Audience Size:{' '}
                {audienceSize !== null ? (
                  <span className="font-semibold">{audienceSize}</span>
                ) : (
                  'Calculating...'
                )}
              </div>

              <Button type="submit" disabled={segmentForm.formState.isSubmitting}>
                {segmentForm.formState.isSubmitting ? 'Saving...' : 'Save Segment'}
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Campaign Modal */}
      <Dialog open={openCampaignModal} onOpenChange={setOpenCampaignModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Campaign</DialogTitle>
          </DialogHeader>

          <Form {...campaignForm}>
            <form onSubmit={campaignForm.handleSubmit(handleSaveCampaign)} className="space-y-6">
              <FormField
                control={campaignForm.control}
                name="campaignName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Campaign Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Summer Promo" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={campaignForm.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Message</FormLabel>
                    <FormControl>
                      <Input placeholder="Enjoy 20% off!" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" disabled={campaignForm.formState.isSubmitting}>
                {campaignForm.formState.isSubmitting ? 'Creating...' : 'Create Campaign'}
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
};
