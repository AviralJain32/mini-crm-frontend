'use client'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import axios from 'axios';
import { useEffect, useState } from 'react';
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
import { useRouter } from 'next/navigation';
import { Loader } from "lucide-react";

const campaignSchema = z.object({
  campaignName: z.string().min(1, 'Campaign name is required'),
  message: z.string().min(1, 'Message is required'),
  segmentId: z.string().optional(), // only used if segmentId is not passed from props
});

type CampaignFormData = z.infer<typeof campaignSchema>;

type CampaignModelProps = {
  segmentId?: string | null;
  audienceSize?: number | null;
  setOpenCampaignModal: React.Dispatch<React.SetStateAction<boolean>>;
  openCampaignModal: boolean;
};

const CampaignModal = ({
  segmentId,
  audienceSize,
  setOpenCampaignModal,
  openCampaignModal,
}: CampaignModelProps) => {
    const router = useRouter();
    const [objective, setObjective] = useState('');
    const [loadingSuggestions, setLoadingSuggestions] = useState(false);
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [availableSegments, setAvailableSegments] = useState<{ id: string; name: string; audienceSize: number }[]>([]);
    const [selectedSegmentId, setSelectedSegmentId] = useState<string | null>(null);
    const [selectedAudienceSize, setSelectedAudienceSize] = useState<number | null>(null);

    // Fetch segments when segmentId not provided
    useEffect(() => {
    if (!segmentId) {
        axios
        .get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/segment/allSegments`, {
            withCredentials: true,
        })
        .then((res) => {
            console.log((res.data))
            setAvailableSegments(res.data.data.segments || []);
        })
        .catch(() => toast.error("Failed to load segments"));
    }
    }, [segmentId]);


  const campaignForm = useForm<CampaignFormData>({
    resolver: zodResolver(campaignSchema),
  });

  const getSuggestionsFromGemini = async (objective: string) => {
    setLoadingSuggestions(true);
    try {
      const res = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.NEXT_PUBLIC_GEMINI_API_KEY}`,
        {
          contents: [
            {
              parts: [
                {
                  text: `Generate 3 creative and short marketing message variants for this objective: "${objective}". Return them as a bullet list.`,
                },
              ],
            },
          ],
        },
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );

      const text = res.data.candidates?.[0]?.content?.parts?.[0]?.text || '';
      console.log(text)
      const lines = text
        .split('\n')
        .map((line:string) =>
            line
            .replace(/^[-*•\s]*\*\*/, '')         // Remove starting bullets and double stars
            .replace(/\*\*$/, '')                // Remove trailing double stars
            .replace(/\*\*/g, '')                // Remove any remaining bold markers
            .replace(/\([^)]*\)/g, '')           // Remove text in parentheses
            .replace(/\[.*?\]/g, 'Xeno Mini CRM Campaign')// Replace placeholder with actual name
            .trim()
        )
        .filter(Boolean);
      setSuggestions(lines);
    } catch (error) {
      toast.error('Failed to fetch suggestions from AI');
      setSuggestions([]);
    } finally {
      setLoadingSuggestions(false);
    }
  };

  if(!availableSegments){
    return <Loader/>
  }

 const handleSaveCampaign = async (data: CampaignFormData) => {
  const finalSegmentId = segmentId || selectedSegmentId;
  const finalAudienceSize = audienceSize ?? selectedAudienceSize;

  if (!finalSegmentId) return toast.error("Please select a segment");

  try {
    await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/campaign`,
      {
        segmentId: finalSegmentId,
        campaignName: data.campaignName,
        message: data.message,
        audienceSize: finalAudienceSize,
      },
      { withCredentials: true }
    );

    toast.success("Campaign created successfully");
    setOpenCampaignModal(false);
    router.push(`/dashboard/campaigns`);
  } catch (err) {
    const error = err as AxiosErrorType;
    toast.error(error?.response?.data?.message || "Failed to save campaign.");
  }
};


  console.log(suggestions)
  return (
    <Dialog open={openCampaignModal} onOpenChange={setOpenCampaignModal}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Create Campaign</DialogTitle>
        </DialogHeader>

        {!segmentId && (
            <div className="space-y-2">
                <Select
                onValueChange={(val) => {
                    const seg = availableSegments.find((s) => s.id === val);
                    setSelectedSegmentId(val);
                    setSelectedAudienceSize(seg?.audienceSize ?? null);
                }}
                >
                <SelectTrigger className="w-56">
                    <SelectValue placeholder="Choose a segment" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                  <SelectLabel>Select The Segment</SelectLabel>
                    {availableSegments.map((seg) => (
                    <SelectItem key={seg.id} value={seg.id}>
                        {seg.name} ({seg.audienceSize} users)
                    </SelectItem>
                    ))}
                    </SelectGroup>
                </SelectContent>
                </Select>
            </div>
            )}

        {/* AI Objective + Suggestions */}
        <div className="space-y-3">
          <Input
            placeholder="Enter campaign objective (e.g., bring back inactive users)"
            value={objective}
            onChange={(e) => setObjective(e.target.value)}
          />
          <Button
            type="button"
            onClick={() => getSuggestionsFromGemini(objective)}
            disabled={loadingSuggestions || !objective}
          >
            {loadingSuggestions ? 'Generating...' : 'Get AI Suggestions'}
          </Button>

          {suggestions.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {suggestions.map((suggestion, idx) => (
                <span
                  key={idx}
                  onClick={() =>
                    campaignForm.setValue('message', suggestion)
                  }
                  className="cursor-pointer rounded-full bg-blue-100 px-4 py-1 text-sm hover:bg-blue-200 transition"
                >
                  {suggestion}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Campaign Form */}
        <Form {...campaignForm}>
          <form
            onSubmit={campaignForm.handleSubmit(handleSaveCampaign)}
            className="space-y-6 pt-4"
          >
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

            <Button
              type="submit"
              className="w-full"
              disabled={campaignForm.formState.isSubmitting}
            >
              {campaignForm.formState.isSubmitting
                ? 'Creating...'
                : 'Create Campaign'}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CampaignModal;
