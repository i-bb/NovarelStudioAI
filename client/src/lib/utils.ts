import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatDate = (isoDate: string) => {
  return new Date(isoDate).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export const getExpiryLabel = (isoDate: string) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const expiry = new Date(isoDate);
  expiry.setHours(0, 0, 0, 0);

  if (expiry.getTime() === today.getTime()) {
    return "Expiring today";
  }

  if (expiry > today) {
    return `Expires on ${formatDate(isoDate)}`;
  }

  return `Expired on ${formatDate(isoDate)}`;
};

// export const generateStreamName = (session: any) => {
//   const { streamer_username, created_on, provider } = session;

//   const date = new Date(created_on);

//   const year = date.getUTCFullYear();
//   const month = String(date.getUTCMonth() + 1).padStart(2, "0");
//   const day = String(date.getUTCDate()).padStart(2, "0");

//   const hours = String(date.getUTCHours()).padStart(2, "0");
//   const minutes = String(date.getUTCMinutes()).padStart(2, "0");
//   const seconds = String(date.getUTCSeconds()).padStart(2, "0");

//   const name =
//     streamer_username && created_on
//       ? `${streamer_username}_stream_${year}-${month}-${day}_${hours}-${minutes}-${seconds}`
//       : "";

//   return name;
// };
export const generateStreamName = (session: any) => {
  const { streamer_username, created_on } = session;

  if (!created_on) return "";

  const date = new Date(created_on);

  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");

  const hours = String(date.getUTCHours()).padStart(2, "0");
  const minutes = String(date.getUTCMinutes()).padStart(2, "0");
  const seconds = String(date.getUTCSeconds()).padStart(2, "0");

  const timestamp = `${year}-${month}-${day}_${hours}-${minutes}-${seconds}`;

  // Exclude username if it's default_streamer
  if (!streamer_username || streamer_username === "default_streamer") {
    return `stream_${timestamp}`;
  }

  return `${streamer_username}_stream_${timestamp}`;
};
