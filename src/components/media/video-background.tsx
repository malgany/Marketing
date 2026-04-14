import type { ReactNode, VideoHTMLAttributes } from "react";
import { useEffect, useRef } from "react";
import { cn } from "../../lib/utils";

type VideoBackgroundProps = Omit<
  VideoHTMLAttributes<HTMLVideoElement>,
  "src" | "children"
> & {
  src?: string;
  poster?: string;
  containerClassName?: string;
  videoClassName?: string;
  overlayClassName?: string;
  children?: ReactNode;
};

export function VideoBackground({
  src,
  poster,
  containerClassName,
  videoClassName,
  overlayClassName,
  children,
  autoPlay = true,
  muted = true,
  loop = true,
  playsInline = true,
  ...videoProps
}: VideoBackgroundProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const video = videoRef.current;

    if (!video || !src) {
      return undefined;
    }

    let hls: {
      destroy(): void;
      loadSource(source: string): void;
      attachMedia(media: HTMLMediaElement): void;
    } | null = null;
    let cancelled = false;
    const isHlsSource = src.toLowerCase().includes(".m3u8");

    const loadVideo = async () => {
      if (isHlsSource && video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = src;
        return;
      }

      if (isHlsSource) {
        const { default: Hls } = await import("hls.js");

        if (cancelled) {
          return;
        }

        if (Hls.isSupported()) {
          hls = new Hls();
          hls.loadSource(src);
          hls.attachMedia(video);
          return;
        }
      }

      video.src = src;
    };

    void loadVideo();

    return () => {
      cancelled = true;

      if (hls) {
        hls.destroy();
      }

      video.pause();
      video.removeAttribute("src");
      video.load();
    };
  }, [src]);

  return (
    <div className={cn("absolute inset-0 overflow-hidden", containerClassName)}>
      {src ? (
        <video
          ref={videoRef}
          poster={poster}
          autoPlay={autoPlay}
          muted={muted}
          loop={loop}
          playsInline={playsInline}
          className={cn("h-full w-full object-cover", videoClassName)}
          {...videoProps}
        />
      ) : null}

      {overlayClassName ? <div className={cn("absolute inset-0", overlayClassName)} /> : null}
      {children ? <div className="absolute inset-0">{children}</div> : null}
    </div>
  );
}
