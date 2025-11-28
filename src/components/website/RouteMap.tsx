
import React, { useEffect, useRef } from 'react';

declare const L: any;

interface Stop {
  name: string;
  coords: [number, number];
}

interface RouteMapProps {
  stops: Stop[];
}

const RouteMap: React.FC<RouteMapProps> = ({ stops }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);

  useEffect(() => {
    if (mapContainerRef.current && typeof L !== 'undefined' && !mapInstanceRef.current && stops.length > 0) {
      const map = L.map(mapContainerRef.current, { scrollWheelZoom: false });
      mapInstanceRef.current = map;

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 18,
      }).addTo(map);

      const latLngs = stops.map(stop => stop.coords);

      stops.forEach((stop, index) => {
        const icon = L.divIcon({
          className: 'custom-div-icon',
          html: `<div style="background-color: #1e293b; color: white; border-radius: 50%; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: bold; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.2);">${index + 1}</div>`,
          iconSize: [24, 24],
          iconAnchor: [12, 12]
        });
        L.marker(stop.coords, { icon }).addTo(map).bindPopup(`<b>Stop ${index + 1}:</b> ${stop.name}`);
      });

      const polyline = L.polyline(latLngs, { 
        color: '#FF6A3D',
        weight: 3,
        dashArray: '5, 10'
      }).addTo(map);

      map.fitBounds(polyline.getBounds(), { padding: [40, 40] });
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [stops]);

  if (stops.length === 0) {
    return null;
  }

  return (
    <div 
      ref={mapContainerRef} 
      className="h-80 w-full rounded-lg shadow-inner border border-ink-neutral-200 dark:border-ink-neutral-700"
      aria-label="Tour route map"
    />
  );
};

export default RouteMap;
