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
    return `Expiring on ${formatDate(isoDate)}`;
  }

  return `Expired on ${formatDate(isoDate)}`;
};
