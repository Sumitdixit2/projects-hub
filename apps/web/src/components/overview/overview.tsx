import { projectService } from "@/services/project.service";
import { useState, useEffect } from "react";
import { toast } from "sonner";

export default function Overview() {
  const [project, setProject] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await projectService.getAllProjects();
        console.log("project data is :", response.data);
        setProject(Array.isArray(response.data) ? response.data : []);
        toast.success(response?.message || "all Projects fetched");
      } catch {
        setProject([]);
      }
    }
    fetchProjects();
  }, []);

  console.log("projects are : ", project);

  return (
    <>
      <div className="flex flex-wrap justify-between gap-3 p-4"><p className="text-[#0e141b] tracking-light text-[32px] font-bold leading-tight min-w-72">Overview</p></div>
      <div className="flex flex-wrap gap-4 p-4">
        <div className="flex min-w-[158px] flex-1 flex-col gap-2 rounded-lg p-6 border border-[#d0dbe7]">
          <p className="text-[#0e141b] text-base font-medium leading-normal">Active Projects</p>
          <p className="text-[#0e141b] tracking-light text-2xl font-bold leading-tight">12</p>
        </div>
        <div className="flex min-w-[158px] flex-1 flex-col gap-2 rounded-lg p-6 border border-[#d0dbe7]">
          <p className="text-[#0e141b] text-base font-medium leading-normal">Completed Projects</p>
          <p className="text-[#0e141b] tracking-light text-2xl font-bold leading-tight">35</p>
        </div>
        <div className="flex min-w-[158px] flex-1 flex-col gap-2 rounded-lg p-6 border border-[#d0dbe7]">
          <p className="text-[#0e141b] text-base font-medium leading-normal">Total Clients</p>
          <p className="text-[#0e141b] tracking-light text-2xl font-bold leading-tight">8</p>
        </div>
      </div>
    </>
  );
}
