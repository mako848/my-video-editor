import React, { useRef, useState } from "react";
import "./App.css";

export default function App() {
  const inputRef = useRef(null);
  const [video, setVideo] = useState(null);
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [brightness, setBrightness] = useState(100);
  const [speed, setSpeed] = useState(1);

  const handleVideo = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setVideo(URL.createObjectURL(file));
  };

  return (
    <div className="editor">
      <header className="topbar">
        <div>
          <h1>Maako Video Edit</h1>
          <span>Advanced Mobile Video Editor</span>
        </div>

        <button
          className="upload"
          onClick={() => inputRef.current?.click()}
        >
          + Add Video
        </button>

        <input
          ref={inputRef}
          type="file"
          accept="video/*"
          hidden
          onChange={handleVideo}
        />
      </header>

      <main>
        <section className="preview">
          {video ? (
            <video
              src={video}
              controls
              style={{
                filter: `brightness(${brightness}%)`,
              }}
              onPlay={() => setPlaying(true)}
              onPause={() => setPlaying(false)}
            />
          ) : (
            <div className="empty">
              <div className="bigIcon">🎬</div>
              <h2>Upload a video</h2>
              <p>Start editing your video here</p>
              <button
                className="mainButton"
                onClick={() => inputRef.current?.click()}
              >
                Choose Video
              </button>
            </div>
          )}
        </section>

        <section className="tools">
          <button>✂️ Trim</button>
          <button>🔊 Audio</button>
          <button>🎨 Filters</button>
          <button>📝 Text</button>
          <button>✨ Effects</button>
          <button>🖼️ Overlay</button>
        </section>

        <section className="controls">
          <div className="control">
            <label>☀️ Brightness: {brightness}%</label>
            <input
              type="range"
              min="20"
              max="200"
              value={brightness}
              onChange={(e) => setBrightness(e.target.value)}
            />
          </div>

          <div className="control">
            <label>🔊 Volume: {Math.round(volume * 100)}%</label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={(e) => {
                const value = Number(e.target.value);
                setVolume(value);
              }}
            />
          </div>

          <div className="control">
            <label>⚡ Speed: {speed}x</label>
            <select
              value={speed}
              onChange={(e) => setSpeed(Number(e.target.value))}
            >
              <option value="0.25">0.25x</option>
              <option value="0.5">0.5x</option>
              <option value="1">1x</option>
              <option value="1.5">1.5x</option>
              <option value="2">2x</option>
              <option value="3">3x</option>
            </select>
          </div>
        </section>

        <section className="timeline">
          <div className="timelineTitle">
            <b>Timeline</b>
            <span>{playing ? "▶ Playing" : "⏸ Ready"}</span>
          </div>

          <div className="track">
            <div className="clip">🎞️ Video Clip</div>
          </div>
        </section>

        <button className="export">
          ⬇️ Export Video
        </button>
      </main>
    </div>
  );
              }
