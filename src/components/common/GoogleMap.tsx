import { cn } from "@/lib/utils";

export interface MapMarker {
  id: string;
  lat: number;
  lng: number;
  label: string;
  sublabel?: string;
  color: string;
  selected?: boolean;
}

export interface MapGeofence {
  lat: number;
  lng: number;
  radius: number;
  color: string;
}

interface Props {
  center: { lat: number; lng: number };
  zoom?: number;
  markers: MapMarker[];
  geofences?: MapGeofence[];
  onMarkerClick?: (id: string) => void;
  className?: string;
}

const BOUNDS = {
  minLat: 12.82,
  maxLat: 13.08,
  minLng: 77.54,
  maxLng: 77.78,
};

function projectToCanvas(lat: number, lng: number) {
  const x = ((lng - BOUNDS.minLng) / (BOUNDS.maxLng - BOUNDS.minLng)) * 100;
  const y = ((BOUNDS.maxLat - lat) / (BOUNDS.maxLat - BOUNDS.minLat)) * 100;
  return {
    x: Math.min(96, Math.max(4, x)),
    y: Math.min(96, Math.max(4, y)),
  };
}

function geofenceDiameter(radius: number) {
  return Math.max(10, Math.min(24, radius / 18));
}

export function GoogleMap({ center, markers, geofences = [], onMarkerClick, className }: Props) {
  const centerPos = projectToCanvas(center.lat, center.lng);

  return (
    <div
      className={cn("relative overflow-hidden bg-slate-100", className)}
      style={{
        backgroundImage: [
          "radial-gradient(circle at 20% 18%, rgba(34,197,94,0.18), transparent 18%)",
          "radial-gradient(circle at 84% 28%, rgba(59,130,246,0.14), transparent 20%)",
          "radial-gradient(circle at 62% 82%, rgba(245,158,11,0.16), transparent 18%)",
          "linear-gradient(135deg, rgba(255,255,255,0.8), rgba(226,232,240,0.8))",
          "linear-gradient(rgba(148,163,184,0.16) 1px, transparent 1px)",
          "linear-gradient(90deg, rgba(148,163,184,0.16) 1px, transparent 1px)",
        ].join(","),
        backgroundSize: "auto, auto, auto, auto, 42px 42px, 42px 42px",
        backgroundPosition: "center, center, center, center, center, center",
      }}
    >
      <div className="absolute inset-0 opacity-70">
        <svg viewBox="0 0 100 100" className="h-full w-full">
          <path
            d="M8 72 C 18 63, 26 62, 34 56 S 54 42, 64 40 S 82 32, 92 24"
            fill="none"
            stroke="rgba(59,130,246,0.35)"
            strokeWidth="2.4"
            strokeLinecap="round"
          />
          <path
            d="M12 20 C 26 26, 34 30, 42 40 S 58 58, 70 62 S 84 68, 92 78"
            fill="none"
            stroke="rgba(15,23,42,0.18)"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M20 10 L 38 24 L 48 18 L 56 28 L 74 22"
            fill="none"
            stroke="rgba(15,23,42,0.14)"
            strokeWidth="1.4"
            strokeDasharray="3 4"
          />
        </svg>
      </div>

      {geofences.map((f, index) => {
        const pos = projectToCanvas(f.lat, f.lng);
        const size = geofenceDiameter(f.radius);
        return (
          <div
            key={`${f.lat}-${f.lng}-${index}`}
            className="absolute rounded-full border"
            style={{
              left: `${pos.x}%`,
              top: `${pos.y}%`,
              width: `${size}%`,
              height: `${size}%`,
              transform: "translate(-50%, -50%)",
              borderColor: f.color,
              backgroundColor: `${f.color}22`,
            }}
          />
        );
      })}

      <div
        className="absolute rounded-full border-2 border-slate-900/30 bg-slate-900/10"
        style={{
          left: `${centerPos.x}%`,
          top: `${centerPos.y}%`,
          width: "3.5%",
          height: "3.5%",
          transform: "translate(-50%, -50%)",
        }}
      />

      {markers.map((marker) => {
        const pos = projectToCanvas(marker.lat, marker.lng);
        return (
          <button
            key={marker.id}
            onClick={() => onMarkerClick?.(marker.id)}
            className="group absolute"
            style={{
              left: `${pos.x}%`,
              top: `${pos.y}%`,
              transform: "translate(-50%, -100%)",
            }}
            title={marker.sublabel ? `${marker.label} - ${marker.sublabel}` : marker.label}
          >
            <div
              className={cn(
                "relative flex h-5 w-5 items-center justify-center rounded-full border-2 border-white shadow-md transition-transform group-hover:scale-110",
                marker.selected && "scale-110 ring-4 ring-white/70",
              )}
              style={{ backgroundColor: marker.color }}
            >
              <div
                className="absolute left-1/2 top-full h-3 w-3 -translate-x-1/2 -translate-y-1 rotate-45 rounded-[2px]"
                style={{ backgroundColor: marker.color }}
              />
            </div>
            <div className="pointer-events-none absolute left-1/2 top-[-0.65rem] hidden -translate-x-1/2 whitespace-nowrap rounded-md bg-slate-950/90 px-2 py-1 text-[10px] text-white shadow-lg group-hover:block">
              <div>{marker.label}</div>
              {marker.sublabel ? <div className="text-slate-300">{marker.sublabel}</div> : null}
            </div>
          </button>
        );
      })}

      <div className="pointer-events-none absolute left-3 top-3 rounded-md bg-white/90 px-3 py-2 text-[11px] text-slate-600 shadow-sm">
        Demo map view
      </div>
    </div>
  );
}
