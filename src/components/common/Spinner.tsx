export default function Spinner({ className = "" }: { className?: string }) {
  return (
    <div
      className={`size-6 animate-spin rounded-full border-2 border-current border-t-transparent ${className}`}
      role="status"
      aria-label="로딩 중"
    />
  );
}
