"use client";

import React, { useEffect, useState } from "react";
import { 
  Briefcase, 
  Mail, 
  ListTodo, 
  Users, 
  ChevronLeft, 
  ChevronRight 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { activityService } from "@/services/activity.service"; //
import { activityOutputType } from "@/types/activity.type"; //

export default function ActivityPage() {
  const [activities, setActivities] = useState<activityOutputType[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  // useEffect(() => {
  //   const fetchLogs = async () => {
  //     try {
  //       setLoading(true);
  //       const response = await activityService.getAllActivities(currentPage);
  //       setActivities(response.data);
  //     } catch (error) {
  //       console.error("Failed to fetch activity logs", error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };
  //   fetchLogs();
  // }, [currentPage]);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "project": return <Briefcase size={24} />;
      case "message": return <Mail size={24} />;
      case "task": return <ListTodo size={24} />;
      case "client": return <Users size={24} />;
      default: return <ListTodo size={24} />;
    }
  };

  return (
    <div className="flex flex-col max-w-[960px] flex-1">
      {/* Header */}
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
                  {getActivityIcon(activity.type)}
                </div>
                {/* Visual connector line */}
                {index !== activities.length - 1 && (
                  <div className="w-[1.5px] bg-[#d0dbe7] h-2 grow"></div>
                )}
              </div>
              <div className="flex flex-1 flex-col py-3">
                <p className="text-[#0e141b] text-base font-medium leading-normal">
                  {activity.description}
                </p>
                <p className="text-[#4e7397] text-base font-normal leading-normal">
                  {activity.user?.name || "System"} • {new Date(activity.createdAt).toLocaleString()}
                </p>
              </div>
            </React.Fragment>
          ))
        )}
      </div>

      {/* Pagination Controls */}
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
