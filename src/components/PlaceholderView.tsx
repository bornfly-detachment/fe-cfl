interface PlaceholderViewProps {
  name?: string
}

export default function PlaceholderView({ name = 'Legacy view' }: PlaceholderViewProps) {
  return (
    <div className="h-full w-full overflow-auto bg-[#05060a] p-6 text-slate-200">
      <div className="rounded-2xl border border-slate-700/60 bg-slate-900/60 p-5 shadow-2xl">
        <div className="text-xs uppercase tracking-[0.3em] text-cyan-300/70">fe-cfl external boundary</div>
        <h2 className="mt-3 text-2xl font-semibold text-white">{name}</h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
          This route is outside the four fe-cfl v2 migration targets. The PRVSE world panel keeps the same import contract and renders a local boundary placeholder instead of pulling the entire legacy frontend into this minimal runtime.
        </p>
      </div>
    </div>
  )
}
