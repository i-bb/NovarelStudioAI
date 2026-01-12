import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

const PaymentSuccessModal = ({
  open,
  onClose,
  sessionId,
  date,
  planName,
}: any) => {
  return (
    <div className="px-[20px]">
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-md bg-gradient-to-b from-background via-background/95 to-black/95 p-6 rounded-xl shadow-2xl border">
          <div className="flex flex-col items-center text-center gap-2">
            <CheckCircle className="h-12 w-12 text-green-600 mb-1" />
            <h2 className="text-2xl font-semibold text-green-600">
              Payment Successful!
            </h2>

            {/* Success Info Box */}
            <div className="bg-green-100 text-gray-700 rounded-lg p-3 mt-3">
              <p className="w-full font-medium mb-2">
                Your subscription has been activated successfully
              </p>
              <p className="text-sm opacity-90">
                You now have access to all premium features
              </p>
            </div>

            {/* Transaction Details Box */}
            <div className="w-full bg-black text-white rounded-md p-4 mt-4 text-left border">
              <p className="font-semibold mb-1">Transaction Details:</p>
              <p className="text-sm break-all">
                <span className="font-medium">Session ID:</span> {sessionId}
              </p>
              <p className="text-sm mt-1">
                <span className="font-medium">Date:</span> {date}
              </p>
            </div>

            {/* CTA Button */}
            <Button
              className="w-full mt-6 bg-green-600 hover:bg-green-700 text-white font-medium rounded-md"
              onClick={onClose}
            >
              Go to Dashboard
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PaymentSuccessModal;
