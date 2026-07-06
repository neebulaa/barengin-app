import React, { useId } from "react";

// Grafik garis+area sederhana (SVG) untuk tren penjualan bulanan.
// data: [{ label: "Jan", value: 12 }, ...]
export default function SalesChart({ data = [], height = 260 }) {
    const gid = useId().replace(/:/g, "");
    const w = 640;
    const h = height;
    const padX = 24;
    const padTop = 24;
    const padBottom = 34;

    const values = data.map((d) => Number(d.value) || 0);
    const max = Math.max(1, ...values);
    const total = values.reduce((a, b) => a + b, 0);
    const stepX = data.length > 1 ? (w - padX * 2) / (data.length - 1) : 0;
    const chartH = h - padTop - padBottom;

    const x = (i) => padX + i * stepX;
    const y = (v) => padTop + (1 - v / max) * chartH;

    const pts = data.map((d, i) => [x(i), y(Number(d.value) || 0)]);
    const linePath = pts.map((p, i) => (i === 0 ? "M" : "L") + p[0].toFixed(1) + " " + p[1].toFixed(1)).join(" ");
    const areaPath = pts.length
        ? linePath + ` L ${x(data.length - 1).toFixed(1)} ${padTop + chartH} L ${x(0).toFixed(1)} ${padTop + chartH} Z`
        : "";

    // Garis grid horizontal (4 baris)
    const gridLines = [0, 0.25, 0.5, 0.75, 1].map((f) => padTop + f * chartH);

    return (
        <div className="relative w-full">
            <svg viewBox={`0 0 ${w} ${h}`} className="w-full" preserveAspectRatio="none" style={{ height }}>
                <defs>
                    <linearGradient id={`grad-${gid}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="currentColor" stopOpacity="0.22" />
                        <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
                    </linearGradient>
                </defs>

                {/* Grid */}
                {gridLines.map((gy, i) => (
                    <line key={i} x1={padX} y1={gy} x2={w - padX} y2={gy} stroke="#eef2f7" strokeWidth="1" />
                ))}

                {total > 0 && (
                    <g className="text-primary-700">
                        <path d={areaPath} fill={`url(#grad-${gid})`} />
                        <path d={linePath} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                        {pts.map((p, i) => (
                            <circle key={i} cx={p[0]} cy={p[1]} r="4" fill="#fff" stroke="currentColor" strokeWidth="2.5" />
                        ))}
                    </g>
                )}
            </svg>

            {/* Label bulan */}
            <div className="flex justify-between px-4">
                {data.map((d, i) => (
                    <span key={i} className="text-xs font-medium text-neutral-400">{d.label}</span>
                ))}
            </div>
        </div>
    );
}
