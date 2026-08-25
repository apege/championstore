"use client";

import React from "react";
import { Clock, ExternalLink } from "lucide-react";

interface AdminActivityProps {
  onViewAll?: () => void;
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

  React.useEffect(() => {
    async function loadLogs() {
      try {
        const res = await fetch("/api/admin/logs?limit=4");
        const json = await res.json();
        if (json.success && json.data && json.data.length > 0) {
          const formatted = json.data.map((log: any) => {
            const timeAgo = new Date(log.created_at || Date.now()).toLocaleTimeString("id-ID", {
              hour: "2-digit",
              minute: "2-digit",
            });
            let dotColor = "bg-red-500 shadow-[0_0_8px_#ef4444]";
            if (log.type === "status") dotColor = "bg-blue-500 shadow-[0_0_8px_#3b82f6]";
            if (log.type === "product") dotColor = "bg-cyan-400 shadow-[0_0_8px_#22d3ee]";
            if (log.type === "system") dotColor = "bg-emerald-400 shadow-[0_0_8px_#10b981]";

            return {
              id: log.id,
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
              title: "Backend Supabase terhubung ke sistem",
              user: "Admin",
            },
          ]);
        }
      } catch (err) {
        console.warn("Failed to fetch logs:", err);
      }
    }
    loadLogs();
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
