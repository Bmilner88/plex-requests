"use client";

import { useEffect, useState } from "react";
import { fetchCurrentRequests } from "@/lib/fetchRequests";

// Define the Request type
interface Request {
  request_id: number;
  request_title: string;
  request_year: number;
  request_requestor: string;
  request_type: string;
  request_status: string;
}

type RequestTableProps = {
  requestsData: Request[], // Ensure requestsData is an array
};

// Define the state type for `stat`
interface Status {
  loading: boolean;
  error: string | null;
}

export default function RequestTable() {
  const [requests, setRequests] = useState<Request[]>([]);
  const [updatedRequests, setUpdatedRequests] = useState(requests);
  const [status, setStatus] = useState<Status>({
    loading: true,
    error: null,
  });

  const fetchData = async () => {
    setStatus({ loading: true, error: null });
    try {
      const result = await fetchCurrentRequests();
      setRequests(result);
    } catch (err: unknown) {
      setStatus({ loading: false, error: (err as Error).message });
    } finally {
      setStatus((prev) => ({ ...prev, loading: false }));
    }
  };

  // Get requests json
  useEffect(() => {
    fetchData();
  }, []);

  const handleStatusChange = async (e: any, requestId: number) => {
    const newStatus = e.target.value;

    // Update the status locally for immediate feedback
    const updatedRequestList = updatedRequests.map((request: any) =>
      request.request_id === requestId
        ? { ...request, request_status: newStatus }
        : request
    );
    setUpdatedRequests(updatedRequestList);

    // Send update to server
    try {
      const response = await fetch(
        `/api/update/${requestId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update status");
      }

      const updatedRequest = await response.json();
      console.log("Status updated", updatedRequest);
      await fetchData();
    } catch (error) {
      console.error("Error updating status:", error);

      const revertedRequestList = updatedRequests.map((request) =>
        request.request_id === requestId
          ? { ...request, request_status: request.request_status }
          : request
      );
      setUpdatedRequests(revertedRequestList);
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="table table-xs table-pin-rows">
        <thead>
          <tr>
            <th>Title</th>
            <th>Release Year</th>
            <th>Requestor</th>
            <th>Type</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
        {requests.length > 0 ? (
            // Add all rows from DB
            requests.map((request: any) => {
              if (request.request_status != "Complete") {
                return (
                  <tr key={request.request_title}>
                    <td>{request.request_title}</td>
                    <td>{request.request_year}</td>
                    <td>{request.request_requestor}</td>
                    <td>{request.request_type}</td>
                    <td>
                      <select
                        id="status"
                        name="status"
                        value={request.request_status}
                        onChange={(e) =>
                          handleStatusChange(e, request.request_id)
                        }
                      >
                        <option value="New">New</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Complete">Complete</option>
                      </select>
                    </td>
                  </tr>
                );
              }
            })
          ) : (
            // If no requests are found
            <tr>
              <td>No requests found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}