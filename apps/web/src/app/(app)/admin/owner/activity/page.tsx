"use client";

import React, { useEffect, useState } from "react";
import { 
  Briefcase, 
  Mail, 
  Key,
  User2,
  Milestone,
  ListTodo, 
  Users, 
  ChevronLeft, 
  ChevronRight 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { activityInputType, activityOutputType, entityType } from "@/types/activity.type"; //
import { activityService } from "@/services/activity.service";

export default function ActivityPage() {
  const [activities, setActivities] = useState<activityOutputType[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        setLoading(true);

        const input: activityInputType = {
          limit: "10",
          page: `${currentPage}`
        }

        const response = await activityService.getAgencyActivity(input);

        setActivities(Array.isArray(response?.data) ? response.data : []);

      } catch (error) {
        console.error("Failed to fetch activity logs", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, [currentPage]);

  const getActivityIcon = (type: entityType) => {
    switch (type) {
      case entityType.Project: return <Briefcase size={24} />;
      case entityType.Key: return <Key size={24} />;
      case entityType.Admin: return <Users size={24} />;
      case entityType.Client: return <User2 size={24} />;
      case entityType.Milestone: return <Milestone size={24} />;
      default: return <ListTodo size={24} />;
    }
  };

  return (
    <div className="flex flex-col max-w-[960px] flex-1">
      <div className="flex flex-wrap justify-between gap-3 p-4">
        <p className="text-[#0e141b] tracking-tight text-[32px] font-bold leading-tight min-w-72">
          Activity Log
        </p>
      </div>

      <div className="grid grid-cols-[40px_1fr] gap-x-2 px-4">
        {loading ? (
          <p className="p-4 text-slate-500">Loading activities...</p>
        ) : (
          activities.map((activity, index) => (
            <React.Fragment key={activity.id}>
              <div className="flex flex-col items-center gap-1 pt-3">
                <div className="text-[#0e141b]">
                  {getActivityIcon(activity.entity_type)}
                </div>
                {index !== activities.length - 1 && (
                  <div className="w-[1.5px] bg-[#d0dbe7] h-2 grow"></div>
                )}
              </div>
              <div className="flex flex-1 flex-col py-3">
                <p className="text-[#0e141b] text-base font-medium leading-normal">
                  {activity.action}
                </p>
                <p className="text-[#4e7397] text-base font-normal leading-normal">
                  {activity.name || "System"} • {new Date(activity.created_at).toLocaleString()}
                </p>
              </div>
            </React.Fragment>
          ))
        )}
      </div>

      <div className="flex items-center justify-center gap-2 p-4 mt-auto">
        <Button
          variant="secondary"
          className="bg-[#e7edf3] text-[#0e141b]"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          <ChevronLeft className="mr-2 h-4 w-4" /> Previous
        </Button>
        
        <div className="flex items-center gap-1">
          {[1, 2, 3].map((num) => (
            <button
              key={num}
              onClick={() => setCurrentPage(num)}
              className={`flex size-10 items-center justify-center rounded-lg text-sm font-bold ${
                currentPage === num 
                  ? "bg-[#0e141b] text-white" 
                  : "bg-[#e7edf3] text-[#0e141b]"
              }`}
            >
              {num}
            </button>
          ))}
          <span className="text-[#0e141b] px-2">...</span>
        </div>

        <Button
          variant="secondary"
          className="bg-[#e7edf3] text-[#0e141b]"
          onClick={() => setCurrentPage((prev) => prev + 1)}
        >
          Next <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
