"use client";

import React from "react";
import { Clock, ExternalLink } from "lucide-react";

import { supabase } from "@/lib/supabase/client";

interface AdminActivityProps {
  onViewAll?: () => void;
}

function getRelativeTime(dateString: string): string {
  try {
    const now = new Date();
    const past = new Date(dateString);
    const diffMs = now.getTime() - past.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHours = Math.floor(diffMin / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffSec < 60) return "Baru saja";
    if (diffMin < 60) return `${diffMin}m lalu`;
    if (diffHours < 24) return `${diffHours}j lalu`;
    if (diffDays < 7) return `${diffDays}h lalu`;
    return past.toLocaleDateString("id-ID", { day: "numeric", month: "short" });
  } catch {
    return "Baru saja";
  }
}

export default function AdminActivity({ onViewAll }: AdminActivityProps) {
  const [activities, setActivities] = React.useState<
    {
      id: string;
      dotColor: string;
      time: string;
      title: string;
      user: string | null;
    }[]
  >([]);

  const loadLogs = async () => {
    try {
      const res = await fetch("/api/admin/logs?limit=4");
      const json = await res.json();
      if (json.success && json.data && json.data.length > 0) {
        const formatted = json.data.map((log: any) => {
          const timeAgo = getRelativeTime(log.created_at || new Date().toISOString());

          let dotColor = "bg-amber-400 shadow-[0_0_8px_#f59e0b]";
          if (log.type === "order") dotColor = "bg-amber-400 shadow-[0_0_8px_#f59e0b]";
          else if (log.type === "processing") dotColor = "bg-blue-500 shadow-[0_0_8px_#3b82f6]";
          else if (log.type === "success") dotColor = "bg-emerald-400 shadow-[0_0_8px_#10b981]";
          else if (log.type === "cancelled" || log.type === "blacklist")
            dotColor = "bg-red-500 shadow-[0_0_8px_#ef4444]";
          else if (log.type === "review")
            dotColor = "bg-purple-400 shadow-[0_0_8px_#a855f7]";
          else if (log.type === "product" || log.type === "system")
            dotColor = "bg-cyan-400 shadow-[0_0_8px_#06b6d4]";

          return {
            id: String(log.id),
            dotColor,
            time: timeAgo,
            title: log.details || log.action,
            user: log.user_target || null,
          };
        });
        setActivities(formatted);
      } else {
        setActivities([
          {
            id: "1",
            dotColor: "bg-emerald-400 shadow-[0_0_8px_#10b981]",
            time: "Baru saja",
            title: "Sistem log audit realtime aktif",
            user: "Admin",
          },
        ]);
      }
    } catch (err) {
      console.warn("Failed to fetch logs:", err);
    }
  };

  React.useEffect(() => {
    loadLogs();

    // Realtime Supabase Subscription on activity_logs
    const channel = supabase
      .channel("admin-activity-logs-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "activity_logs" },
        () => {
          loadLogs();
        }
      )
      .subscribe();

    const handleCustomUpdate = () => {
      loadLogs();
    };

    window.addEventListener("champion-orders-updated", handleCustomUpdate);
    window.addEventListener("focus", handleCustomUpdate);
    const interval = setInterval(loadLogs, 3500);

    return () => {
      supabase.removeChannel(channel);
      window.removeEventListener("champion-orders-updated", handleCustomUpdate);
      window.removeEventListener("focus", handleCustomUpdate);
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="rounded-3xl bg-[#0B0F19] border border-slate-800/80 p-4 sm:p-4.5 flex flex-col justify-between shadow-lg h-full">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-2.5 border-b border-slate-800/60 mb-2.5">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-red-950/50 border border-red-800/50 flex items-center justify-center text-red-400">
              <Clock className="w-3.5 h-3.5" />
            </div>
            <h3 className="font-bold text-xs sm:text-sm text-white tracking-wide">
              Aktivitas Terbaru
            </h3>
          </div>
          <span className="text-[9px] font-semibold text-slate-400 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">
            Realtime
          </span>
        </div>

        {/* Timeline List */}
        <div className="space-y-2.5 relative before:absolute before:left-[5px] before:top-1.5 before:bottom-1.5 before:w-[2px] before:bg-slate-800/80 pl-5">
          {activities.map((act) => (
            <div key={act.id} className="relative group">
              {/* Indicator dot */}
              <div
                className={`absolute -left-[19px] top-1 w-2.5 h-2.5 rounded-full ${act.dotColor} ring-4 ring-[#0B0F19] transition-transform group-hover:scale-125`}
              />

              <div className="leading-tight">
                <span className="text-[10px] font-semibold text-slate-400 block mb-0.5">
                  {act.time}
                </span>
                <p className="text-[11px] font-semibold text-slate-200 group-hover:text-white transition-colors leading-snug">
                  {act.title}
                </p>
                {act.user && (
                  <p className="text-[10px] text-red-400 font-medium mt-0.5">
                    @{act.user}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Button */}
      <div className="pt-3 mt-3 border-t border-slate-800/60">
        <button
          onClick={onViewAll}
          className="w-full py-2 px-3 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-[11px] font-bold text-slate-300 hover:text-white transition-all flex items-center justify-center gap-1.5 active:scale-98 shadow-sm cursor-pointer"
        >
          <span>Lihat Semua Aktivitas</span>
          <ExternalLink className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
}
