'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { RuleGroupType } from 'react-querybuilder';
import { PreviewAudienceAndSaveSegmentModal } from '@/app/(dashboard)/dashboard/segments/PreviewAudienceModal';
import axios from 'axios';
import Cookies from 'js-cookie';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

import { useRouter } from 'next/navigation';

const RuleBuilder = dynamic(
  () => import('@/app/(dashboard)/dashboard/segments/RuleBuilder'),
  { ssr: false }
);

export default function RulesPage() {

  const router = useRouter();

  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get('token');
    if (token) {
      Cookies.set('token', token, {
        secure: true,
        sameSite: 'None',
        expires: 1,
      });

      // Remove token from URL
      router.replace('/dashboard/segments', undefined);
    }
  }, []);
  
  const [query, setQuery] = useState<RuleGroupType>({
    combinator: 'and',
    rules: [],
  });

  const [nlInput, setNlInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleAiConversion = async () => {
    if (!nlInput) return toast.error('Please enter a prompt');
    setIsLoading(true);
    try {
       const prompt = `
        Convert the following user description into a JSON object in the format:
        {
          combinator: "and",
          rules: [
            {
              field: "totalSpend" | "visits" | "lastVisit",
              operator: "=" | "!=" | ">" | "<" | ">=" | "<=",
              value: string | number
            }
          ]
        }

        Use only the following fields:
        - totalSpend (number)
        - visits (number)
        - lastVisit (date)

        Only use these operators: =, !=, >, <, >=, <=

        Prompt: "${nlInput}"

        Respond ONLY with valid JSON. No comments, no code blocks, no explanations.
        `;
      const res = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.NEXT_PUBLIC_GEMINI_API_KEY}`,
        {
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
        },
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );

      const responseText = res.data.candidates[0]?.content?.parts[0]?.text ?? '';
      const cleaned = responseText.trim().replace(/```json|```/g, '');
      const parsed = JSON.parse(cleaned);
      setQuery(parsed);
      console.log(parsed)
      toast.success('Rules generated from prompt!');
    } catch (error) {
      toast.error('Failed to convert prompt');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="max-w-6xl mx-auto py-10 px-4">
      <div className="mb-10">
        <h1 className="text-3xl font-bold mb-6">Create a Segment</h1>

        <div className="mb-6">
          <label className="block font-semibold mb-2">Describe your audience (optional)</label>
          <div className="flex gap-2">
            <Input
              placeholder='e.g. "Users who haven’t shopped in 6 months and spent over ₹5K"'
              value={nlInput}
              onChange={(e) => setNlInput(e.target.value)}
              disabled={query.rules.length > 0}
            />
            <Button onClick={handleAiConversion} disabled={isLoading || query.rules.length > 0}>
              {isLoading ? 'Generating...' : 'Generate Rules'}
            </Button>
          </div>
          {query.rules.length > 0 && (
            <p className="text-sm text-gray-500 mt-2">Clear rules to use natural language input again.</p>
          )}
        </div>

        <div className="border p-4 rounded-lg bg-white shadow-sm">
          <h2 className="font-semibold mb-2">Manual Rule Builder</h2>
          <RuleBuilder query={query} setQuery={setQuery}  />
        </div>

        <div className="mt-6">
          <PreviewAudienceAndSaveSegmentModal query={query} />
        </div>
      </div>

      {/* Segment Table Below Form */}
    </main>
  );
}
