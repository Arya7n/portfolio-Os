export function Atmosphere({ showGrid = true }: { showGrid?: boolean }) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {showGrid && (
        <div className="horizon-grid absolute -bottom-[35%] left-[-20%] h-[90%] w-[140%] opacity-50" />
      )}
      <div className="noise absolute inset-0" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/35" />
    </div>
  );
}
