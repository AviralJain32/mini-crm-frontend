"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { format } from "date-fns";

interface Segment {
  _id: string;
  name: string;
  audienceSize: number;
  createdAt: string;
  userId: {
    _id: string;
    name: string;
  };
}

export default function SegmentTable() {
  const [segments, setSegments] = useState<Segment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/segment/allSegments`, {
        withCredentials: true,
      })
      .then((res) => {
        setSegments(res.data.data.segments || []);
      })
      .catch((error:any) => toast.error("Failed to load segments"+error))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">All Segments</h1>

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : segments.length === 0 ? (
        <p className="text-gray-500">No segments found.</p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
          <table className="min-w-full bg-white text-sm text-left">
            <thead className="bg-gray-100 text-gray-700 font-semibold">
              <tr>
                <th className="px-6 py-3">Segment Name</th>
                <th className="px-6 py-3">Audience Size</th>
                <th className="px-6 py-3">Created By</th>
                <th className="px-6 py-3">Created At</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {segments.map((seg) => (
                <tr key={seg._id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 font-medium">{seg.name}</td>
                  <td className="px-6 py-4">{seg.audienceSize}</td>
                  <td className="px-6 py-4">{seg.userId?.name || "Unknown"}</td>
                  <td className="px-6 py-4">
                    {format(new Date(seg.createdAt), "dd MMM yyyy")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
