/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    google?: any;
    __initGmap?: () => void;
    __gmapPromise?: Promise<void>;
  }
}

const BROWSER_KEY = import.meta.env.VITE_LOVABLE_CONNECTOR_GOOGLE_MAPS_BROWSER_KEY as
  string | undefined;
const TRACKING_ID = import.meta.env.VITE_LOVABLE_CONNECTOR_GOOGLE_MAPS_TRACKING_ID as
  string | undefined;

function loadMaps(): Promise<void> {
  if (typeof window === "undefined") return Promise.reject(new Error("no window"));
  if (window.google?.maps) return Promise.resolve();
  if (window.__gmapPromise) return window.__gmapPromise;

  window.__gmapPromise = new Promise<void>((resolve, reject) => {
    if (!BROWSER_KEY) {
      reject(new Error("Missing Google Maps browser key"));
      return;
    }
    window.__initGmap = () => resolve();
    const s = document.createElement("script");
    const params = new URLSearchParams({
      key: BROWSER_KEY,
      loading: "async",
      callback: "__initGmap",
    });
    if (TRACKING_ID) params.set("channel", TRACKING_ID);
    s.src = `https://maps.googleapis.com/maps/api/js?${params.toString()}`;
    s.async = true;
    s.onerror = () => reject(new Error("Failed to load Google Maps"));
    document.head.appendChild(s);
  });

  return window.__gmapPromise;
}

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

export function GoogleMap({
  center,
  zoom = 12,
  markers,
  geofences = [],
  onMarkerClick,
  className,
}: Props) {
  const divRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const markerObjs = useRef<any[]>([]);
  const circleObjs = useRef<any[]>([]);
  const infoRef = useRef<any>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => {
    let cancelled = false;

    loadMaps()
      .then(() => {
        if (cancelled || !divRef.current) return;
        const g = window.google;
        mapRef.current = new g.maps.Map(divRef.current, {
          center,
          zoom,
          disableDefaultUI: false,
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: false,
          clickableIcons: false,
        });
        infoRef.current = new g.maps.InfoWindow();
        setStatus("ready");
      })
      .catch((e) => {
        console.error(e);
        if (!cancelled) setStatus("error");
      });

    return () => {
      cancelled = true;
    };
  }, [center, zoom]);

  useEffect(() => {
    if (status !== "ready") return;
    const g = window.google;
    circleObjs.current.forEach((c) => c.setMap(null));
    circleObjs.current = geofences.map(
      (f) =>
        new g.maps.Circle({
          map: mapRef.current,
          center: { lat: f.lat, lng: f.lng },
          radius: f.radius,
          strokeColor: f.color,
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: f.color,
          fillOpacity: 0.12,
        }),
    );
  }, [status, geofences]);

  useEffect(() => {
    if (status !== "ready") return;
    const g = window.google;
    markerObjs.current.forEach((m) => m.setMap(null));
    markerObjs.current = markers.map((mk) => {
      const marker = new g.maps.Marker({
        position: { lat: mk.lat, lng: mk.lng },
        map: mapRef.current,
        title: mk.label,
        icon: {
          path: g.maps.SymbolPath.CIRCLE,
          scale: mk.selected ? 10 : 7,
          fillColor: mk.color,
          fillOpacity: 1,
          strokeColor: "#ffffff",
          strokeWeight: mk.selected ? 3 : 2,
        },
        zIndex: mk.selected ? 999 : 1,
      });

      marker.addListener("click", () => {
        infoRef.current?.setContent(
          `<div style="font:500 13px/1.4 system-ui;color:#111"><div style="font-weight:600">${mk.label}</div>${mk.sublabel ? `<div style="color:#555;font-size:12px">${mk.sublabel}</div>` : ""}</div>`,
        );
        infoRef.current?.open(mapRef.current, marker);
        onMarkerClick?.(mk.id);
      });

      return marker;
    });
  }, [status, markers, onMarkerClick]);

  if (status === "error") {
    return (
      <div className={className}>
        <div className="flex h-full w-full items-center justify-center bg-muted text-center text-sm text-muted-foreground">
          Map unavailable - check Google Maps connection.
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      <div ref={divRef} className="h-full w-full" />
    </div>
  );
}
