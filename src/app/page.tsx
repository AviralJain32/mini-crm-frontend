import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import NavbarServer from '@/components/NavbarServer';

export default function LandingPage() {
  return (
    <>
    <NavbarServer/>
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-200 text-blue-900 flex flex-col items-center justify-center px-6">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-extrabold tracking-tight mb-4 text-blue-900">
          Mini CRM
        </h1>
        <p className="text-lg max-w-xl mx-auto text-blue-700">
          Supercharge your customer communication with a lightweight, powerful CRM built for modern marketing teams.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl">
        {[
          {
            title: "Campaign Management",
            description: "Design, schedule and monitor SMS/email campaigns effortlessly."
          },
          {
            title: "Customer Segmentation",
            description: "Create dynamic groups for targeted messaging and engagement."
          },
          {
            title: "Delivery Analytics",
            description: "Track delivery rates, click-throughs, and engagement in real-time."
          }
        ].map((feature, index) => (
          <Card key={index} className="rounded-2xl bg-white shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-2 text-blue-900">{feature.title}</h3>
              <p className="text-sm text-blue-700">{feature.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-12">
        <Link href={"/dashboard"}>
        <Button className="text-lg px-6 py-3 rounded-2xl bg-blue-600 text-white hover:bg-blue-700 transition-all flex items-center gap-2">
          Get Started <ArrowRight size={20} />
        </Button>
        </Link>
      </div>
    </div>
    </>
  );
}