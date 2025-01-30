import React from "react";
import YouTube from "react-youtube";

const YouTubePlayer = ({ triller }) => {
  const videoId = triller ? new URL(triller).searchParams.get("v") : null;
  
  if (!videoId) return null;

  const opts = {
    playerVars: {
      autoplay: 1,
      controls: 0,
      modestbranding: 1,
      rel: 0,
      showinfo: 0,
      disablekb: 1,
      fs: 0
    }
  };

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <YouTube videoId={videoId} opts={opts} className="w-full h-full" />
    </div>
  );
};

export default YouTubePlayer;
