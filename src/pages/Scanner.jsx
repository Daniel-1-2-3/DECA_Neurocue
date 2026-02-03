import { useState, useEffect } from "react";
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
  const [isReady, setIsReady] = useState(false);

  const [concussionProb, setConcussionProb] = useState("97.4% Probability");
  const [otherCondition, setOtherCondition] = useState("Papilledema");
  const [otherConditionDescription, setOtherConditionDescription] = useState("Early stage brain swelling; dangerously high pressures in cranium.")
  const { w, h } = useWindowSize();

  // Preloading logic remains to ensure 'isReady' status
  useEffect(() => {
    const assets = [pupilVideo, retinaVideo, analyzePupilVideo, analyzeRetinaVideo];
    let loaded = 0;
    assets.forEach(src => {
      const v = document.createElement('video');
      v.src = src;
      v.preload = 'auto';
      v.muted = true;
      v.oncanplaythrough = () => {
        loaded++;
        if (loaded === assets.length) setIsReady(true);
      };
      v.load();
    });
  }, []);

  const resetState = () => {
    setIsAnalyzing(false);
    setIsRecording(false);
    setHasPupil(false);
    setHasRetina(false);
    setScanMode('pupil');
    setAnalysisPhase('none');
  };

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

  function iritis() {
    setConcussionProb("97.3% Probability");
    setOtherCondition("Traumatic Iritis");
    setOtherConditionDescription("Blunt force trauma to the eye that often occurs simultaneously with a concussion.");
  }

  function papilledema() {
    setConcussionProb("97.4% Probability");
    setOtherCondition("Papilledema");
    setOtherConditionDescription("Early stage brain swelling; dangerously high pressures in cranium.");
  }

  function retinalBleed() {
    setConcussionProb("98.3% Probability");
    setOtherCondition("Retinal Hemorrhage");
    setOtherConditionDescription("Small bleeding on the back of eye; indicates brain being rattled.");
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
              {isAnalyzing 
                ? `Analyzing ${analysisPhase}` 
                : (isReady ? 'System Ready' : 'Loading')}
            </span>
          </div>
          {hasHistory && (
            <button 
              onClick={() => setShowResults(true)}
              className="text-gray-300 text-[10px] uppercase tracking-widest px-3 py-1 rounded bg-gray-700 transition-all"
            >
              Open Diagnostic
            </button>
          )}
        </div>

        {/* 4 Corner Brackets */}
        <div 
            className="absolute left-1/2 -translate-x-1/2 pointer-events-none z-10"
            style={{ 
                height: `${w/1.2 + 20}px`, 
                top: `${h/15 + (h/1.5 - w/1.2)/2 + 10}px`, 
                width: `${w/1.2 + 20}px` 
            }}
        >
            <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-white/20" />
            <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-white/20" />
            <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-white/20" />
            <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-white/20" />
        </div>

        {/* Scanning Line Animation */}
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
              <div className="absolute w-full h-12 bg-linear-to-b from-blue-800/30 via-blue-700/10 to-transparent animate-scan-curved" style={{ borderRadius: '50% 50% 0 0' }} />
              <div className="absolute w-full h-0.5 bg-blue-300/60 shadow-[0_0_15px_rgba(147,197,253,1)] animate-scan-curved" />
            </div>
          </div>
        )}

        {/* Main Circle & Video Stack */}
        <div className="absolute inset-0 flex justify-center items-center pointer-events-none" style={{ height: `${h/1.5}px`, top: `${h/15 + 20}px` }}>
          <div 
            className="rounded-full relative transition-all duration-1000 overflow-hidden flex items-center justify-center bg-gray-800 shadow-[0_20px_50px_rgba(0,0,0,0.8),inset_0_0_40px_rgba(0,0,0,1)] border border-white/3" 
            style={{ width: `${w/1.2}px`, height: `${w/1.2}px` }}
          >
            <div className="absolute inset-0 rounded-full border-[6px] border-black/40 z-10 pointer-events-none" />
            
            <div className="relative w-full h-full rounded-full overflow-hidden pointer-events-auto cursor-pointer">
              
              {/* VIDEO STACK: All mounted, only one visible */}
              <video
                src={pupilVideo}
                className={`absolute inset-0 w-full h-full object-cover scale-130 transition-opacity duration-300 ${(!isAnalyzing && scanMode === 'pupil' && isRecording) ? 'opacity-80' : 'opacity-0'}`}
                autoPlay muted loop playsInline
              />
              <video
                src={retinaVideo}
                className={`absolute inset-0 w-full h-full object-cover scale-130 transition-opacity duration-300 ${(!isAnalyzing && scanMode === 'retina' && isRecording) ? 'opacity-80' : 'opacity-0'}`}
                autoPlay muted loop playsInline
              />
              <video
                src={analyzePupilVideo}
                className={`absolute inset-0 w-full h-full object-cover scale-130 transition-opacity duration-300 ${(isAnalyzing && analysisPhase === 'pupil') ? 'opacity-80' : 'opacity-0'}`}
                autoPlay={isAnalyzing && analysisPhase === 'pupil'}
                onEnded={() => setAnalysisPhase('retina')}
                muted playsInline
              />
              <video
                src={analyzeRetinaVideo}
                className={`absolute inset-0 w-full h-full object-cover scale-130 transition-opacity duration-300 ${(isAnalyzing && analysisPhase === 'retina') ? 'opacity-80' : 'opacity-0'}`}
                autoPlay={isAnalyzing && analysisPhase === 'retina'}
                onEnded={() => {
                    setShowResults(true);
                    setHasHistory(true);
                    resetState();
                }}
                muted playsInline
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
              <button onClick={startAnalyze} className="w-48 h-14 rounded-md bg-gray-500/20 border-2 border-gray-700/40 flex items-center justify-center group/btn shadow-[0_0_30px_rgba(16,185,129,0.1)] transition-all overflow-hidden">
                <span className="relative z-10 text-gray-400 text-[11px] uppercase tracking-[0.3em] text-center">Run Analysis</span>
                <div className="absolute inset-0 rounded-xl border border-gray-500/50 animate-ping opacity-20" />
              </button>
            </div>
          )}
        </div>

        {/* Results Modal omitted for brevity, logic remains same */}
        {showResults && (
           <div className="fixed inset-0 z-100 flex items-center justify-center p-6 bg-black/60 backdrop-blur-md">
           <div className="w-full max-w-sm bg-neutral-900 border border-white/10 rounded-sm p-8 relative shadow-2xl animate-in fade-in zoom-in duration-300">
             <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-neutral-700 border border-white/10 px-4 py-1 rounded-sm text-[12px] uppercase tracking-tighter text-white font-medium">Diagnostic</div>
             <div className="space-y-6 mt-4">
               <div className="border-l-2 border-gray-600 pl-4">
                 <div className="text-white/40 text-[10px] uppercase tracking-widest mb-1 font-semibold">Concussion Assessment</div>
                 <div className="text-white uppercase text-sm font-medium">Concussion</div>
                 <div className="text-red-400 text-sm mt-0.5">{concussionProb}</div>
               </div>
               <div className="border-l-2 border-gray-600 pl-4">
                 <div className="text-white/40 text-[10px] uppercase tracking-widest mb-1 font-semibold">Other Possible Injuries</div>
                 <div className="text-white uppercase text-sm font-medium">{otherCondition}</div>
                 <div className="text-gray-400 text-[12px] mt-1 leading-tight tracking-wide">{otherConditionDescription}</div>
               </div>
             </div>
             <button onClick={() => setShowResults(false)} className="w-full mt-10 py-3 bg-white/5 border border-white/10 hover:bg-white/10 rounded-sm text-white/70 text-[12px] uppercase transition-colors">Close Report</button>
           </div>
         </div>
        )}

        <button className="fixed bottom-2 left-2 z-200 py-2 h-20 w-14 opacity-0" onClick={() => iritis()} />
        <button className="fixed bottom-26 left-2 z-200 py-2 h-20 w-14 opacity-0" onClick={() => retinalBleed()} />
        <button className="fixed bottom-26 right-2 z-200 py-2 h-20 w-14 opacity-0" onClick={() => papilledema()} />
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