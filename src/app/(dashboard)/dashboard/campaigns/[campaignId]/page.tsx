"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Table, TableHead, TableHeader, TableBody, TableRow, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import api from "@/services/api";

type LogType = {
  _id: string;
  status: "SENT" | "FAILED" | "PENDING";
  customerId: {
    name: string;
    email: string;
  };
  message: string;
  createdAt: string;
};

export default function CampaignLogsPage() {
  const { campaignId } = useParams();
  console.log(campaignId)
  const [logs, setLogs] = useState<LogType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await api.get(`/communicationlogs/${campaignId}/logs`);
        setLogs(res.data.data);
      } catch (err) {
        console.error("Error fetching logs:", err);
      } finally {
        setLoading(false);
      }
    };

    if (campaignId) fetchLogs();
  }, [campaignId]);

  return (
    <div className="max-w-6xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">📋 Communication Logs for Campaign</h1>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Message</TableHead>
              <TableHead>Time</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logs.map((log) => (
              <TableRow key={log._id}>
                <TableCell>{log.customerId?.name || "N/A"}</TableCell>
                <TableCell>{log.customerId?.email || "N/A"}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      log.status === "SENT"
                        ? "default"
                        : log.status === "FAILED"
                        ? "destructive"
                        : "outline"
                    }
                  >
                    {log.status}
                  </Badge>
                </TableCell>
                <TableCell className="max-w-xs truncate">{log.message}</TableCell>
                <TableCell>{new Date(log.createdAt).toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
