import { useState, useEffect, useRef } from "react";
import pupilVideo from "../assets/pupil.mp4";

function useWindowSize() {
  const [size, setSize] = useState({ w: window.innerWidth, h: window.innerHeight });
  useEffect(() => {
    function onResize() { setSize({ w: window.innerWidth, h: window.innerHeight }); }
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  return size;
}

function Scanner() {
  const [isRecording, setIsRecording] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [scanMode, setScanMode] = useState('pupil');
  const [hasPupil, setHasPupil] = useState(false);
  const [hasRetina, setHasRetina] = useState(false);
  const { w, h } = useWindowSize();
  const videoRef = useRef(null);

  // Restart video when recording starts
  useEffect(() => {
    if (isRecording && videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play();
    } else if (videoRef.current) {
      videoRef.current.pause();
    }
  }, [isRecording]);

  function record() {
    if (isRecording && scanMode === 'pupil' && !hasPupil) setHasPupil(true);
    if (isRecording && scanMode === 'retina' && !hasRetina) setHasRetina(true);
    setIsRecording(!isRecording);
  }

  return (
    <div className="h-screen w-screen bg-black overflow-hidden flex items-center justify-center font-sans">
      <div className="h-full w-full mx-2 bg-neutral-900 overflow-hidden relative shadow-2xl">
        
        <div className="absolute inset-0">
          <div className="w-full h-full bg-neutral-800" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-neutral-700/20 via-transparent to-black" />
        </div>

        {/* Header Bar */}
        <div className="absolute top-0 left-0 w-full border-b border-white/5 bg-black/20 backdrop-blur-md z-10 flex items-center px-6" style={{ height: `${h/15}px` }}>
          <div className={`w-2 h-2 rounded-full animate-pulse mr-2 ${isAnalyzing ? 'bg-emerald-500' : 'bg-red-500'}`}/>
          <span className="text-white/70 text-[10px] uppercase tracking-widest font-medium">
            {isAnalyzing ? 'Analyzing' : 'Scanning'}
          </span>
        </div>

        {/* Scan Line Overlay */}
        <div 
          className="absolute left-1/2 -translate-x-1/2 pointer-events-none z-20 overflow-hidden rounded-full"
          style={{ height: `${w/1.2}px`, top: `${h/15 + (h/1.5 - w/1.2)/2 + 20}px`, width: `${w/1.2}px`}}
        >
           <div className="absolute inset-x-0 h-0.5 bg-linear-to-r from-transparent via-blue-400/70 to-transparent top-0 animate-scan" />
        </div>

        {/* Main Circle Container */}
        <div className="absolute inset-0 flex justify-center items-center pointer-events-none" style={{ height: `${h/1.5}px`, top: `${h/15 + 20}px` }}>
          <div 
            className="rounded-full relative border-[3px] border-gray-600 shadow-[0_0_40px_rgba(0,0,0,0.7)] overflow-hidden bg-black flex items-center justify-center" 
            style={{ width: `${w/1.2}px`, height: `${w/1.2}px` }}
          >
            {/* Pupil */}
            <video
              ref={videoRef}
              src={pupilVideo}
              className={`w-full h-full object-cover transition-opacity duration-500 scale-120 ${(isRecording && scanMode === 'pupil') ? 'opacity-100' : 'opacity-0'}`}
              muted
              loop
              playsInline
            />

            {/* Pupil */}
            <video
              ref={videoRef}
              src={pupilVideo}
              className={`w-full h-full object-cover transition-opacity duration-500 scale-120 ${(isRecording && scanMode === 'retina') ? 'opacity-100' : 'opacity-0'}`}
              muted
              loop
              playsInline
            />
            
            <div className="absolute inset-0 rounded-full border border-white/5 pointer-events-none" />
          </div>
        </div>

        <div className="absolute top-0 left-0 w-full bg-linear-to-b from-black/40 to-black/80 backdrop-blur-[2px]" style={{ height: `${h}px`, top: `${h/15 + 20 + h/1.5 + 20}px` }} />
        <div className="absolute left-0 w-full flex items-center justify-between px-6" style={{ height: `${h - (h/15 + 20 + h/1.5 + 20)}px`, top: `${h/15 + 20 + h/1.5 + 20}px` }}>
          
          <div className="flex-1 flex justify-start">
            {(hasPupil && hasRetina) ? (
              <button className="relative w-3/4 h-10 flex items-center justify-center outline-none group" onClick={() => setIsAnalyzing(true)}>
                <div className="absolute inset-0 rounded-lg bg-grey-300/70 backdrop-blur-md border-2 border-white/5 group-hover:bg-grey-400/70 transition-all" />
                <span className="relative z-10 text-white/80 text-[10px] font-semibold uppercase tracking-widest">Analyze</span>
              </button>
            ) : (
              <div className="w-3/4 h-10 rounded-lg bg-white/5 border border-white/5 opacity-40 flex items-center justify-center">
                 <span className="text-white/20 text-[10px] uppercase tracking-widest">Locked</span>
              </div>
            )}
          </div>

          <div className="flex-none">
            <button onClick={record} className="group relative w-16 h-16 flex items-center justify-center outline-none">
              <div className="absolute inset-0 rounded-full border-4 border-white/30 group-hover:border-white/50 transition-all duration-300" />
              <div className={`bg-red-600/70 shadow-[0_0_15px_rgba(239,68,68,0.4)] transition-all duration-300 ease-in-out ${isRecording ? 'w-6 h-6 rounded-sm' : 'w-12 h-12 rounded-full'}`} />
            </button>
          </div>

          <div className="flex-1 flex justify-end">
            <div className="relative w-16 h-20 bg-black/40 backdrop-blur-xl rounded-xl border border-white/10 p-1 flex flex-col gap-1">
              <div className={`absolute left-1 right-1 h-[calc(50%-4px)] bg-white/10 rounded-lg transition-all duration-300 ease-out ${scanMode === 'retina' ? 'translate-y-full' : 'translate-y-0'}`} />
              <button onClick={() => setScanMode('pupil')} className={`relative z-10 flex-1 w-full text-[8px] font-bold uppercase transition-colors duration-300 ${scanMode === 'pupil' ? 'text-white' : 'text-white/30'}`}>
                <span className={hasPupil ? 'text-emerald-400' : ''}>Pupil</span>
              </button>
              <button onClick={() => setScanMode('retina')} className={`relative z-10 flex-1 w-full text-[8px] font-bold uppercase transition-colors duration-300 ${scanMode === 'retina' ? 'text-white' : 'text-white/30'}`}>
                <span className={hasRetina ? 'text-emerald-400' : ''}>Retina</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes scan { 0% { top: 0%; opacity: 0; } 10% { opacity: 1; } 90% { opacity: 1; } 100% { top: 100%; opacity: 0; } }
        .animate-scan { animation: scan 3s linear infinite; }
      `}} />
    </div>
  );
}

export default Scanner;