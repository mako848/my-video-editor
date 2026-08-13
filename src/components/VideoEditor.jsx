import React, { useEffect, useRef, useState } from "react";

export default function VideoEditor() {
  const videoRef = useRef(null);
  const fileInputRef = useRef(null);

  const [videoUrl, setVideoUrl] = useState("");
  const [fileName, setFileName] = useState("");
  const [playing, setPlaying] = useState(false);

  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturation, setSaturation] = useState(100);
  const [blur, setBlur] = useState(0);
  const [rotate, setRotate] = useState(0);
  const [zoom, setZoom] = useState(100);
  const [volume, setVolume] = useState(100);

  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  const [text, setText] = useState("");
  const [textSize, setTextSize] = useState(32);
  const [textColor, setTextColor] = useState("#ffffff");

  const [ratio, setRatio] = useState("16/9");

  useEffect(() => {
    return () => {
      if (videoUrl) URL.revokeObjectURL(videoUrl);
    };
  }, [videoUrl]);

  const uploadVideo = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("video/")) {
      alert("Please select a video file.");
      return;
    }

    if (videoUrl) URL.revokeObjectURL(videoUrl);

    const url = URL.createObjectURL(file);
    setVideoUrl(url);
    setFileName(file.name);
    setStartTime(0);
    setEndTime(0);
    setCurrentTime(0);
  };

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play();
      setPlaying(true);
    } else {
      video.pause();
      setPlaying(false);
    }
  };

  const onLoadedMetadata = () => {
    const video = videoRef.current;
    if (!video) return;

    setEndTime(video.duration);
  };

  const onTimeUpdate = () => {
    const video = videoRef.current;
    if (!video) return;

    setCurrentTime(video.currentTime);

    if (endTime > 0 && video.currentTime >= endTime) {
      video.pause();
      video.currentTime = startTime;
      setPlaying(false);
    }
  };

  const seekVideo = (value) => {
    const video = videoRef.current;
    if (!video) return;

    video.currentTime = Number(value);
    setCurrentTime(Number(value));
  };

  const resetEffects = () => {
    setBrightness(100);
    setContrast(100);
    setSaturation(100);
    setBlur(0);
    setRotate(0);
    setZoom(100);
    setVolume(100);
  };

  const formatTime = (seconds) => {
    if (!Number.isFinite(seconds)) return "00:00";

    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);

    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(
      2,
      "0"
    )}`;
  };

  const filterStyle = {
    filter: `
      brightness(${brightness}%)
      contrast(${contrast}%)
      saturate(${saturation}%)
      blur(${blur}px)
    `,
    transform: `rotate(${rotate}deg) scale(${zoom / 100})`,
  };

  return (
    <div className="video-editor">
      <div className="editor-header">
        <div>
          <h1>MAKO Video Editor</h1>
          <p>Advanced Mobile Video Editor</p>
        </div>

        <button
          className="upload-button"
          onClick={() => fileInputRef.current?.click()}
        >
          ＋ Upload Video
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept="video/*"
          onChange={uploadVideo}
          hidden
        />
      </div>

      <div className="editor-layout">
        <aside className="tools-panel">
          <h3>Tools</h3>

          <button onClick={() => setBrightness(100)}>☀️ Light</button>
          <button onClick={() => setContrast(100)}>◐ Contrast</button>
          <button onClick={() => setSaturation(100)}>🎨 Color</button>
          <button onClick={() => setRotate((r) => r + 90)}>⟳ Rotate</button>

          <label>Aspect Ratio</label>
          <select value={ratio} onChange={(e) => setRatio(e.target.value)}>
            <option value="16/9">YouTube 16:9</option>
            <option value="9/16">Shorts / Reels 9:16</option>
            <option value="1/1">Instagram 1:1</option>
            <option value="4/5">Instagram 4:5</option>
          </select>

          <button onClick={resetEffects}>↺ Reset Effects</button>
        </aside>

        <main className="workspace">
          <div
            className="preview-container"
            style={{ aspectRatio: ratio }}
          >
            {videoUrl ? (
              <>
                <video
                  ref={videoRef}
                  src={videoUrl}
                  style={filterStyle}
                  onLoadedMetadata={onLoadedMetadata}
                  onTimeUpdate={onTimeUpdate}
                  onPlay={() => setPlaying(true)}
                  onPause={() => setPlaying(false)}
                  playsInline
                />

                {text && (
                  <div
                    className="video-text"
                    style={{
                      fontSize: `${textSize}px`,
                      color: textColor,
                    }}
                  >
                    {text}
                  </div>
                )}
              </>
            ) : (
              <div className="empty-preview">
                <div className="upload-icon">🎬</div>
                <h2>No video selected</h2>
                <p>Upload a video to start editing</p>
              </div>
            )}
          </div>

          {videoUrl && (
            <div className="player-controls">
              <button onClick={togglePlay}>
                {playing ? "⏸ Pause" : "▶ Play"}
              </button>

              <span>{formatTime(currentTime)}</span>

              <input
                type="range"
                min="0"
                max={endTime || 0}
                step="0.01"
                value={currentTime}
                onChange={(e) => seekVideo(e.target.value)}
              />

              <span>{formatTime(endTime)}</span>
            </div>
          )}

          <div className="timeline">
            <div className="timeline-title">
              <strong>Timeline</strong>
              {fileName && <span>{fileName}</span>}
            </div>

            {videoUrl ? (
              <>
                <div className="trim-row">
                  <label>
                    Start
                    <input
                      type="number"
                      min="0"
                      max={endTime}
                      step="0.1"
                      value={startTime}
                      onChange={(e) =>
                        setStartTime(
                          Math.min(Number(e.target.value), endTime)
                        )
                      }
                    />
                  </label>

                  <label>
                    End
                    <input
                      type="number"
                      min="0"
                      max={endTime}
                      step="0.1"
                      value={endTime}
                      onChange={(e) =>
                        setEndTime(
                          Math.max(Number(e.target.value), startTime)
                        )
                      }
                    />
                  </label>
                </div>

                <div className="timeline-track">
                  <div
                    className="timeline-progress"
                    style={{
                      width:
                        endTime > 0
                          ? `${(currentTime / endTime) * 100}%`
                          : "0%",
                    }}
                  />
                </div>
              </>
            ) : (
              <p className="timeline-empty">
                Upload a video to show timeline
              </p>
            )}
          </div>
        </main>

        <aside className="properties-panel">
          <h3>Adjust</h3>

          <Slider
            label="Brightness"
            value={brightness}
            min={0}
            max={200}
            onChange={setBrightness}
          />

          <Slider
            label="Contrast"
            value={contrast}
            min={0}
            max={200}
            onChange={setContrast}
          />

          <Slider
            label="Saturation"
            value={saturation}
            min={0}
            max={200}
            onChange={setSaturation}
          />

          <Slider
            label="Blur"
            value={blur}
            min={0}
            max={20}
            onChange={setBlur}
          />

          <Slider
            label="Zoom"
            value={zoom}
            min={50}
            max={200}
            onChange={setZoom}
          />

          <Slider
            label="Volume"
            value={volume}
            min={0}
            max={100}
            onChange={(value) => {
              setVolume(value);
              if (videoRef.current) {
                videoRef.current.volume = value / 100;
              }
            }}
          />

          <div className="property-section">
            <h3>Text</h3>

            <input
              type="text"
              placeholder="Enter text..."
              value={text}
              onChange={(e) => setText(e.target.value)}
            />

            <label>Text Size</label>
            <input
              type="range"
              min="12"
              max="100"
              value={textSize}
              onChange={(e) => setTextSize(Number(e.target.value))}
            />

            <label>Text Color</label>
            <input
              type="color"
              value={textColor}
              onChange={(e) => setTextColor(e.target.value)}
            />
          </div>
        </aside>
      </div>
    </div>
  );
}

function Slider({ label, value, min, max, onChange }) {
  return (
    <div className="slider-control">
      <div className="slider-label">
        <span>{label}</span>
        <strong>{Math.round(value)}</strong>
      </div>

      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </div>
  );
                 }
