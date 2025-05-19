interface VideoStreamProps {
  streamUrl: string | null;
}

const VideoStream: React.FC<VideoStreamProps> = ({ streamUrl }) => (
  <img
    src={streamUrl || "/video_placeholder.png"}
    alt="Видеопоток"
    className="w-screen h-screen absolute block -z-10"
  />
);

export default VideoStream;
