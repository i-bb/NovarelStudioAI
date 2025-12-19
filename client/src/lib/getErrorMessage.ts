type ApiError = {
  type?: string;
  description?: any;
  message?: string;
};

export function getErrorMessage(
  error: ApiError,
  fallback = "Something went wrong. Please try again."
): string {
  if (!error) return fallback;

  if (error.type === "SERVER_ERROR") {
    const desc = error.description;

    if (typeof desc === "string") {
      return desc;
    }

    if (Array.isArray(desc) && desc[0]?.message) {
      return desc[0].message;
    }

    if (typeof desc === "object" && desc?.message) {
      return desc.message;
    }

    if (error.message) {
      return error.message;
    }
  }

  if (error.type === "NO_RESPONSE") {
    return "Unable to reach the server. Check your internet connection.";
  }

  if (error.type === "REQUEST_NOT_SENT") {
    return "Something went wrong before sending the request.";
  }

  return fallback;
}
