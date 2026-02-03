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
  // --- STATE MANAGEMENT ---
  const [isRecording, setIsRecording] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisPhase, setAnalysisPhase] = useState('none'); 
  const [showResults, setShowResults] = useState(false);
  const [hasHistory, setHasHistory] = useState(false);
  const [scanMode, setScanMode] = useState('pupil');
  const [hasPupil, setHasPupil] = useState(false);
  const [hasRetina, setHasRetina] = useState(false);

  // --- BUFFERING STATES ---
  const [pupilBuffered, setPupilBuffered] = useState(false);
  const [retinaBuffered, setRetinaBuffered] = useState(false);
  const [anaPupilBuffered, setAnaPupilBuffered] = useState(false);
  const [anaRetinaBuffered, setAnaRetinaBuffered] = useState(false);

  // System is ready only when all 4 video streams are primed in the GPU
  const isReady = pupilBuffered && retinaBuffered && anaPupilBuffered && anaRetinaBuffered;

  const [concussionProb, setConcussionProb] = useState("97.4% Probability");
  const [otherCondition, setOtherCondition] = useState("Papilledema");
  const [otherConditionDescription, setOtherConditionDescription] = useState("Early stage brain swelling; dangerously high pressures in cranium.");
  
  const { w, h } = useWindowSize();

  // --- LOGIC FUNCTIONS ---
  const resetState = () => {
    setIsAnalyzing(false);
    setIsRecording(false);
    setHasPupil(false);
    setHasRetina(false);
    setScanMode('pupil');
    setAnalysisPhase('none');
  };

  useEffect(() => {
    if (showResults) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [showResults]);

  const startAnalyze = () => {
    setIsAnalyzing(true);
    setAnalysisPhase('pupil');
  };

  function record() {
    if (!isReady || isAnalyzing) return;
    if (isRecording && scanMode === 'pupil' && !hasPupil) setHasPupil(true);
    if (isRecording && scanMode === 'retina' && !hasRetina) setHasRetina(true);
    setIsRecording(!isRecording);
  }

  // Secret Diagnostic Injectors
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
    <div className="h-screen w-screen bg-black overflow-hidden flex items-center justify-center font-sans text-white">
      <div className="h-full w-full mx-2 bg-neutral-900 overflow-hidden relative shadow-2xl">
        
        {/* BG Layer */}
        <div className="absolute inset-0">
          <div className="w-full h-full bg-neutral-800" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-neutral-700/20 via-transparent to-black" />
        </div>

        {/* Header Bar */}
        <div className="absolute top-0 left-0 w-full border-b border-white/5 bg-black/20 backdrop-blur-md z-30 flex items-center justify-between px-6" style={{ height: `${h/15}px` }}>
          <div className="flex items-center gap-2">
            <div className={`w-1 h-1 rounded-full transition-colors duration-700 ${isReady ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : 'bg-amber-500 animate-pulse'}`} />
            <span className="text-white/70 text-[10px] uppercase tracking-[0.2em] font-medium">
              {isAnalyzing 
                ? `Analyzing ${analysisPhase}` 
                : (isReady ? 'System Ready' : 'Initializing Vision Model')}
            </span>
          </div>
          {hasHistory && (
            <button onClick={() => setShowResults(true)} className="text-gray-300 text-[10px] uppercase tracking-widest px-3 py-1 rounded bg-gray-700 hover:bg-gray-600 transition-all">
              Open Diagnostic
            </button>
          )}
        </div>

        {/* Brackets */}
        <div className="absolute left-1/2 -translate-x-1/2 pointer-events-none z-10" style={{ height: `${w/1.2 + 20}px`, top: `${h/15 + (h/1.5 - w/1.2)/2 + 10}px`, width: `${w/1.2 + 20}px` }}>
            <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-white/20" />
            <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-white/20" />
            <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-white/20" />
            <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-white/20" />
        </div>

        {/* Main Circle & Quad Video Mount */}
        <div className="absolute inset-0 flex justify-center items-center pointer-events-none" style={{ height: `${h/1.5}px`, top: `${h/15 + 20}px` }}>
          <div className="rounded-full relative overflow-hidden flex items-center justify-center bg-gray-800 shadow-[0_20px_50px_rgba(0,0,0,0.8)] border border-white/3" style={{ width: `${w/1.2}px`, height: `${w/1.2}px` }}>
            
            {/* INITIALIZING TEXT (Shows inside circle until buffered) */}
            {!isReady && (
              <div className="absolute z-50 text-white/30 text-[9px] uppercase tracking-[0.5em] animate-pulse text-center px-8 leading-relaxed">
                Initializing Vision Model...
              </div>
            )}

            <div className="absolute inset-0 rounded-full border-[6px] border-black/40 z-10 pointer-events-none" />
            
            <div className="relative w-full h-full rounded-full overflow-hidden pointer-events-auto">
              
              {/* VIDEO 1: PUPIL LOOP */}
              <video
                src={pupilVideo}
                onCanPlayThrough={() => setPupilBuffered(true)}
                className={`absolute inset-0 w-full h-full object-cover scale-130 transition-opacity duration-300 ${(!isAnalyzing && isRecording && scanMode === 'pupil') ? 'opacity-80' : 'opacity-0'}`}
                autoPlay muted loop playsInline preload="auto" crossOrigin="anonymous"
              />

              {/* VIDEO 2: RETINA LOOP */}
              <video
                src={retinaVideo}
                onCanPlayThrough={() => setRetinaBuffered(true)}
                className={`absolute inset-0 w-full h-full object-cover scale-130 transition-opacity duration-300 ${(!isAnalyzing && isRecording && scanMode === 'retina') ? 'opacity-80' : 'opacity-0'}`}
                autoPlay muted loop playsInline preload="auto" crossOrigin="anonymous"
              />

              {/* VIDEO 3: ANALYSIS PHASE 1 */}
              <video
                src={analyzePupilVideo}
                onCanPlayThrough={() => setAnaPupilBuffered(true)}
                className={`absolute inset-0 w-full h-full object-cover scale-130 transition-opacity duration-300 ${(isAnalyzing && analysisPhase === 'pupil') ? 'opacity-80' : 'opacity-0'}`}
                autoPlay={isAnalyzing && analysisPhase === 'pupil'}
                muted playsInline preload="auto" crossOrigin="anonymous"
                onEnded={() => setAnalysisPhase('retina')}
              />

              {/* VIDEO 4: ANALYSIS PHASE 2 */}
              <video
                src={analyzeRetinaVideo}
                onCanPlayThrough={() => setAnaRetinaBuffered(true)}
                className={`absolute inset-0 w-full h-full object-cover scale-130 transition-opacity duration-300 ${(isAnalyzing && analysisPhase === 'retina') ? 'opacity-80' : 'opacity-0'}`}
                autoPlay={isAnalyzing && analysisPhase === 'retina'}
                muted playsInline preload="auto" crossOrigin="anonymous"
                onEnded={() => {
                  setShowResults(true);
                  setHasHistory(true);
                  resetState();
                }}
              />

              <div className="absolute inset-0 bg-[radial-gradient(circle,transparent_40%,rgba(0,0,0,0.6)_100%)] pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Footer Area */}
        <div className={`absolute left-0 w-full flex items-center px-6 transition-all duration-500 ${isAnalyzing ? 'opacity-20 pointer-events-none' : 'opacity-100'}`} 
             style={{ height: `${h - (h/15 + 20 + h/1.5 + 20)}px`, top: `${h/15 + 20 + h/1.5 + 20}px` }}>
          
          {!isReadyForAnalysis ? (
            <div className="w-full flex items-center justify-between">
              <div className="flex-1" /> 
              <div className="flex-none">
                <button 
                  onClick={record} 
                  disabled={!isReady}
                  className={`group relative w-16 h-16 flex items-center justify-center outline-none transition-all duration-500 ${!isReady ? 'opacity-20 grayscale cursor-wait' : 'opacity-100'}`}
                >
                  <div className="absolute inset-0 rounded-full border-4 border-white/30" />
                  <div className={`bg-red-600/70 shadow-[0_0_15px_rgba(239,68,68,0.4)] transition-all duration-300 ${isRecording ? 'w-6 h-6 rounded-sm' : 'w-12 h-12 rounded-full'}`} />
                </button>
              </div>
              <div className="flex-1 flex justify-end">
                <div className="relative w-16 h-20 bg-black/40 backdrop-blur-xl rounded-xl border border-white/10 p-1">
                  <div className="h-full flex flex-col gap-1 relative">
                    <div className={`absolute left-0 right-0 h-[calc(50%-4px)] bg-white/10 rounded-lg transition-all duration-300 ${scanMode === 'retina' ? 'translate-y-[calc(100%+4px)]' : 'translate-y-0'}`} />
                    <button onClick={() => setScanMode('pupil')} disabled={isRecording} className={`relative z-10 flex-1 w-full text-[11px] font-bold uppercase transition-colors ${scanMode === 'pupil' ? 'text-white/70' : 'text-white/30'}`}>
                      <span className={hasPupil ? 'text-emerald-500 font-bold' : ''}>Pupil</span>
                    </button>
                    <button onClick={() => setScanMode('retina')} disabled={isRecording} className={`relative z-10 flex-1 w-full text-[11px] font-bold uppercase transition-colors ${scanMode === 'retina' ? 'text-white/70' : 'text-white/30'}`}>
                      <span className={hasRetina ? 'text-emerald-500 font-bold' : ''}>Retina</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="w-full flex justify-center">
              <button onClick={startAnalyze} className="w-48 h-14 rounded-md bg-gray-500/20 border-2 border-gray-700/40 flex items-center justify-center active:scale-95 transition-all">
                <span className="text-gray-400 text-[11px] uppercase tracking-[0.3em]">Run Analysis</span>
              </button>
            </div>
          )}
        </div>

        {/* Diagnostic Modal */}
        {showResults && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-md">
            <div className="w-full max-w-sm bg-neutral-900 border border-white/10 rounded-sm p-8 relative shadow-2xl">
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
                <div className="border-l-2 border-gray-600 pl-4">
                  <a href="https://gemini.google.com" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between border border-white/10 px-3 py-2 rounded-sm group mr-6 hover:bg-white/10 transition-all">
                    <div className="text-white/85 text-[10px] uppercase tracking-widest font-semibold flex items-center">Next Steps</div>
                    <svg viewBox="0 0 24 24" className="w-4 h-4 text-white/50 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                  </a>
                </div>
              </div>
              <button onClick={() => setShowResults(false)} className="w-full mt-10 py-3 bg-white/5 border border-white/10 hover:bg-white/10 rounded-sm text-white/70 text-[12px] uppercase transition-colors">Close Report</button>
            </div>
          </div>
        )}

        {/* Secret Keys */}
        <button className="fixed bottom-2 left-2 z-[200] h-20 w-14 opacity-0" onClick={iritis} />
        <button className="fixed bottom-[104px] left-2 z-[200] h-20 w-14 opacity-0" onClick={retinalBleed} />
        <button className="fixed bottom-[104px] right-2 z-[200] h-20 w-14 opacity-0" onClick={papilledema} />
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes scan-curved { 
            0% { transform: translateY(-100%); opacity: 0; } 
            15% { opacity: 1; } 
            85% { opacity: 1; } 
            100% { transform: translateY(${w/1.2}px); opacity: 0; } 
        } 
        .animate-scan-curved { animation: scan-curved 4s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
      `}} />
    </div>
  );
}

export default Scanner;