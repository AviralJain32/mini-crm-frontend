"use client"
import React, { useEffect, useState } from "react";
import api from "@/services/api";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import CreateCampaignModal from "@/components/CampaignModal";
import { Button } from "antd";

interface CampaignType {
  _id: string;
  name: string;
  message: string;
  audienceSize: number;
  segmentId: {
    name: string;
  };
  userId: {
    name: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const CampaignPage = () => {
  const [campaigns, setCampaigns] = useState<CampaignType[]>([]);
  const [loading, setLoading] = useState(true);
  const [openCampaignModal, setOpenCampaignModal] = useState(false);


  const fetchCampaigns = async () => {
    try {
      const res = await api.get("/campaign/allCampaign");
      setCampaigns(res.data.data);
    } catch (err) {
      console.error("Error fetching campaigns:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-4xl font-bold mb-4 text-center text-gray-800">
        📊 Campaign Dashboard
      </h1>

      <div className="flex justify-end">
        <Button variant="solid" onClick={()=>setOpenCampaignModal(!openCampaignModal)}>Create Campaign</Button>
        <CreateCampaignModal openCampaignModal={openCampaignModal} setOpenCampaignModal={setOpenCampaignModal}/>
      </div>

      {loading ? (
        <div className="space-y-4 mt-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full rounded-md" />
          ))}
        </div>
      ) : campaigns.length > 0 ? (
        <div className="border rounded-xl shadow-lg overflow-x-auto bg-white mt-4">
          <Table className="min-w-full text-sm text-gray-700">
            <TableHeader className="bg-gray-100">
              <TableRow>
                <TableHead className="px-6 py-4">Name</TableHead>
                <TableHead className="px-6 py-4">Created</TableHead>
                <TableHead className="px-6 py-4">Segment</TableHead>
                <TableHead className="px-6 py-4">Audience</TableHead>
                <TableHead className="px-6 py-4">Created By</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {campaigns.map((campaign, i) => (
                <TableRow
                  key={campaign._id}
                  className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}
                >
                  <TableCell className="px-6 py-4 font-medium">
                    {campaign.name}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    {new Date(campaign.createdAt).toLocaleString()}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <Badge variant="outline">
                      {campaign.segmentId?.name || "N/A"}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    {campaign.audienceSize ?? "N/A"}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    {campaign.userId?.name || "Unknown"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <p className="text-center text-gray-500 text-lg mt-4">
          No campaigns found.
        </p>
      )}
    </div>
  );
};

export default CampaignPage;
