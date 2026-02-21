import Sidebar from "@/components/layout/sidebar";

export default function AddProjectPage() {

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-slate-50 overflow-x-hidden font-sans">
      <div className="flex flex-1 justify-center px-6 py-5 gap-1">

        <Sidebar role="admin" />
        <div className="flex flex-1 max-w-[960px] flex-col">

          <div className="p-4">
            <h1 className="text-[32px] font-bold text-[#0e141b]">
              Add New Project
            </h1>
          </div>

          <div className="space-y-4 px-4">

            <InputField label="Project Name" placeholder="Enter project name" />

            <SelectField label="Client">
              <option>Select client</option>
              <option>Client One</option>
              <option>Client Two</option>
            </SelectField>

            <SelectField label="Initial Status">
              <option>Select status</option>
              <option>Not Started</option>
              <option>In Progress</option>
              <option>Completed</option>
            </SelectField>

            <h3 className="text-lg font-bold pt-6">
              Initial Milestones
            </h3>

            <InputField label="Milestone 1" placeholder="Enter milestone name" />
            <InputField label="Milestone 2" placeholder="Enter milestone name" />
            <InputField label="Milestone 3" placeholder="Enter milestone name" />

            <div className="flex justify-end pt-4">
              <button className="h-10 rounded-lg bg-[#1980e6] px-4 text-sm font-bold text-white">
                Add Project
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

function NavItem({ label, active = false }: { label: string; active?: boolean }) {
  return (
    <div
      className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium cursor-pointer ${active ? "bg-[#e7edf3]" : ""
        }`}
    >
      <span className="text-[#0e141b]">{label}</span>
    </div>
  );
}

function InputField({
  label,
  placeholder,
}: {
  label: string;
  placeholder: string;
}) {
  return (
    <label className="flex flex-col max-w-[480px]">
      <p className="pb-2 text-base font-medium text-[#0e141b]">
        {label}
      </p>
      <input
        placeholder={placeholder}
        className="h-14 rounded-lg border border-[#d0dbe7] bg-slate-50 p-[15px] text-base text-[#0e141b] placeholder:text-[#4e7397] focus:outline-none"
      />
    </label>
  );
}

function SelectField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col max-w-[480px]">
      <p className="pb-2 text-base font-medium text-[#0e141b]">
        {label}
      </p>
      <select
        className="h-14 rounded-lg border border-[#d0dbe7] bg-slate-50 p-[15px] text-base text-[#0e141b] focus:outline-none"
      >
        {children}
      </select>
    </label>
  );
}
