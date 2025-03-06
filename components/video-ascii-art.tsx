"use client"

import { useRef, useEffect } from "react"

interface VideoAsciiArtProps {
  videoSrc: string
}

export default function VideoAsciiArt({ videoSrc }: VideoAsciiArtProps) {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    // Reset video when source changes
    if (videoRef.current) {
      videoRef.current.load()
      videoRef.current.play().catch((e) => {
        console.log("Auto-play prevented:", e)
        // Add a play button or other UI if needed
      })
    }
  }, [videoSrc])

  return (
    <div className="w-full h-full flex items-center justify-center">
      {/* 
        Note: This is a placeholder for the MP4 ASCII art.
        The actual MP4 files will need to be added to the public folder.
      */}
      <div className="relative w-full h-full">
        <video ref={videoRef} className="w-full h-full object-contain" autoPlay muted loop playsInline>
          <source src={videoSrc} type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* Fallback for when video is not available */}
        <div className="absolute inset-0 flex items-center justify-center text-xs text-gray-500 bg-black/50">
          ASCII Art Video Placeholder
          <br />
          (Replace with your MP4)
        </div>
      </div>
    </div>
  )
}

