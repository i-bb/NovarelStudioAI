import React from "react";
import { CircleAlert } from "lucide-react";
import { Button } from "./ui/button";

function CancelSubscriptionModal({
  open,
  onClose,
  onConfirm,
  loading,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading: boolean;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-md rounded-2xl border border-white/10 bg-black/80 backdrop-blur-xl p-6">
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-500/10 text-red-400">
            <CircleAlert />
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-white">
              Cancel subscription?
            </h3>

            <p className="text-sm text-gray-400">
              Your subscription will remain active until the end of the current
              billing period. You’ll lose access to plan benefits after it
              expires.
            </p>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap justify-center sm:justify-end gap-3">
          <Button
            className="text-gray-300 border bg-transparent hover:text-white"
            onClick={onClose}
            disabled={loading}
          >
            Keep subscription
          </Button>

          <Button
            className="bg-red-600 hover:bg-red-500 text-white"
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? "Cancelling..." : "Yes, cancel"}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default CancelSubscriptionModal;
