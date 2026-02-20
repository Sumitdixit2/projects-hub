"use client";
import Overview from "@/components/overview/overview";
import Sidebar from "@/components/layout/sidebar";

export default function DashboardPage() {
  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col bg-slate-50 group/design-root overflow-x-hidden" style={{ fontFamily: 'Inter, "Noto Sans", sans-serif' }}>
      <div className="layout-container flex h-full grow flex-col">
        <div className="gap-1 px-6 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col w-80">
            <div className="flex h-full min-h-[700px] flex-col justify-between bg-slate-50 p-4">
            <Sidebar role="admin" />
                          </div>
          </div>
          <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
            <Overview />
            <h2 className="text-[#0e141b] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">Projects by Status</h2>
            <div className="flex flex-wrap gap-4 px-4 py-6">
              <div className="flex min-w-72 flex-1 flex-col gap-2">
                <p className="text-[#0e141b] text-base font-medium leading-normal">Project Status</p>
                <div className="grid min-h-[180px] gap-x-4 gap-y-6 grid-cols-[auto_1fr] items-center py-3">
                  <p className="text-[#4e7397] text-[13px] font-bold leading-normal tracking-[0.015em]">In Progress</p>
                  <div className="h-full flex-1"><div className="border-[#4e7397] bg-[#e7edf3] border-r-2 h-full" style={{ width: "60%" }}></div></div>
                  <p className="text-[#4e7397] text-[13px] font-bold leading-normal tracking-[0.015em]">Completed</p>
                  <div className="h-full flex-1"><div className="border-[#4e7397] bg-[#e7edf3] border-r-2 h-full" style={{ width: "20%" }}></div></div>
                  <p className="text-[#4e7397] text-[13px] font-bold leading-normal tracking-[0.015em]">On Hold</p>
                  <div className="h-full flex-1"><div className="border-[#4e7397] bg-[#e7edf3] border-r-2 h-full" style={{ width: "60%" }}></div></div>
                  <p className="text-[#4e7397] text-[13px] font-bold leading-normal tracking-[0.015em]">Planning</p>
                  <div className="h-full flex-1"><div className="border-[#4e7397] bg-[#e7edf3] border-r-2 h-full" style={{ width: "80%" }}></div></div>
                </div>
              </div>
            </div>
            <h2 className="text-[#0e141b] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">Recent Activity</h2>
            <div className="grid grid-cols-[40px_1fr] gap-x-2 px-4">
              <div className="flex flex-col items-center gap-1 pt-3">
                <div className="text-[#0e141b]" data-icon="Folder" data-size="24px" data-weight="regular">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                    <path
                      d="M216,72H131.31L104,44.69A15.86,15.86,0,0,0,92.69,40H40A16,16,0,0,0,24,56V200.62A15.4,15.4,0,0,0,39.38,216H216.89A15.13,15.13,0,0,0,232,200.89V88A16,16,0,0,0,216,72ZM40,56H92.69l16,16H40ZM216,200H40V88H216Z"
                    ></path>
                  </svg>
                </div>
                <div className="w-[1.5px] bg-[#d0dbe7] h-2 grow"></div>
              </div>
              <div className="flex flex-1 flex-col py-3">
                <p className="text-[#0e141b] text-base font-medium leading-normal">Project 'Website Redesign' started</p>
                <p className="text-[#4e7397] text-base font-normal leading-normal">2 hours ago</p>
              </div>
              <div className="flex flex-col items-center gap-1">
                <div className="w-[1.5px] bg-[#d0dbe7] h-2"></div>
                <div className="text-[#0e141b]" data-icon="UserPlus" data-size="24px" data-weight="regular">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                    <path
                      d="M256,136a8,8,0,0,1-8,8H232v16a8,8,0,0,1-16,0V144H200a8,8,0,0,1,0-16h16V112a8,8,0,0,1,16,0v16h16A8,8,0,0,1,256,136Zm-57.87,58.85a8,8,0,0,1-12.26,10.3C165.75,181.19,138.09,168,108,168s-57.75,13.19-77.87,37.15a8,8,0,0,1-12.25-10.3c14.94-17.78,33.52-30.41,54.17-37.17a68,68,0,1,1,71.9,0C164.6,164.44,183.18,177.07,198.13,194.85ZM108,152a52,52,0,1,0-52-52A52.06,52.06,0,0,0,108,152Z"
                    ></path>
                  </svg>
                </div>
                <div className="w-[1.5px] bg-[#d0dbe7] h-2 grow"></div>
              </div>
              <div className="flex flex-1 flex-col py-3">
                <p className="text-[#0e141b] text-base font-medium leading-normal">Client 'Tech Solutions Inc.' added</p>
                <p className="text-[#4e7397] text-base font-normal leading-normal">4 hours ago</p>
              </div>
              <div className="flex flex-col items-center gap-1">
                <div className="w-[1.5px] bg-[#d0dbe7] h-2"></div>
                <div className="text-[#0e141b]" data-icon="CheckCircle" data-size="24px" data-weight="regular">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                    <path
                      d="M173.66,98.34a8,8,0,0,1,0,11.32l-56,56a8,8,0,0,1-11.32,0l-24-24a8,8,0,0,1,11.32-11.32L112,148.69l50.34-50.35A8,8,0,0,1,173.66,98.34ZM232,128A104,104,0,1,1,128,24,104.11,104.11,0,0,1,232,128Zm-16,0a88,88,0,1,0-88,88A88.1,88.1,0,0,0,216,128Z"
                    ></path>
                  </svg>
                </div>
                <div className="w-[1.5px] bg-[#d0dbe7] h-2 grow"></div>
              </div>
              <div className="flex flex-1 flex-col py-3">
                <p className="text-[#0e141b] text-base font-medium leading-normal">Project 'Mobile App Development' completed</p>
                <p className="text-[#4e7397] text-base font-normal leading-normal">1 day ago</p>
              </div>
              <div className="flex flex-col items-center gap-1">
                <div className="w-[1.5px] bg-[#d0dbe7] h-2"></div>
                <div className="text-[#0e141b]" data-icon="Envelope" data-size="24px" data-weight="regular">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                    <path
                      d="M224,48H32a8,8,0,0,0-8,8V192a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A8,8,0,0,0,224,48Zm-96,85.15L52.57,64H203.43ZM98.71,128,40,181.81V74.19Zm11.84,10.85,12,11.05a8,8,0,0,0,10.82,0l12-11.05,58,53.15H52.57ZM157.29,128,216,74.18V181.82Z"
                    ></path>
                  </svg>
                </div>
                <div className="w-[1.5px] bg-[#d0dbe7] h-2 grow"></div>
              </div>
              <div className="flex flex-1 flex-col py-3">
                <p className="text-[#0e141b] text-base font-medium leading-normal">Message sent to client 'Global Corp'</p>
                <p className="text-[#4e7397] text-base font-normal leading-normal">2 days ago</p>
              </div>
              <div className="flex flex-col items-center gap-1 pb-3">
                <div className="w-[1.5px] bg-[#d0dbe7] h-2"></div>
                <div className="text-[#0e141b]" data-icon="UserPlus" data-size="24px" data-weight="regular">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                    <path
                      d="M256,136a8,8,0,0,1-8,8H232v16a8,8,0,0,1-16,0V144H200a8,8,0,0,1,0-16h16V112a8,8,0,0,1,16,0v16h16A8,8,0,0,1,256,136Zm-57.87,58.85a8,8,0,0,1-12.26,10.3C165.75,181.19,138.09,168,108,168s-57.75,13.19-77.87,37.15a8,8,0,0,1-12.25-10.3c14.94-17.78,33.52-30.41,54.17-37.17a68,68,0,1,1,71.9,0C164.6,164.44,183.18,177.07,198.13,194.85ZM108,152a52,52,0,1,0-52-52A52.06,52.06,0,0,0,108,152Z"
                    ></path>
                  </svg>
                </div>
              </div>
              <div className="flex flex-1 flex-col py-3">
                <p className="text-[#0e141b] text-base font-medium leading-normal">New user 'Sarah' joined</p>
                <p className="text-[#4e7397] text-base font-normal leading-normal">3 days ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
