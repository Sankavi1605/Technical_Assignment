import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, X, Clock, ArrowRight } from 'lucide-react';
import { Shader, Swirl, ChromaFlow, FlutedGlass, FilmGrain } from 'shaders/react';

export default function Landing() {
  const [time, setTime] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('en-GB', { timeZone: 'Europe/London', hour: '2-digit', minute: '2-digit' }));
    };
    updateTime();
    const int = setInterval(updateTime, 1000);
    return () => clearInterval(int);
  }, []);

  return (
    <div className="min-h-screen bg-white overflow-x-hidden font-sans">
      {/* SECTION 1: HERO */}
      <section className="relative h-screen bg-[#EFEFEF] flex flex-col justify-end overflow-hidden">
        {/* Background Overlay */}
        <div className="absolute inset-0 z-10 pointer-events-none opacity-50 bg-gradient-to-br from-white to-[#f0f0f0]"></div>
        
        {/* Shader Background Elements */}
        <div className="absolute inset-0 z-10 pointer-events-none">
          <Shader style={{ width: '100%', height: '100%' }}>
            <Swirl colorA="#ffffff" colorB="#f0f0f0" detail={1.7} />
            <ChromaFlow baseColor="#ffffff" downColor="#ff5f03" leftColor="#ff5f03" rightColor="#ff5f03" upColor="#ff5f03" momentum={13} radius={3.5} />
            <FlutedGlass aberration={0.61} angle={31} frequency={8} highlight={0.12} highlightSoftness={0} lightAngle={-90} refraction={4} shape="rounded" softness={1} speed={0.15} />
            <FilmGrain strength={0.05} blendMode="overlay" />
          </Shader>
        </div>

        {/* Navigation */}
        <nav className="absolute top-4 left-0 right-0 z-20 flex justify-center px-4">
          <div className="bg-white rounded-full p-[5px] max-w-[1440px] w-full flex items-center justify-between sm:p-3 shadow-sm">
            <div className="flex items-center gap-6">
              <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gray-900 rounded-full flex items-center justify-center">
                <span className="text-white text-[10px] leading-[11px] font-bold tracking-tight">TS</span>
              </div>
              <div className="hidden md:flex gap-6 text-[14px] text-gray-900">
                <a href="#features" className="hover:text-gray-500 transition-colors duration-300">Features</a>
                <a href="#how-it-works" className="hover:text-gray-500 transition-colors duration-300">How it Works</a>
                <a href="#dashboard" className="hover:text-gray-500 transition-colors duration-300">Dashboard</a>
              </div>
            </div>

            <div className="hidden md:flex items-center gap-6">
              <span className="text-[13px] text-gray-600 hidden lg:block">Streamlining team updates</span>
              <button onClick={() => navigate('/login')} className="group flex items-center gap-3 bg-[#F26522] text-white text-[13px] font-medium rounded-full pl-5 pr-2 py-2 hover:bg-[#d95a1e] transition-colors">
                <div className="h-[20px] overflow-hidden flex flex-col">
                  <span className="whitespace-nowrap leading-[20px] group-hover:-translate-y-full transition-transform duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)]">Login to Portal</span>
                  <span className="whitespace-nowrap leading-[20px] group-hover:-translate-y-full transition-transform duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)]">Login to Portal</span>
                </div>
                <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                  <ArrowRight size={14} className="text-[#F26522] group-hover:-rotate-45 transition-transform duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)]" />
                </div>
              </button>
            </div>

            <button className="md:hidden bg-gray-900 text-white w-10 h-10 rounded-full flex items-center justify-center" onClick={() => setMenuOpen(true)}>
              <Menu size={20} />
            </button>
          </div>
        </nav>

        {/* Hero Content */}
        <div className="relative z-20 w-full max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 pb-14 sm:pb-16 lg:pb-20">
          <p className="text-[13px] leading-[14px] text-gray-900 tracking-wide mb-5 sm:mb-8 uppercase font-medium">Weekly Report Generator</p>
          <h1 className="text-[clamp(1.75rem,7vw,4.2rem)] sm:text-[clamp(2.5rem,5vw,4.2rem)] font-medium leading-[1.08] tracking-[-0.03em] text-gray-900">
            Weekly work reports, <br className="hidden sm:block" /><span className="sm:hidden"> </span>
            streamlined for growing <br className="hidden sm:block" /><span className="sm:hidden"> </span>
            teams.
          </h1>
          
          <div className="mt-8 sm:mt-12 flex flex-col sm:flex-row gap-4 sm:gap-5 items-start sm:items-center">
            <button onClick={() => navigate('/login')} className="group flex items-center gap-3 bg-[#F26522] text-white text-[13px] font-medium rounded-full pl-5 sm:pl-6 pr-2 py-2 hover:bg-[#e05a1a] transition-colors">
              <div className="h-[20px] overflow-hidden flex flex-col">
                <span className="whitespace-nowrap leading-[20px] group-hover:-translate-y-full transition-transform duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)]">Get Started</span>
                <span className="whitespace-nowrap leading-[20px] group-hover:-translate-y-full transition-transform duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)]">Get Started</span>
              </div>
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-white rounded-full flex items-center justify-center">
                <ArrowRight size={16} className="text-[#F26522] group-hover:-rotate-45 transition-transform duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)]" />
              </div>
            </button>

            <div onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })} className="bg-white rounded-[4px] shadow-[0_2px_8px_rgba(0,0,0,0.08)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.12)] transition-shadow duration-300 flex items-center gap-2.5 px-3 py-2 cursor-pointer">
              <span className="text-[13px] leading-[14px] font-medium text-gray-900">View Features</span>
              <span className="bg-[#F26522] text-white text-[10px] leading-[11px] px-1.5 sm:px-2 py-0.5 rounded">App</span>
            </div>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {menuOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 flex items-end">
            <div className="bg-white w-full rounded-2xl mx-3 mb-3 p-6 animate-[slideUp_0.5s_cubic-bezier(0.32,0.72,0,1)]">
              <div className="flex justify-end items-center mb-8">
                <button onClick={() => setMenuOpen(false)} className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-900">
                  <X size={20} />
                </button>
              </div>
              <div className="flex flex-col gap-4 text-[28px] font-medium text-gray-900 mb-8">
                <a href="#features" onClick={() => setMenuOpen(false)}>Features</a>
                <a href="#how-it-works" onClick={() => setMenuOpen(false)}>How it Works</a>
                <a href="#dashboard" onClick={() => setMenuOpen(false)}>Dashboard</a>
              </div>
              <button onClick={() => { setMenuOpen(false); navigate('/login'); }} className="w-full flex items-center justify-between bg-[#F26522] text-white text-lg font-medium rounded-full pl-6 pr-2 py-2">
                <span>Login to Portal</span>
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                  <ArrowRight size={20} className="text-[#F26522]" />
                </div>
              </button>
            </div>
          </div>
        )}
      </section>

      {/* SECTION 2: ABOUT */}
      <section id="how-it-works" className="bg-white pt-16 sm:pt-20 lg:pt-32 pb-12 sm:pb-16 lg:pb-24 overflow-hidden max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12">
        <div className="flex items-center gap-3 mb-6 sm:mb-8">
          <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-gray-900 text-white text-[11px] leading-[12px] font-semibold flex items-center justify-center">1</div>
          <div className="text-[12px] leading-[13px] font-medium border border-gray-200 rounded-full px-3 sm:px-4 py-1 sm:py-1.5 text-gray-900">The Solution</div>
        </div>

        <h2 className="text-[clamp(1.5rem,4vw,3.2rem)] font-medium leading-[1.12] tracking-[-0.02em] text-gray-900 mb-12 sm:mb-16 lg:mb-28 max-w-4xl">
          Consolidate team progress, <br className="hidden md:block"/>identify blockers instantly.
        </h2>

        {/* Mobile/Tablet Layout */}
        <div className="lg:hidden flex flex-col gap-8">
          <div className="space-y-6">
            <p className="text-[15px] leading-[1.6] font-medium text-gray-900">
              Our standardized weekly report format ensures every team member stays aligned, eliminating busywork and providing clear insights.
            </p>
            <button className="group flex items-center gap-3 bg-[#F26522] text-white text-[13px] font-medium rounded-full pl-5 pr-2 py-2 w-max">
              <div className="h-[20px] overflow-hidden flex flex-col">
                <span className="whitespace-nowrap leading-[20px] group-hover:-translate-y-full transition-transform duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)]">Learn more</span>
                <span className="whitespace-nowrap leading-[20px] group-hover:-translate-y-full transition-transform duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)]">Learn more</span>
              </div>
              <div className="w-7 h-7 bg-white rounded-full flex items-center justify-center">
                <ArrowRight size={14} className="text-[#F26522] group-hover:-rotate-45 transition-transform duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)]" />
              </div>
            </button>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-5">
            <img src="https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260516_090123_74be96d4-9c1b-40cf-932a-96f4f4babed3.png&w=1280&q=85" alt="Office 1" className="sm:w-[45%] aspect-[438/346] rounded-xl sm:rounded-2xl object-cover" />
            <img src="https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260516_090133_c157d30b-a99a-4477-bec1-a446149ec3f2.png&w=1280&q=85" alt="Office 2" className="sm:w-[55%] aspect-[900/600] rounded-xl sm:rounded-2xl object-cover" />
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden lg:grid grid-cols-[26%_1fr_48%] items-end gap-6 xl:gap-8">
          <img src="https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260516_090123_74be96d4-9c1b-40cf-932a-96f4f4babed3.png&w=1280&q=85" alt="Office 1" className="w-full aspect-[438/346] rounded-2xl object-cover self-end" />
          <div className="self-start flex flex-col justify-end items-end h-full">
            <div className="space-y-6">
              <p className="text-[16px] leading-[1.65] font-medium text-gray-900 whitespace-nowrap">
                Our standardized weekly report format<br/>ensures every team member stays aligned,<br/>eliminating busywork and providing clear insights.
              </p>
              <button className="group flex items-center gap-3 bg-[#F26522] text-white text-[13px] font-medium rounded-full pl-5 pr-2 py-2">
                <div className="h-[20px] overflow-hidden flex flex-col">
                  <span className="whitespace-nowrap leading-[20px] group-hover:-translate-y-full transition-transform duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)]">Learn more</span>
                  <span className="whitespace-nowrap leading-[20px] group-hover:-translate-y-full transition-transform duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)]">Learn more</span>
                </div>
                <div className="w-7 h-7 bg-white rounded-full flex items-center justify-center">
                  <ArrowRight size={14} className="text-[#F26522] group-hover:-rotate-45 transition-transform duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)]" />
                </div>
              </button>
            </div>
          </div>
          <img src="https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260516_090133_c157d30b-a99a-4477-bec1-a446149ec3f2.png&w=1280&q=85" alt="Office 2" className="w-full aspect-[3/2] rounded-2xl object-cover self-end" />
        </div>
      </section>

      {/* SECTION 3: CASE STUDIES */}
      <section id="features" className="bg-[#F5F5F5] pt-16 sm:pt-20 lg:pt-28 pb-16 sm:pb-20 lg:pb-28">
        <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12">
          <div className="flex items-center gap-3 mb-6 sm:mb-8">
            <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-gray-900 text-white text-[11px] leading-[12px] font-semibold flex items-center justify-center">2</div>
            <div className="text-[12px] leading-[13px] font-medium border border-gray-300 rounded-full px-3 sm:px-4 py-1 sm:py-1.5 text-gray-900">Key Features</div>
          </div>

          <h2 className="text-[clamp(1.75rem,7vw,4.2rem)] sm:text-[clamp(2.5rem,5vw,4.2rem)] font-medium leading-[1.08] tracking-[-0.03em] text-gray-900 mb-10 sm:mb-14 lg:mb-16">
            Platform capabilities
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 lg:gap-7">
            {/* Card 1 */}
            <div>
              <div className="relative aspect-[329/246] rounded-2xl overflow-hidden bg-[#1a1d2e] group cursor-pointer">
                <video src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260516_122702_390f5305-8719-41d5-ae80-d23ab3796c28.mp4" autoPlay muted loop playsInline className="w-full h-full object-cover" />
                <div className="absolute bottom-4 left-4 h-9 w-9 bg-white rounded-full flex items-center overflow-hidden transition-all duration-300 ease-in-out group-hover:w-[148px]">
                  <div className="flex items-center justify-center w-9 h-9 shrink-0">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-900 -rotate-45 group-hover:rotate-0 transition-transform duration-300">
                      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                    </svg>
                  </div>
                  <span className="text-[13px] font-medium text-gray-900 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">Learn more</span>
                </div>
              </div>
              <h3 className="text-[14px] leading-[15px] font-semibold text-gray-900 mt-5">Manager Overview</h3>
              <p className="text-[13px] leading-[14px] text-gray-600 mt-1 leading-relaxed">Get a birds-eye view of team progress with visual charts and metrics.</p>
            </div>

            {/* Card 2 */}
            <div>
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-[#6b6b6b] group cursor-pointer">
                <video src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260516_123323_f909c2b8-ff6c-4edf-882b-8ebcdbe389b5.mp4" autoPlay muted loop playsInline className="w-full h-full object-cover" />
              </div>
              <h3 className="text-[14px] leading-[15px] font-semibold text-gray-900 mt-5">AI Assistant</h3>
              <p className="text-[13px] leading-[14px] text-gray-600 mt-1 leading-relaxed">Instantly query team activity and identify blockers using our integrated AI chat.</p>
            </div>
          </div>
        </div>
      </section>
      
      <style>{`
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
