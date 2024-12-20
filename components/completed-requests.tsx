import { Request, completedProps } from "@/lib/types";

export default function RequestTable({
  completedRequests,
  loading,
  table,
  setTable,
}: completedProps) {
  // Get the status color
  function statusColor(status: string) {
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
  }

  return (
    <div className="min-h-screen flex justify-center items-center bg-base-200">
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
                  completedRequests.length > 0 ? (
                    completedRequests.map((request: Request) => (
                      <tr key={request.request_id}>
                        <td>{request.request_title}</td>
                        <td>{request.request_year}</td>
                        <td>{request.request_type}</td>
                        <td>
                          <p
                            className={`rounded-lg text-center border-2 p-2 ${statusColor(
                              request.request_status
                            )}`}
                          >
                            {request.request_status}
                          </p>
                        </td>
                        <td>
                          <p>{request.request_note}</p>
                        </td>
                      </tr>
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
          <div className="text-center text-xs pt-4">
            <button
              onClick={() => {
                setTable(!table);
              }}
              className="text-info font-bold"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
