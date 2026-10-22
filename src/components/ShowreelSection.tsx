import React, { useState, useEffect, useRef } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { Play, Pause, Volume2, VolumeX, Maximize, SlidersHorizontal, Eye, Film } from 'lucide-react';
import { formatTimecode } from '../utils/portfolio';
import { getMotionVariants } from '../utils/motionVariants';

interface ShowreelPointOfView {
  id: string;
  number: string;
  title: string;
  timecode: string;
  seconds: number;
  lens: string;
  shotType: string;
  imageUrl: string;
}

const BRAND_FILM_POINTS_OF_VIEW: ShowreelPointOfView[] = [
  {
    id: 'pov-1',
    number: '01',
    title: 'Consulta personalizada y valoración',
    timecode: '00:01',
    seconds: 1,
    lens: '85mm T1.5 · Arri LF',
    shotType: 'Plano Medio · Análisis Clínico',
    imageUrl: '/assets/aistudio/frame_01_consulta.webp',
  },
  {
    id: 'pov-2',
    number: '02',
    title: 'Mapeo facial con líneas de contorno',
    timecode: '00:03',
    seconds: 3,
    lens: '50mm Anamórfico T2.0',
    shotType: 'Perfil · Partículas Doradas',
    imageUrl: '/assets/aistudio/frame_02_mapeo.webp',
  },
  {
    id: 'pov-3',
    number: '03',
    title: 'Procedimiento de alta tecnología',
    timecode: '00:05',
    seconds: 5,
    lens: 'Macro 100mm T2.8',
    shotType: 'Plano Detalle · Instrumental',
    imageUrl: '/assets/aistudio/frame_03_procedimiento.webp',
  },
  {
    id: 'pov-4',
    number: '04',
    title: 'Transformación Antes y Después',
    timecode: '00:07',
    seconds: 7,
    lens: '75mm Retrato Clínico',
    shotType: 'Doble Encuadre · Simetría',
    imageUrl: '/assets/aistudio/frame_04_comparativa.webp',
  },
];

