"use client";

import React, { useEffect, useState } from "react";
import {
  Briefcase,
  Key,
  User2,
  Milestone,
  ListTodo,
  Users,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  activityInputType,
  activityOutputType,
  entityType,
} from "@/types/activity.type";
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
          page: String(currentPage), // cleaner
        };

        const response = await activityService.getAgencyActivity(input);

        setActivities(Array.isArray(response?.data) ? response.data : []);
      } catch (error) {
        console.error("Failed to fetch activity logs", error);
        setActivities([]); // prevent stale UI
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, [currentPage]);

  const getActivityIcon = (type: entityType) => {
    switch (type) {
      case entityType.Project:
        return <Briefcase size={20} />;
      case entityType.Key:
        return <Key size={20} />;
      case entityType.Admin:
        return <Users size={20} />;
      case entityType.Client:
        return <User2 size={20} />;
      case entityType.Milestone:
        return <Milestone size={20} />;
      default:
        return <ListTodo size={20} />;
    }
  };

  return (
    <div className="flex flex-col max-w-[960px] w-full mx-auto">
      {/* Header */}
      <div className="flex justify-between p-4">
        <p className="text-[32px] font-bold text-[#0e141b]">
          Activity Log
        </p>
      </div>

      {/* Activity List */}
      <div className="grid grid-cols-[40px_1fr] gap-x-2 px-4">
        {loading ? (
          <p className="p-4 text-slate-500">Loading activities...</p>
        ) : activities.length === 0 ? (
          <p className="p-4 text-slate-500">No activity found</p>
        ) : (
          activities.map((activity, index) => (
            <React.Fragment key={activity.id}>
              {/* Timeline Icon */}
              <div className="flex flex-col items-center gap-1 pt-3">
                <div className="text-[#0e141b]">
                  {getActivityIcon(activity.entity_type)}
                </div>

                {index !== activities.length - 1 && (
                  <div className="w-[1.5px] bg-[#d0dbe7] flex-1" />
                )}
              </div>

              {/* Activity Content */}
              <div className="flex flex-col py-3">
                <p className="text-base font-medium text-[#0e141b]">
                  {activity.action}
                </p>

                <p className="text-sm text-[#4e7397]">
                  {activity.name || "System"} •{" "}
                  {activity.created_at
                    ? new Date(activity.created_at).toLocaleString()
                    : "Unknown time"}
                </p>
              </div>
            </React.Fragment>
          ))
        )}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-center gap-2 p-4 mt-auto">
        <Button
          variant="secondary"
          onClick={() =>
            setCurrentPage((prev) => Math.max(prev - 1, 1))
          }
          disabled={currentPage === 1}
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Previous
        </Button>

        <div className="flex items-center gap-1">
          {[1, 2, 3].map((num) => (
            <button
              key={num}
              onClick={() => setCurrentPage(num)}
              className={`size-10 rounded-lg text-sm font-bold ${
                currentPage === num
                  ? "bg-[#0e141b] text-white"
                  : "bg-[#e7edf3] text-[#0e141b]"
              }`}
            >
              {num}
            </button>
          ))}
          <span className="px-2 text-[#0e141b]">...</span>
        </div>

        <Button
          variant="secondary"
          onClick={() => setCurrentPage((prev) => prev + 1)}
        >
          Next
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
