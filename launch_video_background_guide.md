# SpaceX-Style Video Background Guide

This document outlines how to successfully implement a full-screen, premium SpaceX-style background video layout for the **Live Launch Monitor** section. 

It details the technical specifications, styling classes, and source requirements needed to display a high-quality launch video looping in the background while keeping the section title, description, and action button cleanly overlayed on top.

---

## 1. Technical Requirements for the Video Asset

To ensure optimal performance and universal browser compatibility, the video file should meet the following specifications:

*   **Format**: `.mp4` (H.264 video codec, AAC audio or completely stripped audio track). Avoid `.webm` since it is not natively supported by all platforms (e.g., Safari on older iOS/macOS configurations).
*   **No Intro/Slate Cards**: Ensure the video starts immediately with the visual action. Raw broadcast files from space agencies often include a 5-10 second static card at the beginning detailing camera parameters or date records; these must be trimmed out.
*   **Compression & Resolution**: Use a resolution of **1080p** or **720p**. Highly compress the video (recommended target file size is **under 10MB**) to ensure immediate loading and smooth buffering on all network speeds.
*   **Seamless Looping**: Select a clip where the beginning and end frames transition smoothly, or where the camera is stationary to avoid a jarring visual "jump" when the video loops.

---

## 2. HTML5 `<video>` Attributes

Browsers enforce strict policies regarding video autoplay to protect user bandwidth and prevent unexpected sound. To ensure the video plays automatically on page load:

*   `autoPlay`: Automatically starts playing.
*   `muted`: **Crucial.** Browsers will block any autoplaying video that is not muted.
*   `loop`: Repeats the video infinitely once it finishes.
*   `playsInline`: Ensures the video plays inline rather than opening in fullscreen mode on mobile Safari/iOS.

---

## 3. Styling & Layering (Z-Index)

To overlay the text on top of the video background, we use absolute positioning and three main layers of depth (`z-index`):

1.  **Bottom Layer (`z-0`)**: The `<video>` element, styled with `object-cover` so it stretches to fill the container without distorting its aspect ratio.
2.  **Middle Layer (`z-10`)**: A dark gradient overlay (`bg-gradient-to-t`) that darkens the video from the bottom and top. This is essential to guarantee the white text remains highly legible against changing light/smoke in the launch video.
3.  **Top Layer (`z-20`)**: The text and button content container, styled with `relative` and appropriate layout styling.

---

## 4. Implementation Template (React + Tailwind)

Below is the complete, copy-pasteable React component using the landing page's design language:

```tsx
import React from 'react';

// Replace this URL with your hosted, trimmed launch video file
const VIDEO_SOURCE_URL = "https://your-server-or-cdn.com/videos/spacex-launch-trimmed.mp4";

export function LaunchMonitoringSection() {
  return (
    <section 
      id="launch-monitor" 
      className="relative w-full h-screen overflow-hidden flex flex-col justify-end pb-24 px-8 md:px-16 lg:px-24 bg-black"
    >
      {/* 1. Background Video */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0"
      >
        <source src={VIDEO_SOURCE_URL} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* 2. Dark Overlay for Text Readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-black/55 z-10" />

      {/* 3. Front Content Container */}
      <div className="relative z-20 w-full max-w-4xl flex flex-col items-start text-left">
        {/* Brand Serif Heading */}
        <h2 className="text-5xl md:text-7xl font-heading italic text-white leading-tight max-w-4xl tracking-tight mb-6">
          Live Launch Monitor
        </h2>
        
        {/* Brand Body Paragraph */}
        <p className="text-lg md:text-xl text-slate-300 font-body font-light leading-relaxed max-w-2xl mb-8">
          Track upcoming and ongoing orbital launches worldwide. Monitor launch vehicles, agencies, mission profiles, and countdown timers in real-time.
        </p>

        {/* Brand Pill-Shaped Button */}
        <button className="group px-6 py-3 text-sm font-medium text-white font-body rounded-full border border-white/20 hover:border-white/50 hover:bg-white hover:text-black transition-all duration-300 flex items-center gap-2 cursor-pointer bg-white/5 backdrop-blur-sm">
          Explore Launches
          <svg 
            className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Bottom border separator */}
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent z-20" />
    </section>
  );
}
```

---

## 5. Sourcing and Hosting Assets

*   **Sourcing Free Launch Videos**:
    *   **Pexels / Pixabay**: Search for "rocket launch" or "spacecraft takeoff". You can download free clips.
    *   **NASA SVS**: Search for "launch" or specific mission launches. Once on the asset page, click "Download" and select a low-resolution MP4 option (e.g., 720p or mobile).
*   **Where to Host the File**:
    *   **Local Project Folder**: Place the trimmed `.mp4` file directly in the `/public` folder of your project (e.g., `/public/videos/launch-bg.mp4`). You can then reference it as `src="/videos/launch-bg.mp4"`.
    *   **External CDN**: Host the file on services like AWS S3, Google Cloud Storage, or Cloudinary, and use the direct HTTPS link.
