import React, { useState, useRef, useEffect } from "react";
import {
  Play,
  Pause,
  RotateCcw,
  RotateCw,
  Volume2,
  VolumeX,
  Download,
  Radio,
  Sparkles
} from "lucide-react";
import AudioWaveform from "./AudioWaveform";

export default function AudioPlayer({ audioUrl, destination = "Tour", onEnded }) {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    // Reset state on new audioUrl
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
  }, [audioUrl]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch((err) => {
        console.warn("Autoplay blocked or playback failed:", err);
      });
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration || 0);
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);
    if (onEnded) onEnded();
  };

  const handleSeek = (e) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  };

  const skipTime = (seconds) => {
    if (!audioRef.current) return;
    const nextTime = Math.min(Math.max(audioRef.current.currentTime + seconds, 0), duration || 1000);
    audioRef.current.currentTime = nextTime;
    setCurrentTime(nextTime);
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    audioRef.current.muted = nextMuted;
  };

  const handleVolumeChange = (e) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (audioRef.current) {
      audioRef.current.volume = val;
      if (val === 0) {
        setIsMuted(true);
        audioRef.current.muted = true;
      } else if (isMuted) {
        setIsMuted(false);
        audioRef.current.muted = false;
      }
    }
  };

  const handleDownload = () => {
    if (!audioUrl) return;
    const a = document.createElement("a");
    a.href = audioUrl;
    a.download = `${destination.toLowerCase().replace(/\s+/g, "_")}_audio_guide.mp3`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const formatTime = (secs) => {
    if (isNaN(secs) || secs < 0) return "0:00";
    const minutes = Math.floor(secs / 60);
    const seconds = Math.floor(secs % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="w-full rounded-3xl p-6 border shadow-2xl transition-all duration-300 bg-white dark:bg-[#0E0F17] border-slate-200 dark:border-white/10 space-y-5">
      <audio
        ref={audioRef}
        src={audioUrl}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
        preload="metadata"
      />

      {/* Header Info & Download */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-purple-500/15 border border-purple-500/25 flex items-center justify-center text-purple-600 dark:text-purple-400">
            <Radio className={`w-6 h-6 ${isPlaying ? "animate-pulse text-red-500" : ""}`} />
          </div>
          <div>
            <h4 className="font-extrabold text-base sm:text-lg text-slate-900 dark:text-white leading-tight">
              {destination} Audio Tour
            </h4>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs font-semibold text-purple-600 dark:text-purple-400">
                Murf Falcon-2 Audio
              </span>
              <span className="text-[10px] text-slate-400">•</span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Studio Quality MP3
              </span>
            </div>
          </div>
        </div>

        {/* Waveform Visualization strip */}
        <div className="hidden lg:block">
          <AudioWaveform isPlaying={isPlaying} barCount={26} />
        </div>

        <button
          type="button"
          onClick={handleDownload}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-white border border-slate-200 dark:border-slate-700 transition-all hover:scale-105 cursor-pointer self-start sm:self-auto shadow-sm"
        >
          <Download className="w-4 h-4 text-purple-600 dark:text-purple-400" />
          <span>Download Audio</span>
        </button>
      </div>

      {/* Scrubber slider bar */}
      <div className="space-y-1.5">
        <div className="relative w-full flex items-center">
          <input
            type="range"
            min={0}
            max={duration || 100}
            step={0.1}
            value={currentTime}
            onChange={handleSeek}
            className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-slate-200 dark:bg-slate-800 accent-purple-600"
          />
        </div>
        <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 font-mono">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Control Buttons Strip */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
        {/* Playback Controls */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => skipTime(-10)}
            title="Rewind 10 seconds"
            className="p-2.5 rounded-xl text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={togglePlay}
            className="w-13 h-13 rounded-2xl bg-gradient-to-r from-purple-600 via-red-500 to-amber-500 text-white flex items-center justify-center shadow-lg shadow-purple-500/25 hover:scale-105 active:scale-95 transition-all cursor-pointer ring-2 ring-white/20"
          >
            {isPlaying ? (
              <Pause className="w-6 h-6 fill-white" />
            ) : (
              <Play className="w-6 h-6 fill-white ml-0.5" />
            )}
          </button>

          <button
            type="button"
            onClick={() => skipTime(10)}
            title="Fast forward 10 seconds"
            className="p-2.5 rounded-xl text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
          >
            <RotateCw className="w-4 h-4" />
          </button>
        </div>

        {/* Volume Controls */}
        <div className="flex items-center gap-2.5 bg-slate-100 dark:bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-white/10">
          <button
            type="button"
            onClick={toggleMute}
            className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
          >
            {isMuted || volume === 0 ? (
              <VolumeX className="w-4 h-4 text-red-500" />
            ) : (
              <Volume2 className="w-4 h-4" />
            )}
          </button>

          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={isMuted ? 0 : volume}
            onChange={handleVolumeChange}
            className="w-20 sm:w-24 h-1.5 rounded-lg appearance-none cursor-pointer bg-slate-300 dark:bg-slate-800 accent-purple-600"
          />
        </div>
      </div>
    </div>
  );
}
