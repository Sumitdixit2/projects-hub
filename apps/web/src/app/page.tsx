'use client';
import { useRouter } from "next/navigation";

export default async function Home() {
  const router = useRouter();
  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col bg-white group/design-root overflow-x-hidden" style={{ fontFamily: 'Inter, "Noto Sans", sans-serif' }}>
      <div className="layout-container flex h-full grow flex-col">
        <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#f0f2f4] px-10 py-3">
          <div className="flex items-center gap-4 text-[#111417]">
            <div className="size-4">
              <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <g clipPath="url(#clip0_6_319)">
                  <path d="M8.57829 8.57829C5.52816 11.6284 3.451 15.5145 2.60947 19.7452C1.76794 23.9758 2.19984 28.361 3.85056 32.3462C5.50128 36.3314 8.29667 39.7376 11.8832 42.134C15.4698 44.5305 19.6865 45.8096 24 45.8096C28.3135 45.8096 32.5302 44.5305 36.1168 42.134C39.7033 39.7375 42.4987 36.3314 44.1494 32.3462C45.8002 28.361 46.2321 23.9758 45.3905 19.7452C44.549 15.5145 42.4718 11.6284 39.4217 8.57829L24 24L8.57829 8.57829Z" fill="currentColor"></path>
                </g>
                <defs>
                  <clipPath id="clip0_6_319"><rect fill="white" height="48" width="48"></rect></clipPath>
                </defs>
              </svg>
            </div>
            <h2 className="text-[#111417] text-lg font-bold leading-tight tracking-[-0.015em]">Project Hub</h2>
          </div>
          <div className="flex flex-1 justify-end gap-8">
            <div className="flex items-center gap-9">
              <a className="text-[#111417] text-sm font-medium leading-normal" href="#">About</a>
              <a className="text-[#111417] text-sm font-medium leading-normal" href="#">Contact</a>
            </div>
            <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-[#2080df] text-white text-sm font-bold leading-normal tracking-[0.015em]">
              <span className="truncate">Log In</span>
            </button>
          </div>
        </header>
        <div className="px-10 flex flex-1 items-center justify-center py-5">
          <div className="layout-content-container flex flex-col w-full max-w-[600px] py-10 items-center">
            <h1 className="text-[#111417] tracking-light text-[32px] font-bold leading-tight text-center pb-3">Welcome to Project Hub</h1>
            <p className="text-[#111417] text-lg font-normal leading-normal pb-8 text-center">
              Streamline project management and communication between our agency and your team. Access your dashboards, project updates, and collaboration tools in one central place.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 w-full justify-center px-4">
              <button type="button" onClick={() => router.push('/loginAs')} className="flex min-w-[160px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-6 bg-[#2080df] text-white text-base font-bold leading-normal tracking-[0.015em]">
                <span className="truncate">Log In</span>
              </button>
              <button type="button" onClick={() => router.push('/registerAs')} className="flex min-w-[160px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-6 border border-[#dce0e5] bg-white text-[#111417] text-base font-bold leading-normal tracking-[0.015em]">
                <span className="truncate">Sign Up</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
