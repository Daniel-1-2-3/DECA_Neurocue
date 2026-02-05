import { useRef, useEffect, useState } from 'react';
import pupilVideo from "../assets/pupil.mp4";

function Demo() {
    const videoRefs = useRef([]);
    const [videoPlayingId, setVideoPlayingId] = useState(null);

    useEffect(() => {
        const v = document.createElement('video');
        v.src = pupilVideo;
        v.load();
    }, []);

    const conditions = [
        { id: 0, label: "Traumatic Iritis", code: "" },
        { id: 1, label: "Retinal Hemorrhage", code: "" },
        { id: 2, label: "Papilledema", code: "" }
    ];

    return (
        <div className="h-screen w-screen bg-[#050505] overflow-hidden flex items-center justify-center font-sans text-white">
            {/* Ambient Background Glow */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-500/5 blur-[120px] rounded-full" />
            </div>

            <div className="h-[80vh] w-full max-w-6xl mx-6 z-10 flex flex-col">

                {/* Main Content Area */}
                <div className="flex-1 flex gap-6 perspective-2000">
                    {conditions.map((item, idx) => {
                        const isActive = videoPlayingId === item.id;
                        const isLocked = videoPlayingId !== null && videoPlayingId !== item.id;
                        
                        return (
                            <div 
                                key={item.id}
                                onClick={() => {
                                    if (!isLocked) {
                                        setVideoPlayingId(isActive ? null : item.id);
                                    }
                                }}
                                className={`relative flex-1 transition-all duration-1000 preserve-3d 
                                    ${isActive ? 'rotate-y-180 scale-105' : 'scale-100'} 
                                    ${isLocked ? 'cursor-default opacity-20 scale-95 blur-sm' : 'cursor-pointer'}`}
                            >
                                {/* FRONT: Minimalist Selection Card */}
                                <div className="absolute inset-0 backface-hidden bg-zinc-700 backdrop-blur-3xl border border-white/10 rounded-2xl flex flex-col p-8 group overflow-hidden">
                                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                                    <div className="relative justify-center items-center">
                                        <div className="text-xl mt-70 uppercase tracking-[0.15em] text-white/100 group-hover:text-white transition-all duration-500 font-light">
                                            {item.label}
                                        </div>
                                        <div className="mt-4 h-[1px] w-8 bg-white/20 group-hover:w-full transition-all duration-700 ease-in-out" />
                                    </div>

                                    <div className="mt-auto flex items-center gap-3">
                                    </div>
                                </div>

                                {/* BACK: Modern Clinical Viewport */}
                                <div className="absolute inset-0 backface-hidden rotate-y-180 bg-zinc-800 border border-white/20 rounded-lg overflow-hidden shadow-2xl">
                                    <div className="relative w-full h-full flex items-center justify-center">
                                        {/* Cinematic Background Blur of the video */}
                                        <div className="absolute inset-0 opacity-20 scale-80 blur-3xl">
                                            <video src={pupilVideo} autoPlay muted loop playsInline className="w-full h-full object-cover" />
                                        </div>

                                        {/* Video Frame with Modern Border */}
                                        <div className="relative h-full flex aspect-2/3 items-center justify-center z-10">
                                            {/* This div creates the physical border around the scaled video area */}
                                            <div className="relative w-full h-full scale-70 rounded-xl border-2 border-white/60 overflow-hidden shadow-gray-500 shadow-2xl">
                                                <video
                                                    ref={el => videoRefs.current[idx] = el}
                                                    src={pupilVideo}
                                                    className="w-full h-full object-cover opacity-90"
                                                    autoPlay muted loop playsInline
                                                />
                                            </div>
                                            
                                            {/* Surgical Overlays - Adjusted to sit inside the border area */}
                                            <div className="absolute inset-0 scale-70 pointer-events-none">
                                                <div className="absolute top-0 left-1/2 -translate-x-1/2 h-full w-[1px] bg-white/10" />
                                                <div className="absolute top-1/2 left-0 -translate-y-1/2 w-full h-[1px] bg-white/10" />
                                            </div>
                                        </div>

                                        {/* Bottom Data Bar */}
                                        <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black to-transparent z-20">
                                            <div className="flex justify-between items-center">
                                                <div className="mx-2 mb-2 text-[10px] uppercase tracking-[0.2em] text-white/70">{item.label}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <style dangerouslySetInnerHTML={{ __html: `
                .perspective-2000 { perspective: 2000px; }
                .preserve-3d { transform-style: preserve-3d; }
                .backface-hidden { backface-visibility: hidden; }
                .rotate-y-180 { transform: rotateY(180deg); }
            `}} />
        </div>
    );
}

export default Demo;