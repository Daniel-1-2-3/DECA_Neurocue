import { useState, useEffect, useRef } from "react";
import pupilVideo from "../assets/pupil.mp4";
import retinaVideo from "../assets/retina.mp4";
import analyzePupilVideo from "../assets/analyzePupil.mp4";
import analyzeRetinaVideo from "../assets/analyzeRetina.mp4";

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
  const [analysisPhase, setAnalysisPhase] = useState('none'); 
  const [showResults, setShowResults] = useState(false);
  const [hasHistory, setHasHistory] = useState(false);
  const [scanMode, setScanMode] = useState('pupil');
  const [hasPupil, setHasPupil] = useState(false);
  const [hasRetina, setHasRetina] = useState(false);
  const { w, h } = useWindowSize();
  const videoRef = useRef(null);

  const resetState = () => {
    setIsAnalyzing(false);
    setIsRecording(false);
    setHasPupil(false);
    setHasRetina(false);
    setScanMode('pupil');
    setAnalysisPhase('none');
  };

  useEffect(() => {
    if (isRecording && videoRef.current) {
      videoRef.current.load();
      videoRef.current.play().catch(() => {});
    }
  }, [isRecording, scanMode]);

  useEffect(() => {
    if (showResults) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    // Cleanup to ensure scrolling returns if component unmounts
    return () => { document.body.style.overflow = 'unset'; };
  }, [showResults]);

  const startAnalyze = () => {
    setIsAnalyzing(true);
    setAnalysisPhase('pupil');
  };

  function record() {
    if (isAnalyzing) return;
    if (isRecording && scanMode === 'pupil' && !hasPupil) setHasPupil(true);
    if (isRecording && scanMode === 'retina' && !hasRetina) setHasRetina(true);
    setIsRecording(!isRecording);
  }

  const isReadyForAnalysis = hasPupil && hasRetina;

  return (
    <div className="h-screen w-screen bg-black overflow-hidden flex items-center justify-center font-sans">
      <div className="h-full w-full mx-2 bg-neutral-900 overflow-hidden relative shadow-2xl">
        
        <div className="absolute inset-0">
          <div className="w-full h-full bg-neutral-800" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-neutral-700/20 via-transparent to-black" />
        </div>

        {/* Header Bar */}
        <div className="absolute top-0 left-0 w-full border-b border-white/5 bg-black/20 backdrop-blur-md z-30 flex items-center justify-between px-6" style={{ height: `${h/15}px` }}>
          <div className="flex items-center">
            <span className="text-white/70 text-[10px] uppercase tracking-widest font-medium">
              {isAnalyzing ? `Analyzing ${analysisPhase}` : 'Scanning'}
            </span>
          </div>
          {hasHistory && (
            <button 
              onClick={() => setShowResults(true)}
              className="text-gray-300 text-[10px] uppercase tracking-widest px-3 py-1 rounded bg-gray-700 transition-all"
            >
              Last Diagnostic
            </button>
          )}
        </div>

        {/* --- CURVED SCANNING LENS OVERLAY --- */}
        {/* Only show and animate when recording, but hide during analysis */}
        {isRecording && !isAnalyzing && (
          <div 
            className="absolute left-1/2 -translate-x-1/2 pointer-events-none z-20"
            style={{ 
                height: `${w/1.2}px`, 
                top: `${h/15 + (h/1.5 - w/1.2)/2 + 20}px`, 
                width: `${w/1.2}px`
            }}
          >
            <div className="absolute inset-0 rounded-full overflow-hidden">
              {/* Light Gradient Trail */}
              <div 
                className="absolute w-full h-12 bg-linear-to-b from-blue-800/30 via-blue-700/10 to-transparent animate-scan-curved"
                style={{ borderRadius: '50% 50% 0 0' }} 
              />
              {/* Sharp Leading Edge */}
              <div className="absolute w-full h-0.5 bg-blue-300/60 shadow-[0_0_15px_rgba(147,197,253,1)] animate-scan-curved" />
            </div>
          </div>
        )}

        {/* Main Circle & Video */}
        <div className="absolute inset-0 flex justify-center items-center pointer-events-none" style={{ height: `${h/1.5}px`, top: `${h/15 + 20}px` }}>
          <div 
            className="rounded-full relative transition-all duration-1000 overflow-hidden flex items-center justify-center bg-[#0a0a0a] shadow-[0_20px_50px_rgba(0,0,0,0.8),inset_0_0_40px_rgba(0,0,0,1)] border border-white/3" 
            style={{ width: `${w/1.2}px`, height: `${w/1.2}px` }}
          >
            <div className="absolute inset-0 rounded-full border-[6px] border-black/40 z-10 pointer-events-none" />
            <div className="absolute inset-0 rounded-full border border-white/5 z-10 pointer-events-none" />
            
            {!isRecording && !isAnalyzing && (
              <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03)_0%,transparent_70%)] animate-pulse pointer-events-none" />
            )}

            <div className="relative w-full h-full rounded-full overflow-hidden pointer-events-auto cursor-pointer">
              <video
                ref={videoRef}
                key={isAnalyzing ? analysisPhase : scanMode}
                onClick={() => {
                  if (videoRef.current) {
                    videoRef.current.paused ? videoRef.current.play() : videoRef.current.pause();
                  }
                }}
                // This event only triggers when the video reaches 100% completion
                onEnded={() => {
                  if (!isAnalyzing) return;
                  if (analysisPhase === 'pupil') {
                    setAnalysisPhase('retina');
                  } else if (analysisPhase === 'retina') {
                    setShowResults(true);
                    setHasHistory(true);
                    resetState();
                  }
                }}
                src={isAnalyzing 
                  ? (analysisPhase === 'pupil' ? analyzePupilVideo : analyzeRetinaVideo) 
                  : (scanMode === 'pupil' ? pupilVideo : retinaVideo)
                }
                className={`w-full h-full object-cover transition-opacity duration-1000 scale-130 ${(isRecording || isAnalyzing) ? 'opacity-80' : 'opacity-0'}`}
                autoPlay={isAnalyzing}
                muted 
                // Loop MUST be false during analysis so onEnded can fire
                loop={!isAnalyzing} 
                playsInline
              />
              <div className="absolute inset-0 bg-[radial-gradient(circle,transparent_40%,rgba(0,0,0,0.6)_100%)] pointer-events-none" />
            </div>
          </div>
        </div>

        <div className="absolute top-0 left-0 w-full bg-linear-to-b from-black/40 to-black/80 backdrop-blur-[2px]" style={{ height: `${h}px`, top: `${h/15 + 20 + h/1.5 + 20}px` }} />

        {/* Footer Controls */}
        <div className={`absolute left-0 w-full flex items-center px-6 transition-all duration-500 ${isAnalyzing ? 'opacity-20 pointer-events-none' : 'opacity-100'}`} 
             style={{ height: `${h - (h/15 + 20 + h/1.5 + 20)}px`, top: `${h/15 + 20 + h/1.5 + 20}px` }}>
          
          {!isReadyForAnalysis ? (
            <div className="w-full flex items-center justify-between animate-in fade-in duration-500">
              <div className="flex-1" /> 
              <div className="flex-none">
                <button onClick={record} className="group relative w-16 h-16 flex items-center justify-center outline-none">
                  <div className="absolute inset-0 rounded-full border-4 border-white/30 group-hover:border-white/50 transition-all duration-300" />
                  <div className={`bg-red-600/70 shadow-[0_0_15px_rgba(239,68,68,0.4)] transition-all duration-300 ease-in-out ${isRecording ? 'w-6 h-6 rounded-sm' : 'w-12 h-12 rounded-full'}`} />
                </button>
              </div>
              <div className="flex-1 flex justify-end">
                <div className="relative w-16 h-20 bg-black/40 backdrop-blur-xl rounded-xl border border-white/10 p-1">
                  <div className="h-full flex flex-col gap-1 relative">
                    <div className={`absolute left-0 right-0 h-[calc(50%-4px)] bg-white/10 rounded-lg transition-all duration-300 ease-out ${scanMode === 'retina' ? 'translate-y-[calc(100%+4px)]' : 'translate-y-0'}`} />
                    <button onClick={() => setScanMode('pupil')} disabled={isRecording} className={`relative z-10 flex-1 w-full text-[11px] font-bold uppercase transition-colors duration-300 ${scanMode === 'pupil' ? 'text-white/70' : 'text-white/30'}`}>
                      <span className={hasPupil ? 'text-emerald-700' : ''}>Pupil</span>
                    </button>
                    <button onClick={() => setScanMode('retina')} disabled={isRecording} className={`relative z-10 flex-1 w-full text-[11px] font-bold uppercase transition-colors duration-300 ${scanMode === 'retina' ? 'text-white/70' : 'text-white/30'}`}>
                      <span className={hasRetina ? 'text-emerald-700' : ''}>Retina</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="w-full flex justify-center animate-in fade-in zoom-in duration-700">
              <button 
                onClick={startAnalyze}
                className="w-48 h-14 rounded-md bg-gray-500/20 border-2 border-gray-700/40 flex items-center justify-center group/btn shadow-[0_0_30px_rgba(16,185,129,0.1)] transition-all overflow-hidden"
              >
                <span className="relative z-10 text-gray-400 text-[11px] uppercase tracking-[0.3em] text-center">
                  Run Analysis
                </span>
                <div className="absolute inset-0 rounded-xl border border-gray-500/50 animate-ping opacity-20" />
              </button>
            </div>
          )}
        </div>

        {/* Diagnostic Results Popup */}
        {showResults && (
          <div className="fixed inset-0 z-100 flex items-center justify-center p-6 bg-black/60 backdrop-blur-md">
            {/* This inner div is now perfectly centered vertically and horizontally */}
            <div className="w-full max-w-sm bg-neutral-900 border border-white/10 rounded-sm p-8 relative shadow-2xl animate-in fade-in zoom-in duration-300">
              
              {/* Label Tag */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-neutral-700 border border-white/10 px-4 py-1 rounded-sm text-[12px] uppercase tracking-tighter text-white font-medium">
                Diagnostic
              </div>

              <div className="space-y-6 mt-4">
                <div className="border-l-2 border-red-500/50 pl-4">
                  <div className="text-white/40 text-[10px] uppercase tracking-widest mb-1 font-semibold">
                    Concussion Assessment
                  </div>
                  <div className="text-white uppercase text-sm font-medium">Result:</div>
                  <div className="text-red-400 text-sm mt-0.5 font-bold italic">
                    92.3% Probability
                  </div>
                </div>

                <div className="border-l-2 border-gray-600 pl-4">
                  <div className="text-white/40 text-[10px] uppercase tracking-widest mb-1 font-semibold">
                    Secondary Findings
                  </div>
                  <div className="text-white uppercase text-sm font-medium">Papilledema:</div>
                  <div className="text-gray-400 text-[11px] mt-1 leading-tight tracking-wide">
                    Early stage brain swelling; dangerously high pressures in cranium.
                  </div>
                </div>
              </div>

              <button 
                onClick={() => setShowResults(false)} 
                className="w-full mt-10 py-3 bg-white/5 border border-white/10 hover:bg-white/10 rounded-sm text-white/70 text-[12px] uppercase transition-colors"
              >
                Close Report
              </button>
            </div>
          </div>
        )}
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes scan-curved { 
            0% { transform: translateY(-100%); opacity: 0; } 
            15% { opacity: 1; } 
            85% { opacity: 1; } 
            100% { transform: translateY(${w/1.2}px); opacity: 0; } 
        } 
        .animate-scan-curved { 
            animation: scan-curved 4s cubic-bezier(0.4, 0, 0.6, 1) infinite; 
        }
      `}} />
    </div>
  );
}

export default Scanner;