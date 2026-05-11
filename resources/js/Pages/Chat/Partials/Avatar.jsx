export default function Avatar({ src, alt, className = "" }) {
  function cn(...a) {
    return a.filter(Boolean).join(" ");
  }

  return (
    <img
      src={src}
      alt={alt}
      className={cn(
        "h-11 w-11 rounded-full object-cover bg-neutral-200",
        className
      )}
    />
  );
}