"use client";

import { useEffect, useState } from "react";

import { useFetchData } from "@/lib/hooks/useFetchData";
import { ModalType } from "@/lib/types";
import { statusColor, formateDate } from "@/lib/helpers";
import {
  fetchCurrentRequests,
  fetchCompleteRequests,
} from "@/lib/fetchRequests";

import SearchForm from "@/components/search-form";
import ManualForm from "@/components/manual-form";
import RequestCard from "@/components/request-card";

export default function Home() {
  const {
    requests: currentRequests,
    status: currentStatus,
    fetchData: fetchCurrentData,
  } = useFetchData(fetchCurrentRequests);
  const {
    requests: completedRequests,
    status: completedStatus,
    fetchData: fetchCompletedData,
  } = useFetchData(fetchCompleteRequests);

  const [table, setTable] = useState(false);
  const [manual, setManual] = useState(false);
  const [modalData, setModalData] = useState<ModalType | null>(null);

  // Fetch inital data
  useEffect(() => {
    fetchCurrentData();
    fetchCompletedData();
  }, []);

  return (
    <div className="h-screen text-slate-200">
      <div className="hero bg-base-200 min-h-screen px-4">
        <div className="hero-content flex flex-col lg:flex-row-reverse lg:items-center gap-8">
          <div className="text-center lg:pl-20 lg:text-left max-w-xl gap-4">
            <h1 className="text-3xl md:text-4xl font-bold">
              Submit a request! 🎬
            </h1>
            {!manual ? (
              <p className="pt-6 text-base md:text-lg">
                Search for a TV Show, Movie or Anime to request!
                <br />
                If you are unable to find your request via search, click{" "}
                <span
                  className="font-bold text-info hover:text-accent transition-all duration-200"
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    setManual(!manual);
                  }}
                >
                  here
                </span>{" "}
                to use the Manual Form!
              </p>
            ) : (
              <p className="pt-6 text-base md:text-lg">
                Fill out the form to submit a request!
                <br />
                Click{" "}
                <span
                  className="font-bold text-info hover:text-accent transition-all duration-200"
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    setManual(!manual);
                  }}
                >
                  here
                </span>{" "}
                to swap back to the Search form.
              </p>
            )}

            <button
              onClick={() => {
                document
                  .querySelector(".requests-table")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
              className="btn btn-soft btn-info font-bold mt-4"
            >
              <span className="flex items-center gap-2">
                See current requests
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 13.5 12 21m0 0-7.5-7.5M12 21V3"
                  />
                </svg>
              </span>
            </button>
          </div>
          <div className="card bg-base-100 w-full sm:w-80 md:w-96 lg:w-[28rem] shrink-0 shadow-2xl">
            {!manual ? (
              <SearchForm refetchRequests={fetchCurrentData} />
            ) : (
              <ManualForm refetchRequests={fetchCurrentData} />
            )}
          </div>
        </div>
      </div>

      {/* Request Card Table */}
      <div className="requests-table min-h-screen flex justify-center items-center bg-base-200 px-4 py-8">
        <div className="grid gap-8 sm:grid-cols-1 p-4 lg:grid-cols-2 xl:grid-cols-3 w-11/12 sm:w-3/4 justify-items-center max-h-screen overflow-y-auto">
          {!table ? (
            !currentStatus.loading && currentStatus.success ? (
              currentRequests.length > 0 ? (
                currentRequests.length === 1 ? ( // TODO: Make this logic cleaner and add to Completed Requests section below
                  <>
                    <div></div>
                    {currentRequests.map((request) => (
                      <RequestCard
                        key={request.request_id}
                        request={request}
                        setModalData={setModalData}
                      />
                    ))}
                  </>
                ) : (
                  currentRequests.map((request) => (
                    <RequestCard
                      key={request.request_id}
                      request={request}
                      setModalData={setModalData}
                    />
                  ))
                )
              ) : (
                <div className="text-2xl font-bold lg:col-span-2 xl:col-span-3">
                  No current requests
                </div>
              )
            ) : (
              <span className="loading loading-dots loading-lg lg:col-span-2 xl:col-span-3"></span>
            )
          ) : !completedStatus.loading && completedStatus.success ? (
            completedRequests.length > 0 ? (
              completedRequests.map((request) => (
                <RequestCard
                  key={request.request_id}
                  request={request}
                  setModalData={setModalData}
                />
              ))
            ) : (
              <div className="text-2xl font-bold lg:col-span-2 xl:col-span-3">
                No recently completed requests
              </div>
            )
          ) : (
            <span className="loading loading-dots loading-lg lg:col-span-2 xl:col-span-3"></span>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="footer footer-center bg-base-300 text-base-content py-4 mt-auto h-[88px]">
        {!table ? (
          <div className="text-center text-xs font-bold text-base-content pt-4">
            Don&apos;t see your request? Check here:{" "}
            <button
              onClick={() => {
                setTable(!table);
                document.querySelector(".requests-table")?.scrollIntoView(true);
              }}
              className="cursor-pointer text-info font-bold hover:text-accent transition-all duration-200"
            >
              Completed Requests
            </button>
          </div>
        ) : (
          <div className="text-center text-xs pt-4">
            <button
              onClick={() => {
                setTable(!table);
                document.querySelector(".requests-table")?.scrollIntoView(true);
              }}
              className="cursor-pointer text-info font-bold hover:text-accent transition-all duration-200"
            >
              Go Back
            </button>
          </div>
        )}
      </footer>

      {/* Request Modal */}
      <dialog id="request_modal" className="modal">
        {modalData && (
          <div className="modal-box flex flex-col md:flex-row p-0 sm:w-3/4 md:w-6/12 xl:w-4/12 max-w-4xl transition-all duration-300 ease-in-out">
            {/* Left section (image) */}
            {modalData.request_optional.image && (
              <div className="md:w-1/2 w-full h-64 md:h-auto">
                <img
                  src={`https://image.tmdb.org/t/p/w500${modalData.request_optional.image}`}
                  alt={`Poster for ${modalData.request_title}`}
                  className="h-full w-full object-cover rounded-t-lg md:rounded-l-lg md:rounded-tr-none"
                />
              </div>
            )}

            {/* Right section (content) */}
            <div className="md:w-1/2 w-full p-6">
              <form method="dialog">
                <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                  ✕
                </button>
              </form>
              {/* Modal Body */}
              <h3 className="font-bold text-2xl">{modalData.request_title}</h3>
              <div className="flex items-center gap-4 sm:gap-8 h-24">
                <div className="flex flex-col justify-center">
                  {modalData.request_optional.year && (
                    <p className="text-lg font-normal">
                      {modalData.request_optional.year}
                    </p>
                  )}
                  <p className="text-sm italic font-normal text-accent">
                    {modalData.request_type}
                  </p>
                </div>
                <div className="flex flex-col justify-center">
                  {modalData.request_optional.rating && (
                    <p className="badge badge-outline">
                      {modalData.request_optional.rating}
                    </p>
                  )}
                </div>
              </div>
              <p
                className={`badge badge-outline py-4 ${statusColor(modalData.request_status)}`}
              >
                {modalData.request_status}
              </p>
              <p className="my-4">
                <span className="font-bold">Requested On: </span>
                {formateDate(modalData.request_timestamp)}
              </p>
              {modalData.request_note && (
                <p className="my-4">
                  <span className="font-bold">Note: </span>
                  {modalData.request_note}
                </p>
              )}
            </div>
          </div>
        )}
        {/* Modal Backdrop */}
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </div>
  );
}
