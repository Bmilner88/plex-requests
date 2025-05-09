import { Request } from "@/lib/types";

export function useAdminHandlers(
  requests: Request[],
  setRequests: React.Dispatch<React.SetStateAction<Request[]>>
) {
  const handleStatusChange = async (
    e: React.ChangeEvent<HTMLSelectElement>,
    requestId: number
  ) => {
    const newStatus = e.target.value;

    // Update state locally for immediate feedback
    setRequests((prev) =>
      prev.map((request) =>
        request.request_id === requestId
          ? { ...request, request_status: newStatus }
          : request
      )
    );

    try {
      // Send update to server
      const response = await fetch(`/api/update-status/${requestId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${window.localStorage.getItem("isAdmin")}`,
        },
        body: JSON.stringify({
          status: newStatus,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update status");
      }

      // Send notification
      sendNotification(requestId);
    } catch (err) {
      console.error("Error updating status:", err);

      // Revert the status if the update failed
      setRequests((prev) =>
        prev.map((request) =>
          request.request_id === requestId
            ? { ...request, request_status: request.request_status }
            : request
        )
      );
    }
  };

  const handleNoteChange = async (
    e: React.ChangeEvent<HTMLTextAreaElement>,
    requestId: number
  ) => {
    const newNote = e.target.value;

    // Update state locally for immediate feedback
    setRequests((prev) =>
      prev.map((request) =>
        request.request_id === requestId
          ? { ...request, request_note: newNote }
          : request
      )
    );
  };

  const handleNoteBlur = async (
    e: React.ChangeEvent<HTMLTextAreaElement>,
    requestId: number
  ) => {
    const newNote = e.target.value;

    try {
      // Send update to server
      const response = await fetch(`/api/update-note/${requestId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${window.localStorage.getItem("isAdmin")}`,
        },
        body: JSON.stringify({
          note: newNote || "",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update note");
      }
    } catch (err) {
      console.error("Error updating note:", err);

      // Revert the note if the update failed
      setRequests((prev) =>
        prev.map((request) =>
          request.request_id === requestId
            ? { ...request, request_noet: request.request_note }
            : request
        )
      );
    }
  };

  const handleDeletion = async (
    e: React.MouseEvent<HTMLButtonElement>,
    requestId: number
  ) => {
    e.preventDefault();
    try {
      // Send deletion to server
      const response = await fetch(`/api/delete-request/${requestId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${window.localStorage.getItem("isAdmin")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete request");
      }

      // Update local state by removing the deleted request
      setRequests((prevRequests) =>
        prevRequests.filter((request) => request.request_id !== requestId)
      );
    } catch (err) {
      console.error("Error deleting request:", err);
    }
  };

  const sendNotification = async (requestId: number) => {
    // Send notification for updated status
    try {
      const response = await fetch("/api/update-notification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${window.localStorage.getItem("isAdmin")}`,
        },
        body: JSON.stringify({
          id: requestId,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send notification");
      }
    } catch (err) {
      console.error("Error sending notification", err);
    }
  };

  return {
    requests,
    handleStatusChange,
    handleNoteChange,
    handleNoteBlur,
    handleDeletion,
  };
}
