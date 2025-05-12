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
import CampaignModal from '../../../../components/CampaignModal';

// ------------------ Zod Schemas ------------------
const segmentSchema = z.object({
  name: z.string().min(1, 'Segment name is required'),
});


type SegmentFormData = z.infer<typeof segmentSchema>;

// ------------------ Component ------------------
interface SaveSegmentFormProps {
  query: RuleGroupType;
}

export const PreviewAudienceAndSaveSegmentModal = ({ query }: SaveSegmentFormProps) => {

  const [openSegmentModal, setOpenSegmentModal] = useState(false);
  const [openCampaignModal, setOpenCampaignModal] = useState(false);
  const [audienceSize, setAudienceSize] = useState<number | null>(null);
  const [segmentId, setSegmentId] = useState<string | null>(null);

  // Segment form
  const segmentForm = useForm<SegmentFormData>({
    resolver: zodResolver(segmentSchema),
     defaultValues: {
    name: '', // Make sure the default value is an empty string
  },
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
  /* eslint-disable */
  useEffect(() => {
    if (openSegmentModal) {
      fetchAudienceSize();
      segmentForm.reset();
      setAudienceSize(null);
    }
    
  }, [openSegmentModal,segmentForm]); 
  /* eslint-enable */

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
      {/* <Dialog open={openCampaignModal} onOpenChange={setOpenCampaignModal}>
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
      </Dialog> */}

      <CampaignModal audienceSize={audienceSize} openCampaignModal={openCampaignModal} segmentId={segmentId} setOpenCampaignModal={setOpenCampaignModal} />
    </>
  );
};
