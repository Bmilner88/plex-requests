import React from "react";
import Image from "next/image";
import { RequestRowProps } from "@/lib/types";

const AdminRow: React.FC<RequestRowProps> = ({
  request,
  onStatusChange,
  onNoteChange,
  onNoteBlur,
  onRequestDelete,
}) => {
  const statusColor = (status: string) => {
    switch (status) {
      case "New":
        return "select-secondary";
      case "In Progress":
        return "select-primary";
      case "Pending":
        return "select-warning";
      case "Complete":
        return "select-success";
      default:
        return "";
    }
  };

  return (
    <>
      <tr className="text-slate-100">
        <td>
          <button
            className="cursor-pointer transition ease-in-out hover:scale-110 hover:text-red-500 duration-200"
            onClick={(e) => {
              onRequestDelete(e, request.request_id);
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
              />
            </svg>
          </button>
        </td>
        <td>
          <select
            id="status"
            name="status"
            value={request.request_status}
            onChange={(e) => onStatusChange(e, request.request_id)}
            className={`select w-full max-w-xs select-sm ${statusColor(
              request.request_status
            )}`}
          >
            <option className="bg-secondary" value="New">
              New
            </option>
            <option className="bg-primary" value="In Progress">
              In Progress
            </option>
            <option className="bg-warning" value="Pending">
              Pending
            </option>
            <option className="bg-success" value="Complete">
              Complete
            </option>
          </select>
        </td>
        <td>
          {request.request_optional.image && (
            <Image
              src={`https://image.tmdb.org/t/p/w500${request.request_optional.image}`}
              alt={`${request.request_title} poster`}
              width={85}
              height={150}
              draggable="false"
            />
          )}
        </td>
        <td>{request.request_title}</td>
        <td>
          <div className="flex flex-col">
            <p className="text-sm font-bold">{request.request_type}</p>
            {request.request_optional.year && (
              <p className="text-sm font-normal">
                {request.request_optional.year}
              </p>
            )}
            {request.request_optional.rating && (
              <p className="text-sm font-normal">
                {request.request_optional.rating}
              </p>
            )}
            {request.request_optional.seasons && (
              <p className="text-sm font-normal">
                Seasons: {request.request_optional.seasons.length}
              </p>
            )}
          </div>
        </td>
        <td>
          {request.request_requestor}
        </td>
        <td>
          <textarea
            id="note"
            name="note"
            placeholder="Note..."
            value={request.request_note || ""}
            onBlur={(e) => onNoteBlur(e, request.request_id)}
            onChange={(e) => onNoteChange(e, request.request_id)}
            className="textarea textarea-bordered w-full"
          />
        </td>
      </tr>
    </>
  );
};

export default AdminRow;
