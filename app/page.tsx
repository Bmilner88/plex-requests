"use client";

import { useEffect, useState } from "react";

import {
  fetchCurrentRequests,
  fetchCompleteRequests,
} from "@/lib/fetchRequests";
import { useFetchData } from "@/lib/hooks/useFetchData";

import CurrentRequests from "@/components/current-requests";
import CompletedRequests from "@/components/completed-requests";
import SearchForm from "@/components/search-form";

export default function Home() {
return (
    <div className="h-screen">
      <div className="hero bg-base-200 min-h-screen">
        <div className="hero-content flex-col lg:flex-row-reverse">
          <div className="text-center lg:pl-20 lg:text-left">
            <h1 className="text-4xl font-bold">Submit a request! 🎬</h1>
            <p className="pt-6">
              Submit a media request by searching or manually filling out the
              form!
            </p>
            <button
              onClick={() => {
                document
                  .querySelector(".requests-table")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
              className="text-info font-bold"
            >
              See current requests
            </button>
          </div>
          <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
            <SearchForm refetchRequests={fetchCurrentRequests} />
          </div>
        </div>
      </div>
      <div className="requests-table min-h-screen flex justify-center items-center bg-base-200">
        <div className="card w-full sm:w-3/4 xl:w-2/3 bg-base-100 shadow-xl">
          <div className="card-body">
            <div className="overflow-x-auto">
              {!table ? (
                <CurrentRequests
                  currentRequests={currentRequests}
                  loading={currentStatus}
                  table={table}
                  setTable={setTable}
                />
              ) : (
                <CompletedRequests
                  completedRequests={completedRequests}
                  loading={completedStatus}
                  table={table}
                  setTable={setTable}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
