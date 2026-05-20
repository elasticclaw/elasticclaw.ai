export function YouTubeVideo({
  title,
  videoId,
  className = "",
}: {
  title: string;
  videoId: string;
  className?: string;
}) {
  return (
    <div
      className={`overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950 shadow-2xl ${className}`}
    >
      <iframe
        className="aspect-video w-full"
        loading="lazy"
        src={`https://www.youtube-nocookie.com/embed/${videoId}`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
      />
    </div>
  );
}
