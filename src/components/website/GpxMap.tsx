import React, { useEffect, useRef } from 'react';

// Declare Leaflet's global 'L' object to satisfy TypeScript since it's loaded via a script tag.
declare const L: any;

interface GpxMapProps {
  track: [number, number][];
  bounds: [[number, number], [number, number]];
}

const GpxMap: React.FC<GpxMapProps> = ({ track, bounds }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);

  useEffect(() => {
    // Check if the map container is available and if Leaflet is loaded
    if (mapContainerRef.current && typeof L !== 'undefined' && !mapInstanceRef.current) {
      // Initialize the map and set its view
      const map = L.map(mapContainerRef.current);
      mapInstanceRef.current = map;

      // Add a tile layer from OpenStreetMap
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 18,
      }).addTo(map);

      // Create a polyline from the track coordinates and add it to the map
      const polyline = L.polyline(track, { 
        color: '#FF6A3D', // Use the primary theme color for the trail
        weight: 4,
        opacity: 0.8
      }).addTo(map);

      // Add start and end markers
      L.circleMarker(track[0], { radius: 6, color: 'white', fillColor: '#10B981', fillOpacity: 1, weight: 2 }).addTo(map).bindPopup("Start");
      L.circleMarker(track[track.length - 1], { radius: 6, color: 'white', fillColor: '#EF4444', fillOpacity: 1, weight: 2 }).addTo(map).bindPopup("End");


      // Fit the map view to the bounds of the polyline
      map.fitBounds(bounds, { padding: [20, 20] });
    }

    // Cleanup function to run when the component unmounts
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
    // Dependencies array: only re-run effect if these props change.
    // The empty array ensures this effect runs only once on mount.
  }, [track, bounds]);

  return (
    <div 
        ref={mapContainerRef} 
        className="h-64 w-full rounded-lg shadow-inner border border-ink-neutral-200 dark:border-ink-neutral-700"
        aria-label="GPX route map"
    />
  );
};

export default GpxMap;