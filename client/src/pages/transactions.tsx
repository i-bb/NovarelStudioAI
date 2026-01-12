import React, { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import api from "@/lib/api/api";

interface TransactionItem {
  created_at: string;
  plan_name: string;
  amount: string;
  status: string;
}

const Transactions = () => {
  const [transactions, setTransactions] = useState<TransactionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const ITEMS_PER_PAGE = 5;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }).format(date);
  };

  const getTransactionHistory = async (pageNum: number) => {
    try {
      setLoading(true);
      const response = await api.getTransactionHistory(
        String(pageNum),
        String(ITEMS_PER_PAGE)
      );

      setTransactions(response?.transactions || []);
      setPage(response?.current_page || pageNum);
      setTotalPages(response?.total_pages || 1);
      setError("");
    } catch (err) {
      setError("Failed to load transactions. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getTransactionHistory(page);
  }, [page]);

  return (
    <main className="max-w-7xl mx-auto px-4 md:px-8 py-10">
      <h1 className="font-display text-3xl sm:text-4xl font-semibold mb-3">
        Transaction History
      </h1>

      <p className="text-muted-foreground mb-10 max-w-2xl">
        Track all your transactions securely and efficiently.
      </p>

      <div className="dark:bg-neutral-900 rounded-lg shadow-sm border overflow-hidden">
        <div className="px-6 py-4 border-b">
          <h2 className="text-xl font-semibold">All Transactions</h2>
        </div>

        {/* Loader */}
        {loading && (
          <div className="flex justify-center py-10">
            <Loader2 className="animate-spin w-6 h-6 text-muted-foreground" />
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="text-center py-6 text-red-500 font-medium">
            {error}
          </div>
        )}

        {/* CONTENT */}
        {!loading && !error && (
          <>
            {/* 🟣 MOBILE CARD VIEW */}
            <div className="sm:hidden p-4 space-y-4">
              {transactions.length > 0 ? (
                transactions.map((item, index) => (
                  <div
                    key={index}
                    className="rounded-xl border dark:bg-neutral-800 shadow-sm p-4 space-y-2"
                  >
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Date</span>
                      <span className="font-medium">
                        {formatDate(item.created_at)}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Plan</span>
                      <span className="font-medium">{item.plan_name}</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Amount</span>
                      <span className="font-medium">USD {item.amount}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Status</span>
                      <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-800/50 dark:text-emerald-300 px-3 py-1 rounded-full capitalize">
                        {item.status}
                      </Badge>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-muted-foreground py-10">
                  No transactions found.
                </div>
              )}
            </div>

            {/* 🟣 DESKTOP TABLE VIEW */}
            <div className="hidden sm:block relative">
              <table className="w-full text-sm border-collapse">
                <thead className="bg-muted/40 text-muted-foreground">
                  <tr>
                    <th className="text-left p-4 font-medium w-[30%]">Date</th>
                    <th className="text-left p-4 font-medium w-[25%]">Plan</th>
                    <th className="text-left p-4 font-medium w-[25%]">
                      Amount
                    </th>
                    <th className="text-left p-4 font-medium w-[20%]">
                      Status
                    </th>
                  </tr>
                </thead>
              </table>

              <div>
                <table className="w-full text-sm border-collapse">
                  <tbody>
                    {transactions.length > 0 ? (
                      transactions.map((item, index) => (
                        <tr
                          key={index}
                          className="border-t hover:bg-muted/30 transition-colors"
                        >
                          <td className="p-4 w-[30%]">
                            {formatDate(item.created_at)}
                          </td>
                          <td className="p-4 w-[25%]">{item.plan_name}</td>
                          <td className="p-4 w-[25%]">USD {item.amount}</td>
                          <td className="p-4 w-[20%]">
                            <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-800/50 dark:text-emerald-300 px-3 py-1 rounded-full capitalize">
                              {item.status}
                            </Badge>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={4}
                          className="text-center text-muted-foreground py-10"
                        >
                          No transactions found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 px-4 py-3 border-t">
                <button
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                  className={`text-sm font-medium transition ${
                    page === 1
                      ? "text-muted-foreground opacity-50 cursor-not-allowed"
                      : "text-white hover:text-purple-400"
                  }`}
                >
                  Previous
                </button>

                <div className="flex items-center gap-4">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (num) => (
                      <button
                        key={num}
                        onClick={() => setPage(num)}
                        className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium transition
                          ${
                            page === num
                              ? "bg-purple-600 text-white shadow"
                              : "text-white/80 hover:text-white"
                          }`}
                      >
                        {num}
                      </button>
                    )
                  )}
                </div>

                <button
                  disabled={page === totalPages}
                  onClick={() => setPage(page + 1)}
                  className={`text-sm font-medium transition ${
                    page === totalPages
                      ? "text-muted-foreground opacity-50 cursor-not-allowed"
                      : "text-white hover:text-purple-400"
                  }`}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
};

export default Transactions;
