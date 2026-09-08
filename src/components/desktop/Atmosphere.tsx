export function Atmosphere({ showGrid = true }: { showGrid?: boolean }) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {showGrid && (
        <div className="horizon-grid absolute -bottom-[35%] left-[-20%] h-[90%] w-[140%] opacity-40" />
      )}
      <div className="noise absolute inset-0" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/45" />
      <div className="absolute left-1/2 top-[42%] h-[220px] w-[340px] -translate-x-1/2 -translate-y-1/2 opacity-30">
        <div className="mx-auto h-[118px] w-[210px] rounded-md border border-white/12 bg-black/40 shadow-[0_0_40px_rgba(10,132,255,0.12)]" />
        <div className="mx-auto mt-2 h-2 w-8 bg-white/10" />
        <div className="mx-auto mt-3 h-[10px] w-[280px] rounded-sm bg-white/8" />
        <div className="absolute right-2 top-8 h-24 w-10 rounded-sm border border-white/10 bg-black/30" />
      </div>
    </div>
  );
}
