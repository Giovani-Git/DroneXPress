import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const cityCoords = {
  'passo fundo': { lat: -28.2628, lng: -52.4067 },
  'marau': { lat: -28.4494, lng: -52.1986 },
  'carazinho': { lat: -28.2833, lng: -52.7833 },
  'soledade': { lat: -28.8181, lng: -52.5103 },
  'erechim': { lat: -27.6333, lng: -52.2667 },
  'caxias do sul': { lat: -29.1667, lng: -51.1833 },
  'porto alegre': { lat: -30.0331, lng: -51.23 },
  'sao paulo': { lat: -23.5505, lng: -46.6333 },
};

function easeInOut(t) {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function getDronePos(progress, baseCoords, originCoords, destCoords, isSame) {
  progress = Math.min(Math.max(progress, 0), 100) / 100;
  if (isSame) {
    return { p: progress, fromCoords: originCoords, toCoords: destCoords };
  }
  const wp = 0.3;
  if (progress <= wp) {
    return { p: progress / wp, fromCoords: baseCoords, toCoords: originCoords };
  }
  return { p: (progress - wp) / (1 - wp), fromCoords: originCoords, toCoords: destCoords };
}

export default function TrackingMap({ base = 'Passo Fundo', origin, destination, progress = 0 }) {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const droneMarker = useRef(null);
  const routeLine = useRef(null);
  const traveledLine = useRef(null);
  const animRef = useRef(null);
  const currentRef = useRef(0);
  const baseMarker = useRef(null);
  const originMarker = useRef(null);
  const destMarker = useRef(null);
  const [displayPct, setDisplayPct] = useState(0);

  function moveDrone(segPct, from, to, overallPct) {
    if (!droneMarker.current || !traveledLine.current) return;
    const lat = lerp(from.lat, to.lat, segPct);
    const lng = lerp(from.lng, to.lng, segPct);
    droneMarker.current.setLatLng([lat, lng]);
    droneMarker.current.setPopupContent(`<b>Drone em transito</b><br/>${Math.round(overallPct)}% do percurso`);
    const b = cityCoords[base?.toLowerCase()];
    const o = cityCoords[origin?.toLowerCase()];
    if (b && o && base?.toLowerCase() === origin?.toLowerCase()) {
      traveledLine.current.setLatLngs([[b.lat, b.lng], [lat, lng]]);
    } else if (b && o) {
      const destCoords = cityCoords[destination?.toLowerCase()];
      if (destCoords) {
        traveledLine.current.setLatLngs([[b.lat, b.lng], [o.lat, o.lng], [lat, lng]]);
      }
    }
  }

  function clearLayers() {
    [routeLine, traveledLine, droneMarker, baseMarker, originMarker, destMarker].forEach((ref) => {
      if (ref.current && mapInstance.current) {
        mapInstance.current.removeLayer(ref.current);
        ref.current = null;
      }
    });
  }

  useEffect(() => {
    if (mapInstance.current) return;

    mapInstance.current = L.map(mapRef.current, {
      center: [-28.4, -52.4],
      zoom: 10,
      zoomControl: false,
      attributionControl: false,
    });

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
    }).addTo(mapInstance.current);

    L.control.zoom({ position: 'bottomright' }).addTo(mapInstance.current);

    return () => {
      mapInstance.current?.remove();
      mapInstance.current = null;
    };
  }, []);

  useEffect(() => {
    if (!mapInstance.current || !base || !origin || !destination) return;

    const b = cityCoords[base.toLowerCase()];
    const o = cityCoords[origin.toLowerCase()];
    const d = cityCoords[destination.toLowerCase()];
    if (!b || !o || !d) return;

    cancelAnimationFrame(animRef.current);
    clearLayers();

    currentRef.current = 0;
    setDisplayPct(0);

    const isSame = base.toLowerCase() === origin.toLowerCase();

    if (isSame) {
      routeLine.current = L.polyline(
        [[b.lat, b.lng], [d.lat, d.lng]],
        { color: '#00d4ff', weight: 2, opacity: 0.2, dashArray: '8, 8' }
      ).addTo(mapInstance.current);
    } else {
      routeLine.current = L.polyline(
        [[b.lat, b.lng], [o.lat, o.lng], [d.lat, d.lng]],
        { color: '#00d4ff', weight: 2, opacity: 0.2, dashArray: '8, 8' }
      ).addTo(mapInstance.current);
    }

    if (isSame) {
      traveledLine.current = L.polyline(
        [[b.lat, b.lng], [b.lat, b.lng]],
        { color: '#00d4ff', weight: 3, opacity: 0.9 }
      ).addTo(mapInstance.current);
    } else {
      traveledLine.current = L.polyline(
        [[b.lat, b.lng], [b.lat, b.lng], [b.lat, b.lng]],
        { color: '#00d4ff', weight: 3, opacity: 0.9 }
      ).addTo(mapInstance.current);
    }

    baseMarker.current = L.marker([b.lat, b.lng], {
      icon: L.divIcon({
        className: '',
        html: '<div style="width:16px;height:16px;background:#ffaa00;border-radius:50%;border:2px solid white;box-shadow:0 0 12px rgba(255,170,0,0.6);"></div>',
        iconSize: [16, 16], iconAnchor: [8, 8],
      }),
    }).addTo(mapInstance.current).bindPopup(`<b>Base DroneXPress</b><br/>${base}`);

    if (!isSame) {
      originMarker.current = L.marker([o.lat, o.lng], {
        icon: L.divIcon({
          className: '',
          html: '<div style="width:14px;height:14px;background:#00d4ff;border-radius:50%;border:2px solid white;box-shadow:0 0 12px rgba(0,212,255,0.5);"></div>',
          iconSize: [14, 14], iconAnchor: [7, 7],
        }),
      }).addTo(mapInstance.current).bindPopup(`<b>Coleta</b><br/>${origin}`);
    }

    destMarker.current = L.marker([d.lat, d.lng], {
      icon: L.divIcon({
        className: '',
        html: '<div style="width:14px;height:14px;background:#ff4444;border-radius:50%;border:2px solid white;box-shadow:0 0 12px rgba(255,68,68,0.5);"></div>',
        iconSize: [14, 14], iconAnchor: [7, 7],
      }),
    }).addTo(mapInstance.current).bindPopup(`<b>Destino</b><br/>${destination}`);

    droneMarker.current = L.marker([b.lat, b.lng], {
      icon: L.divIcon({
        className: '',
        html: `<div style="background:#00d4ff;border-radius:50%;width:22px;height:22px;display:flex;align-items:center;justify-content:center;box-shadow:0 0 24px rgba(0,212,255,0.8);animation:pulse-glow 1.5s infinite;font-size:11px;color:white;font-weight:bold;">✈</div>`,
        iconSize: [22, 22], iconAnchor: [11, 11],
      }),
    }).addTo(mapInstance.current).bindPopup(`<b>Drone em transito</b><br/>0% do percurso`);

    const allCoords = isSame ? [b, d] : [b, o, d];
    const bounds = allCoords.reduce((bd, c) => bd.extend([c.lat, c.lng]), L.latLngBounds([]));
    mapInstance.current.fitBounds(bounds, { padding: [50, 50] });
  }, [base, origin, destination]);

  useEffect(() => {
    if (!droneMarker.current || !traveledLine.current) return;

    const b = cityCoords[base?.toLowerCase()];
    const o = cityCoords[origin?.toLowerCase()];
    const d = cityCoords[destination?.toLowerCase()];
    if (!b || !o || !d) return;

    const target = Math.min(progress, 100) / 100;
    const isSameBases = base?.toLowerCase() === origin?.toLowerCase();
    const pos = getDronePos(progress, b, o, d, isSameBases);
    moveDrone(pos.p, pos.fromCoords, pos.toCoords, progress);
    setDisplayPct(Math.round(target * 100));
    currentRef.current = target;
  }, [progress, base, origin, destination]);

  const originName = origin || '—';
  const destName = destination || '—';
  const isSame = base?.toLowerCase() === originName?.toLowerCase();

  return (
    <div className="glass-card rounded-3xl p-5 lg:p-6">
      <style>{`
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 24px rgba(0,212,255,0.8); }
          50% { box-shadow: 0 0 40px rgba(0,212,255,0.4); }
        }
      `}</style>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
        <h2 className="text-lg lg:text-xl font-bold text-white">Rastreamento</h2>
        <div className="flex items-center gap-4 text-sm flex-wrap">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
            <span className="text-gray-400">Base</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-neon-blue shadow-[0_0_8px_rgba(0,212,255,0.6)]"></span>
            <span className="text-gray-400">Drone</span>
          </div>
          {!isSame && (
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-400"></span>
              <span className="text-gray-400">Coleta</span>
            </div>
          )}
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-400"></span>
            <span className="text-gray-400">Destino</span>
          </div>
          <span className="text-neon-blue font-semibold text-sm">{displayPct}%</span>
        </div>
      </div>
      <div ref={mapRef} style={{ height: '450px', width: '100%', borderRadius: '16px' }}></div>
    </div>
  );
}