export const ShowreelSection: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerContainerRef = useRef<HTMLDivElement>(null);

  const shouldReduceMotion = useReducedMotion();
  const motionSystem = getMotionVariants(!!shouldReduceMotion);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(9); // defaults to clip duration in seconds
  const [isCinemascope, setIsCinemascope] = useState(false);
  const [theaterLightsOff, setTheaterLightsOff] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
    };

    const handleLoadedMetadata = () => {
      if (video.duration) {
        setDuration(video.duration);
      }
    };

    const handleEnded = () => {
      setIsPlaying(false);
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('ended', handleEnded);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('ended', handleEnded);
    };
  }, []);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = Number(e.target.value);
    setCurrentTime(time);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
    }
  };

  const toggleFullscreen = () => {
    if (!playerContainerRef.current) return;
    if (!document.fullscreenElement) {
      playerContainerRef.current.requestFullscreen?.().catch(() => {});
    } else {
      document.exitFullscreen?.().catch(() => {});
    }
  };

  return (
    <motion.section
      id="showreel"
      variants={motionSystem.pageContainer}
      initial="hidden"
      animate="visible"
      className={`py-12 sm:py-20 px-6 sm:px-8 max-w-7xl mx-auto transition-colors duration-700 ${
        theaterLightsOff ? 'bg-[#030303]' : ''
      }`}
      aria-label="Showreel Cinematográfico"
    >
      {/* Header with Masked Title Reveal */}
      <motion.div
        variants={motionSystem.fadeUp}
        className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 pb-4 border-b border-[#F1EEE8]/10"
      >
        <div>
          <span className="text-xs tracking-[0.25em] uppercase text-[#D4AF37] block mb-2 font-medium">
            Sala de Proyección Privada · Master Oficial
          </span>
          <div className="overflow-hidden">
            <motion.h2
              variants={motionSystem.headlineMaskLine}
              className="text-3xl sm:text-5xl font-bold tracking-tight text-[#F1EEE8]"
            >
              Showreel 1080p
            </motion.h2>
          </div>
        </div>
        <div className="flex items-center gap-3 text-xs font-technical">
          <button
            onClick={() => setTheaterLightsOff(!theaterLightsOff)}
            className={`px-3 py-1.5 rounded-lg border text-xs transition-all flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#D4AF37] ${
              theaterLightsOff
                ? 'bg-[#D4AF37] text-black font-bold border-[#D4AF37]'
                : 'bg-black/60 text-[#A7A39D] border-white/10 hover:text-white'
            }`}
          >
            <Eye size={12} />
            <span>{theaterLightsOff ? 'Luces: Apagadas (Modo Cine)' : 'Luces: Encendidas'}</span>
          </button>
        </div>
      </motion.div>

      {/* Real HTML5 Video Player Container */}
      <motion.div
        variants={motionSystem.scaleUp}
        ref={playerContainerRef}
        className={`relative w-full rounded-2xl overflow-hidden bg-black border border-white/10 shadow-2xl transition-all duration-700 ${
          isCinemascope ? 'aspect-[2.39/1]' : 'aspect-video'
        } flex flex-col justify-between group ${
          theaterLightsOff ? 'shadow-[0_0_50px_rgba(212,175,55,0.15)] ring-1 ring-[#D4AF37]/30' : ''
        }`}
      >
        {/* Actual Video Tag */}
        <video
          ref={videoRef}
          src="/assets/aistudio/Lipopada_procedure_medical_sequence_1080p_20261004173714_94ae5efd.mp4"
          playsInline
          muted={isMuted}
          className="absolute inset-0 w-full h-full object-cover"
          onClick={togglePlay}
        />

        {/* Ambient Film Grain & Letterbox if cinemascope */}
        <div className="absolute inset-0 cinema-grain opacity-25 pointer-events-none" />
        {isCinemascope && (
          <>
            <div className="absolute top-0 left-0 right-0 h-5 bg-black z-10 pointer-events-none" />
            <div className="absolute bottom-0 left-0 right-0 h-5 bg-black z-10 pointer-events-none" />
          </>
        )}

        {/* Top Player HUD */}
        <div className="relative z-20 p-5 flex items-center justify-between text-xs font-technical text-[#A7A39D] bg-gradient-to-b from-black/80 to-transparent">
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-[#D4AF37] animate-pulse' : 'bg-white/40'}`} />
            <span className="text-[#F1EEE8] tracking-widest">{isPlaying ? 'REPRODUCIENDO' : 'PAUSADO'}</span>
            <span className="hidden sm:inline text-white/50" aria-hidden="true">·</span>
            <span className="hidden sm:inline text-white/70">1080p MASTER DR. LUCIANO</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsCinemascope(!isCinemascope)}
              className="px-2.5 py-1 rounded bg-black/60 hover:bg-black/90 border border-white/10 text-xs text-[#F1EEE8] flex items-center gap-1.5 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#D4AF37]"
              aria-label="Alternar formato 16:9 y 2.39:1"
            >
              <SlidersHorizontal size={12} className="text-[#D4AF37]" />
              <span>{isCinemascope ? '2.39:1 Scope' : '16:9 Full'}</span>
            </button>
          </div>
        </div>

        {/* Big Center Play Button (Visible when paused) */}
        {!isPlaying && (
          <div className="relative z-20 flex items-center justify-center my-auto pointer-events-none">
            <button
              onClick={togglePlay}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-black/70 hover:bg-[#D4AF37] text-white hover:text-black border border-white/20 hover:border-transparent flex items-center justify-center transition-all duration-300 shadow-2xl backdrop-blur-md pointer-events-auto group-hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37]"
              aria-label="Reproducir video"
            >
              <Play size={26} className="ml-1" />
            </button>
          </div>
        )}

        {/* Bottom Interactive Transport Scrub Bar */}
        <div className="relative z-20 p-5 bg-gradient-to-t from-black via-black/90 to-transparent flex flex-col gap-2.5">
          {/* Progress Slider */}
          <div className="relative w-full flex items-center">
            <input
              type="range"
              min="0"
              max={duration || 10}
              step="0.1"
              value={currentTime}
              onChange={handleSeek}
              aria-label="Posición de reproducción"
              className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-[#D4AF37] focus:outline-none"
            />
          </div>

          {/* Controls Bar */}
          <div className="flex items-center justify-between text-xs font-technical text-[#A7A39D]">
            <div className="flex items-center gap-4">
              <button
                onClick={togglePlay}
                className="text-[#F1EEE8] hover:text-[#D4AF37] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#D4AF37] rounded"
                aria-label={isPlaying ? 'Pausar' : 'Reproducir'}
              >
                {isPlaying ? <Pause size={15} /> : <Play size={15} />}
              </button>

              <button
                onClick={toggleMute}
                className="text-[#F1EEE8] hover:text-[#D4AF37] transition-colors flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#D4AF37] rounded"
                aria-label={isMuted ? 'Activar sonido' : 'Silenciar sonido'}
              >
                {isMuted ? <VolumeX size={15} /> : <Volume2 size={15} className="text-[#D4AF37]" />}
                <span className="text-xs hidden sm:inline">{isMuted ? 'Muted' : 'Audio On'}</span>
              </button>

              <span className="tabular-nums text-white/90">
                {formatTimecode(currentTime)} / {formatTimecode(duration)}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={toggleFullscreen}
                className="text-[#F1EEE8] hover:text-[#D4AF37] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#D4AF37] rounded"
                aria-label="Pantalla completa"
              >
                <Maximize size={15} />
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* 4 Puntos de Vista de Dirección Cinematográfica (Brand Films) */}
      <motion.div
        variants={motionSystem.fadeUp}
        className="mt-6 p-5 rounded-2xl bg-[#121212] border border-white/10 shadow-xl"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Film size={15} className="text-[#D4AF37]" />
            <h3 className="text-xs uppercase tracking-[0.2em] font-technical font-bold text-[#F1EEE8]">
              Fotogramas & Dirección Cinematográfica · 4 Puntos de Vista
            </h3>
          </div>
          <span className="text-xs text-[#A7A39D] font-technical">
            Haz clic en cualquier fotograma para saltar a ese punto exacto en el video
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {BRAND_FILM_POINTS_OF_VIEW.map((pov, idx) => {
            const isCurrent =
              currentTime >= pov.seconds &&
              (idx === BRAND_FILM_POINTS_OF_VIEW.length - 1 ||
                currentTime < BRAND_FILM_POINTS_OF_VIEW[idx + 1].seconds);

            return (
              <button
                key={pov.id}
                type="button"
                onClick={() => {
                  if (videoRef.current) {
                    videoRef.current.currentTime = pov.seconds;
                    videoRef.current
                      .play()
                      .then(() => setIsPlaying(true))
                      .catch(() => {});
                  }
                }}
                className={`p-2.5 rounded-xl text-left border transition-all group overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37] ${
                  isCurrent
                    ? 'bg-[#1C1C1C] border-[#D4AF37] ring-1 ring-[#D4AF37]/50 shadow-[0_0_20px_rgba(212,175,55,0.2)]'
                    : 'bg-[#0B0B0B] border-white/10 hover:border-white/30 hover:bg-[#141414]'
                }`}
              >
                <div className="relative aspect-video rounded-lg overflow-hidden mb-2 bg-black">
                  <img
                    src={pov.imageUrl}
                    alt={pov.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 cinema-grain opacity-20 pointer-events-none" />

                  <span className="absolute top-1.5 left-1.5 text-[9px] font-technical bg-[#D4AF37] text-black font-bold px-1.5 py-0.5 rounded">
                    {pov.number}
                  </span>

                  <span className="absolute top-1.5 right-1.5 text-[9px] font-technical bg-black/80 text-[#F1EEE8] px-1.5 py-0.5 rounded border border-white/20">
                    TC {pov.timecode}
                  </span>

                  {isCurrent && (
                    <span className="absolute bottom-1.5 left-1.5 text-[9px] font-technical bg-red-600 text-white font-bold px-1.5 py-0.5 rounded flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                      <span>EN PANTALLA</span>
                    </span>
                  )}

                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 text-xs text-[#D4AF37] font-technical font-bold">
                    <Play size={14} fill="currentColor" />
                    <span>Saltar a {pov.timecode}</span>
                  </div>
                </div>

                <h4 className="text-xs font-bold text-[#F1EEE8] group-hover:text-[#D4AF37] transition-colors truncate">
                  {pov.title}
                </h4>
                <div className="flex items-center justify-between text-[10px] font-technical text-[#A7A39D] mt-1">
                  <span className="truncate">{pov.lens}</span>
                  <span className="text-white/40">{pov.shotType.split('·')[0]}</span>
                </div>
              </button>
            );
          })}
        </div>
      </motion.div>

      {/* Technical Master Specs Strip */}
      <motion.div
        variants={motionSystem.fadeUp}
        className="mt-6 p-5 rounded-xl bg-[#121212] border border-white/10 flex flex-wrap items-center justify-between gap-4 text-xs font-technical text-[#A7A39D]"
      >
        <div className="flex items-center gap-4">
          <span className="text-[#D4AF37] font-bold">FICHA DE MASTERIZACIÓN:</span>
          <span>ARRI Look Profile</span>
          <span className="text-white/20" aria-hidden="true">·</span>
          <span>Stereo 48kHz / 24-bit</span>
          <span className="text-white/20" aria-hidden="true">·</span>
          <span>Grading DaVinci Studio</span>
        </div>
        <div className="text-white/60 text-xs">
          Dirección & Fotografía por Lumen & Form
        </div>
      </motion.div>
    </motion.section>
  );
};
