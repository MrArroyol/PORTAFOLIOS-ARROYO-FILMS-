import React, { useRef, useState, useEffect } from 'react';
import { Volume2, VolumeX, Play, Pause } from 'lucide-react';

interface VisualCoverProps {
  motif: string;
  accentColor: string;
  title: string;
  aspect?: string;
  timecode?: string;
  className?: string;
  isHovered?: boolean;
  videoUrl?: string;
  imageUrl?: string;
}

export const VisualCover: React.FC<VisualCoverProps> = ({
  motif,
  accentColor,
  title,
  aspect = 'aspect-[16/10]',
  timecode,
  className = '',
  isHovered = false,
  videoUrl,
  imageUrl,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    if (videoUrl && videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  }, [videoUrl]);

  const toggleSound = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        setIsPlaying(true);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  return (
    <div
      className={`relative overflow-hidden w-full bg-[#0a0a0a] ${aspect} ${className} transition-all duration-700 select-none`}
    >
      {/* If real video is provided, render native HTML5 video */}
      {videoUrl ? (
        <div className="absolute inset-0 w-full h-full">
          <video
            ref={videoRef}
            src={videoUrl}
            autoPlay
            loop
            muted={isMuted}
            playsInline
            className="w-full h-full object-cover"
          />

          {/* Video Control Pill (Discreet, bottom right) */}
          <div className="absolute bottom-3 right-3 z-20 flex items-center gap-1.5 opacity-80 hover:opacity-100 transition-opacity">
            <button
              type="button"
              onClick={togglePlay}
              className="p-1.5 rounded-full bg-black/60 backdrop-blur-md text-[#F1EEE8] hover:text-[#D4AF37] border border-white/10"
              aria-label={isPlaying ? 'Pausar video' : 'Reproducir video'}
            >
              {isPlaying ? <Pause size={12} /> : <Play size={12} />}
            </button>
            <button
              type="button"
              onClick={toggleSound}
              className="p-1.5 rounded-full bg-black/60 backdrop-blur-md text-[#F1EEE8] hover:text-[#D4AF37] border border-white/10"
              aria-label={isMuted ? 'Activar audio' : 'Silenciar audio'}
            >
              {isMuted ? <VolumeX size={12} /> : <Volume2 size={12} />}
            </button>
          </div>
        </div>
      ) : imageUrl ? (
        <div className="absolute inset-0 w-full h-full overflow-hidden">
          <img
            src={imageUrl}
            alt={title}
            className={`w-full h-full object-cover transition-transform duration-700 ${
              isHovered ? 'scale-105' : 'scale-100'
            }`}
          />
          <div className="absolute inset-0 bg-black/25 pointer-events-none" />
        </div>
      ) : (
        /* Procedural Cinematic Artwork */
        <>
          <div
            className="absolute inset-0 opacity-40 transition-transform duration-1000 ease-out"
            style={{
              background: `radial-gradient(circle at 60% 40%, ${accentColor}33 0%, rgba(9,9,9,0.95) 75%)`,
              transform: isHovered ? 'scale(1.08)' : 'scale(1)',
            }}
          />

          <div className="absolute inset-0 flex items-center justify-center p-6 transition-transform duration-700">
            {motif === 'medical-aesthetic' && (
              <div className="relative w-full h-full flex items-center justify-center">
                {/* Facial contouring golden aesthetic vector & profile */}
                <svg
                  viewBox="0 0 320 200"
                  className="w-full max-w-xs transition-transform duration-700"
                  style={{ transform: isHovered ? 'scale(1.06)' : 'scale(1)' }}
                >
                  <path
                    d="M 120 40 Q 140 70 145 95 Q 165 105 160 130 Q 145 155 125 170"
                    fill="none"
                    stroke="#D4AF37"
                    strokeWidth="2"
                    strokeLinecap="round"
                    filter="drop-shadow(0px 0px 6px rgba(212, 175, 55, 0.6))"
                  />
                  <path
                    d="M 80 120 Q 130 110 180 135"
                    fill="none"
                    stroke="#D4AF37"
                    strokeWidth="1.5"
                    strokeDasharray="4 4"
                    opacity="0.8"
                  />
                  <circle cx="145" cy="95" r="4" fill="#D4AF37" />
                  <circle cx="160" cy="130" r="4" fill="#F1EEE8" />
                  <circle cx="125" cy="170" r="3" fill="#D4AF37" />
                </svg>
              </div>
            )}

            {motif === 'perfume' && (
              <div className="relative w-full h-full flex items-center justify-center">
                <div className="relative z-10 w-28 h-44 border border-[#F1EEE8]/20 bg-gradient-to-b from-[#1C1C1C] via-[#0E0E0E] to-[#080808] shadow-2xl flex flex-col items-center justify-between p-3 transition-transform duration-500 group-hover:scale-105">
                  <div className="w-12 h-6 border-b border-[#F1EEE8]/30 bg-[#2A2622] flex items-center justify-center">
                    <div className="w-4 h-1 bg-[#C89F77]" />
                  </div>
                  <div className="text-center py-4">
                    <span className="font-editorial text-xs tracking-[0.3em] uppercase text-[#F1EEE8]/80 block">
                      AURA
                    </span>
                    <span className="text-[9px] tracking-[0.4em] uppercase text-[#C89F77] block mt-1">
                      NOIR
                    </span>
                    <span className="text-[8px] font-technical text-[#A7A39D] block mt-2">
                      50 ML · EXTRAIT
                    </span>
                  </div>
                  <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-[#C89F77]/60 to-transparent" />
                </div>
                <div
                  className="absolute -top-12 w-48 h-80 opacity-30 blur-2xl transform rotate-12 pointer-events-none"
                  style={{ backgroundColor: accentColor }}
                />
              </div>
            )}

            {motif === 'automotive' && (
              <div className="relative w-full h-full flex items-center justify-center">
                <svg
                  viewBox="0 0 400 180"
                  className="w-full max-w-xs transition-transform duration-700"
                  style={{ transform: isHovered ? 'scale(1.06) translateY(-4px)' : 'scale(1)' }}
                >
                  <ellipse cx="200" cy="155" rx="170" ry="12" fill={accentColor} opacity="0.15" filter="blur(8px)" />
                  <path
                    d="M 40 140 Q 90 135 130 115 Q 180 80 260 85 Q 330 90 370 130 L 360 145 Q 200 152 40 140 Z"
                    fill="#16171A"
                    stroke="#4F5666"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M 145 110 Q 185 88 250 92 Q 285 105 300 120 Z"
                    fill="#0A0B0D"
                    stroke={accentColor}
                    strokeWidth="1"
                    opacity="0.8"
                  />
                  <path d="M 330 126 Q 365 132 375 136" stroke="#E2E8F0" strokeWidth="2.5" strokeLinecap="round" />
                  <path d="M 42 136 Q 60 138 75 140" stroke="#E11D48" strokeWidth="2" strokeLinecap="round" />
                  <circle cx="100" cy="142" r="22" fill="#0C0D0F" stroke="#333742" strokeWidth="2" />
                  <circle cx="100" cy="142" r="10" fill="#1C1E24" stroke={accentColor} strokeWidth="1" />
                  <circle cx="300" cy="142" r="22" fill="#0C0D0F" stroke="#333742" strokeWidth="2" />
                  <circle cx="300" cy="142" r="10" fill="#1C1E24" stroke={accentColor} strokeWidth="1" />
                </svg>
              </div>
            )}

            {motif === 'watchmaking' && (
              <div className="relative w-full h-full flex items-center justify-center">
                <svg
                  viewBox="0 0 200 200"
                  className="w-36 h-36 transition-transform duration-1000"
                  style={{ transform: isHovered ? 'rotate(45deg) scale(1.08)' : 'rotate(0deg)' }}
                >
                  <circle cx="100" cy="100" r="85" fill="none" stroke="#262626" strokeWidth="1.5" />
                  <circle cx="100" cy="100" r="70" fill="none" stroke={accentColor} strokeWidth="1" strokeDasharray="4 6" opacity="0.6" />
                  {Array.from({ length: 16 }).map((_, i) => (
                    <line
                      key={i}
                      x1="100"
                      y1="20"
                      x2="100"
                      y2="30"
                      stroke={accentColor}
                      strokeWidth="2.5"
                      transform={`rotate(${i * 22.5} 100 100)`}
                    />
                  ))}
                  <circle cx="100" cy="100" r="38" fill="#141414" stroke="#444" strokeWidth="1.5" />
                  <circle cx="100" cy="100" r="14" fill="#87182E" stroke="#FF4D6D" strokeWidth="1" />
                  <line x1="100" y1="100" x2="140" y2="70" stroke="#F1EEE8" strokeWidth="1.5" strokeLinecap="round" />
                  <line x1="100" y1="100" x2="80" y2="135" stroke={accentColor} strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>
            )}

            {motif === 'fashion' && (
              <div className="relative w-full h-full flex items-center justify-center">
                <svg
                  viewBox="0 0 240 260"
                  className="w-36 h-48 transition-transform duration-700"
                  style={{ transform: isHovered ? 'scale(1.06)' : 'scale(1)' }}
                >
                  <path
                    d="M 120 30 Q 110 50 95 65 Q 60 110 50 190 Q 75 220 120 220 Q 165 220 190 190 Q 180 110 145 65 Q 130 50 120 30 Z"
                    fill="#161413"
                    stroke={accentColor}
                    strokeWidth="1.5"
                  />
                  <path d="M 95 65 Q 120 140 85 200" stroke="#332B25" strokeWidth="2" fill="none" />
                  <path d="M 145 65 Q 120 150 155 200" stroke="#332B25" strokeWidth="2" fill="none" />
                  <ellipse cx="120" cy="25" rx="14" ry="16" fill="#201C19" stroke={accentColor} strokeWidth="1" />
                </svg>
              </div>
            )}

            {motif === 'audio' && (
              <div className="relative w-full h-full flex items-center justify-center">
                <svg
                  viewBox="0 0 300 160"
                  className="w-full max-w-xs transition-transform duration-700"
                  style={{ transform: isHovered ? 'scale(1.06)' : 'scale(1)' }}
                >
                  {[-30, -15, 0, 15, 30].map((offset, idx) => (
                    <path
                      key={idx}
                      d={`M 20 ${80 + offset} Q 80 ${50 - offset * 1.2} 150 80 T 280 ${80 + offset}`}
                      fill="none"
                      stroke={idx === 2 ? '#F1EEE8' : accentColor}
                      strokeWidth={idx === 2 ? '2' : '1'}
                      opacity={idx === 2 ? 0.9 : 0.4}
                    />
                  ))}
                  <circle cx="150" cy="80" r="18" fill="none" stroke={accentColor} strokeWidth="1.5" />
                  <circle cx="150" cy="80" r="4" fill="#F1EEE8" />
                </svg>
              </div>
            )}

            {motif === 'architecture' && (
              <div className="relative w-full h-full flex items-center justify-center">
                <svg
                  viewBox="0 0 240 200"
                  className="w-44 h-40 transition-transform duration-700"
                  style={{ transform: isHovered ? 'scale(1.06)' : 'scale(1)' }}
                >
                  <line x1="20" y1="170" x2="220" y2="170" stroke="#333" strokeWidth="1" />
                  <polygon points="40,170 70,60 130,60 130,170" fill="#181716" stroke={accentColor} strokeWidth="1.5" />
                  <polygon points="130,60 190,90 190,170 130,170" fill="#0D0C0B" stroke="#3A3734" strokeWidth="1" />
                  <line x1="20" y1="30" x2="190" y2="170" stroke={accentColor} strokeWidth="1" strokeDasharray="3 3" opacity="0.5" />
                </svg>
              </div>
            )}
          </div>
        </>
      )}

      {/* Film grain and optical vignette */}
      <div className="absolute inset-0 cinema-grain pointer-events-none opacity-40" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#090909]/80 via-transparent to-black/30 pointer-events-none" />

      {/* Timecode or format tag */}
      {timecode && (
        <div className="absolute top-4 right-4 z-10">
          <span className="font-technical text-[10px] tracking-widest text-[#F1EEE8]/80 bg-[#090909]/80 backdrop-blur-sm px-2.5 py-1 border border-[#F1EEE8]/10 rounded">
            {timecode}
          </span>
        </div>
      )}

      {/* Subtle bottom label on hover */}
      <div className="absolute bottom-4 left-4 z-10 transition-opacity duration-300">
        <span className="font-editorial text-xs italic tracking-wider text-[#A7A39D]">
          {title}
        </span>
      </div>
    </div>
  );
};
