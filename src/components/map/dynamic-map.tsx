"use client"

import { useState, useEffect, useRef } from "react"
import dynamic from "next/dynamic"
import { Button } from "@/components/ui/button"
import { Maximize, Minimize } from "lucide-react"
import type { MapComponentProps } from "./types"

const MapWithNoSSR = dynamic(() => import("./map-component"), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full bg-slate-100 flex items-center justify-center rounded-lg border">
      <p className="text-muted-foreground">Loading map...</p>
    </div>
  ),
})

export default function DynamicMap(props: MapComponentProps) {
  const [isMounted, setIsMounted] = useState<boolean>(false)
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false)
  const mapContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const toggleFullscreen = (): void => {
    if (!document.fullscreenElement) {
      if (mapContainerRef.current?.requestFullscreen) {
        mapContainerRef.current.requestFullscreen().catch((err) => {
          console.error(`Error attempting to enable fullscreen: ${err.message}`)
        })
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen()
      }
    }
  }

  useEffect(() => {
    const handleFullscreenChange = (): void => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener("fullscreenchange", handleFullscreenChange)
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange)
    }
  }, [])

  const computedHeight = isFullscreen ? "100vh" : props.height || "600px"
  const computedWidth = isFullscreen ? "100vw" : props.width || "100%"

  const [height, width] = [computedHeight, computedWidth]  

  if (!isMounted) {
    return (
      <div
        style={{ height: props.height || "600px", width: props.width || "100%" }}
        className="bg-slate-100 flex items-center justify-center rounded-lg border"
      >
        <p className="text-muted-foreground">Loading map...</p>
      </div>
    )
  }

  return (
    <div ref={mapContainerRef} className="relative" style={{ height, width }}>
      <MapWithNoSSR {...props} height={height} width={width} />

      {/* Fullscreen Button */}
      <Button
        variant="secondary"
        size="sm"
        className="absolute top-4 right-4 z-[1000] bg-white shadow-md"
        onClick={toggleFullscreen}
        style={{ pointerEvents: "auto" }}
      >
        {isFullscreen ? <Minimize className="h-4 w-4 mr-1" /> : <Maximize className="h-4 w-4 mr-1" />}
        {isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
      </Button>
    </div>
  )
}
