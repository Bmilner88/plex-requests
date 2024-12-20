"use client";

import { useState, useEffect } from "react";
import { Request, currentProps } from "@/lib/types";
import RequestRow from "./request-row";

export default function CurrentRequests({
  currentRequests,
  loading,
  table,
  setTable,
}: currentProps) {
  const [requests, setRequests] = useState<Request[]>(currentRequests);

  // Put data into temporary State
  useEffect(() => {
    setRequests(currentRequests);
  }, [currentRequests]);

  // Get the status color
  function statusColor(status: string) {
    switch (status) {
      case "New":
        return "border-secondary";
      case "In Progress":
        return "border-primary";
      case "Pending":
        return "border-warning";
      case "Complete":
        return "border-success";
      default:
        return "";
    }
  }

  return (
    <div className="requests-table min-h-screen flex justify-center items-center bg-base-200">
      <div className="card w-full sm:w-3/4 xl:w-2/3 bg-base-100 shadow-xl">
        <div className="card-body">
          <div className="overflow-x-auto">
            <table className="table w-full max-w-5xl border-collapse table-pin-rows">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Release Year</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Note</th>
                </tr>
              </thead>
              <tbody>
                {!loading.loading && loading.success ? (
                  requests.length > 0 ? (
                    requests.map((request: Request) => (
                      <RequestRow key={request.request_id} request={request} />
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="text-center">
                        No current requests
                      </td>
                    </tr>
                  )
                ) : (
                  <tr>
                    <td colSpan={5} className="text-center">
                      <span className="loading loading-dots loading-md"></span>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="text-center text-xs font-bold text-base-content pt-4">
            Don&apos;t see your request? Check here:{" "}
            <button
              onClick={() => {
                setTable(!table);
              }}
              className="text-info font-bold"
            >
              Completed Requests
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
