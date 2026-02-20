"use client";
import { useRouter } from "next/navigation";

const projects = [
    {
        id: 1,
        name: "Website Redesign",
        client: "Global Corp",
        agency: "My Agency",
        status: "In Progress",
        dueDate: "Dec 31, 2024",
    },
    {
        id: 2,
        name: "Mobile App Development",
        client: "Tech Solutions",
        agency: "My Agency",
        status: "Completed",
        dueDate: "Nov 15, 2024",
    },
    {
        id: 3,
        name: "Logo Design",
        client: "Startup Hub",
        agency: "Creative Inc",
        status: "Pending",
        dueDate: "Jan 10, 2025",
    },
];

export default function AdminProjectsPage() {
  const router = useRouter();
    return (
        <div className="flex flex-col gap-4 p-4">
            <div className="flex justify-between items-center pb-4">
                <h1 className="text-[#0e141b] text-[32px] font-bold leading-tight">
                    All Projects
                </h1>
                <button onClick={() => router.push('/admin/owner/createProject')} className="bg-[#0e141b] text-white px-4 py-2 rounded-lg font-medium hover:bg-[#0e141b]/90 transition-colors">
                    Create Project
                </button>
            </div>

            <div className="overflow-x-auto bg-white rounded-xl border border-[#d0dbe7]">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-[#e7edf3] text-[#4e7397] text-sm font-medium uppercase tracking-wider">
                            <th className="p-4 rounded-tl-xl">Project Name</th>
                            <th className="p-4">Client</th>
                            <th className="p-4">Assigned To</th>
                            <th className="p-4">Status</th>
                            <th className="p-4">Due Date</th>
                            <th className="p-4 rounded-tr-xl">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="text-[#0e141b] text-sm">
                        {projects.map((project) => (
                            <tr
                                key={project.id}
                                className="border-t border-[#d0dbe7] hover:bg-slate-50 transition-colors"
                            >
                                <td className="p-4 font-medium">{project.name}</td>
                                <td className="p-4">{project.client}</td>
                                <td className="p-4">{project.agency}</td>
                                <td className="p-4">
                                    <span
                                        className={`px-2 py-1 rounded-full text-xs font-bold ${project.status === "In Progress"
                                                ? "bg-blue-100 text-blue-700"
                                                : project.status === "Completed"
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-gray-100 text-gray-700"
                                            }`}
                                    >
                                        {project.status}
                                    </span>
                                </td>
                                <td className="p-4">{project.dueDate}</td>
                                <td className="p-4">
                                    <button className="text-[#4e7397] hover:text-[#0e141b] font-medium transition-colors">
                                        Edit
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
