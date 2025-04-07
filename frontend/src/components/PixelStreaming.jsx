import React, { useEffect, useRef } from 'react';
import { Application } from '@epicgames-ps/lib-pixelstreamingfrontend-ue5.2';

export default function PixelStreaming() {
  const videoRef = useRef(null);

  useEffect(() => {
    const app = new Application({
      settings: {
        useUrlParams: true,  // Auto-connect via URL (e.g., `?peer=localhost`)
      },
    });
    app.videoElement = videoRef.current;
    app.connect();

    return () => app.disconnect();  // Cleanup on unmount
  }, []);

  return (
    <video
      ref={videoRef}
      autoPlay
      playsInline
      style={{ width: '100%', height: '100%', objectFit: 'contain' }}
    />
  );
}