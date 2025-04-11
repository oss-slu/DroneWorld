import React, { useEffect, useRef } from 'react';
import { Application } from '@epicgames-ps/lib-pixelstreamingfrontend-ue5.2';

export default function PixelStreaming() {
  const videoRef = useRef(null);

  useEffect(() => {
    const app = new Application({
      settings: {
        peerOptions: {
          host: 'localhost',
          port: 80
        }
      },
      
      initialSettings: {
        StartVideoMuted: true,
        MatchViewportResolution: true
      }
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