// app/rules/page.tsx
'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';
import { RuleGroupType } from 'react-querybuilder';
import { PreviewAudienceAndSaveSegmentModal } from '@/app/(dashboard)/dashboard/segments/PreviewAudienceModal';

const RuleBuilder = dynamic(() => import('@/app/(dashboard)/dashboard/segments/RuleBuilder'), { ssr: false });

export default function RulesPage() {
  const [query, setQuery] = useState<RuleGroupType>({
    combinator: 'and',
    rules: [],
  });

  return (
    <main className="max-w-4xl mx-auto py-10">
      <div>
      <h1 className="text-2xl font-bold mb-4">Create a Segment</h1>
      <RuleBuilder query={query} setQuery={setQuery} />
      <div className="mt-6">
        <PreviewAudienceAndSaveSegmentModal query={query} />
      </div>
      </div>
    </main>
  );
}

