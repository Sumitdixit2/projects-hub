'use client';

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <div className="bg-[#000000] text-white min-h-screen flex flex-col overflow-x-hidden selection:bg-[#E84C2F] selection:text-white" style={{ fontFamily: "'Inter', sans-serif" }}>
      
      {/* Background Starfield */}
      <div aria-hidden="true" className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="stars-small absolute inset-0"></div>
      </div>

      {/* Navigation Header */}
      <header className="fixed top-6 left-1/2 -translate-x-1/2 w-[90%] max-w-[1200px] rounded-full z-50 bg-black/80 backdrop-blur-xl border border-white/10 shadow-2xl">
        <div className="flex justify-between items-center px-8 h-16">
          <div className="flex items-center gap-12">
            <div className="text-2xl font-black tracking-tighter uppercase" style={{ fontFamily: "'Poppins', sans-serif" }}>
              AETHER
            </div>
                      </div>
          <div className="flex items-center gap-6">
            <button 
              onClick={() => router.push('/loginAs')} 
              className="text-sm font-medium text-zinc-400 hover:text-white transition-colors"
            >
              Sign In
            </button>
            <button 
              onClick={() => router.push('/registerAs')}
              className="bg-white hover:bg-zinc-200 text-black text-sm px-5 py-2 rounded-full transition-colors font-bold"
            >
              Get Started
            </button>
          </div>
        </div>
      </header>

      <main className="flex-grow relative z-10">
        {/* Hero Section */}
        <section className="relative min-h-screen flex flex-col items-center justify-start pt-48 pb-24 hero-gradient grid-bg">
          {/* Animated Icons */}
          <div className="absolute top-1/3 left-[15%] animate-bounce hidden lg:block" style={{ animationDuration: '4s' }}>
            <span className="material-symbols-outlined text-[#E84C2F] text-3xl transform -rotate-45">send</span>
          </div>

          <div className="relative w-full max-w-4xl mx-auto px-6 text-center">
            
            <h1 className="text-5xl md:text-7xl leading-[1.1] mb-6 tracking-tight font-bold" style={{ fontFamily: "'Poppins', sans-serif" }}>
              One platform built for<br/>agency growth
            </h1>
            <p className="text-lg md:text-xl text-zinc-400 mb-12 max-w-2xl mx-auto leading-relaxed">
              Everything you need to run and scale your agency, unified into one seamless system that improves team productivity.
            </p>

                      </div>

          {/* Dashboard Preview */}
          <div className="relative w-full max-w-[1100px] mx-auto mt-24 px-6">
            <div className="rounded-2xl overflow-hidden glass-panel border-t-2 border-t-[rgba(232,76,47,0.8)] !border-t-[rgba(232,76,47,0.8)] shadow-2xl transition-transform hover:scale-[1.01] duration-500">
              <div className="bg-white text-black p-4 flex items-center border-b border-zinc-200 justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-[#E84C2F] rounded-lg flex items-center justify-center">
                    <span className="material-symbols-outlined text-white text-sm">layers</span>
                  </div>
                  <span className="font-bold text-sm">AETHER HUB</span>
                </div>
                <div className="flex-grow max-w-md mx-8">
                  <div className="bg-zinc-100 rounded-md py-1.5 px-4 text-xs text-zinc-400">Search with AI...</div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="material-symbols-outlined text-zinc-400">notifications</span>
                  <div className="w-8 h-8 rounded-full bg-zinc-300"></div>
                </div>
              </div>
              <div className="bg-[#F8F9FA] h-[300px] flex items-center justify-center">
                <div className="text-zinc-300 text-center">
                  <span className="material-symbols-outlined text-6xl mb-4">monitoring</span>
                  <p className="text-zinc-500 font-medium">Predictive Analytics Engine Loading...</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 px-6 bg-[#000000]">
          <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-[#1A1A1A] p-8 rounded-2xl border border-white/5 hover:border-[#E84C2F]/50 transition-colors group">
              <div className="w-12 h-12 rounded-xl bg-black flex items-center justify-center mb-6 border border-white/10 group-hover:border-[#E84C2F]">
                <span className="material-symbols-outlined text-[#E84C2F]">hub</span>
              </div>
              <h3 className="text-xl font-bold mb-3">Client Ecosystem</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Construct and maintain robust client networks. Advanced relationship mapping ensures zero structural degradation.
              </p>
            </div>

            <div className="bg-[#1A1A1A] p-8 rounded-2xl border border-white/5 hover:border-[#E84C2F]/50 transition-colors group">
              <div className="w-12 h-12 rounded-xl bg-black flex items-center justify-center mb-6 border border-white/10 group-hover:border-[#E84C2F]">
                <span className="material-symbols-outlined text-[#E84C2F]">hub</span>
              </div>
              <h3 className="text-xl font-bold mb-3">Client Ecosystem</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Construct and maintain robust client networks. Advanced relationship mapping ensures zero structural degradation.
              </p>
            </div>

            {/* Add more features as needed */}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-black w-full py-12 border-t border-zinc-900">
        <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row justify-between items-center px-8 gap-6">
          <div className="text-xl font-black uppercase" style={{ fontFamily: "'Poppins', sans-serif" }}>AETHER</div>
          <div className="text-[10px] tracking-[0.2em] uppercase text-zinc-500">
            © 2026 AETHER INDUSTRIAL SYSTEMS.
          </div>
          <nav className="flex gap-6 text-[10px] tracking-[0.2em] uppercase">
            <a className="text-zinc-500 hover:text-[#E84C2F]" href="#">Privacy</a>
            <a className="text-zinc-500 hover:text-[#E84C2F]" href="#">Security</a>
          </nav>
        </div>
      </footer>
    </div>
  );
}
