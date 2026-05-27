import React, { useEffect, useMemo, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const geocodeCache = new Map();

function MapRecenter({ position }) {
  const map = useMap();
  useEffect(() => {
    if (position?.length === 2) map.setView(position);
  }, [position, map]);
  return null;
}

function normalizeQuery(raw) {
  const text = (raw || "").trim();
  if (!text) return "";

  // Buang prefix "Trip " biar Nominatim lebih gampang nemu (Trip Solok -> Solok)
  const withoutTripWord = text.replace(/^trip\s+/i, "").trim();

  // Kalau belum ada "Indonesia", tambahkan hint
  const hasIndonesia = /indonesia/i.test(withoutTripWord);
  return hasIndonesia ? withoutTripWord : `${withoutTripWord}, Indonesia`;
}

export default function LocationMap({
  query,
  label = "Lokasi",
  height = 260,
  zoom = 12,
  className = "",
}) {
  const [position, setPosition] = useState([-6.2, 106.816666]); // default Jakarta
  const [status, setStatus] = useState("idle"); // idle | loading | ok | not_found | error

  const normalizedQuery = useMemo(() => normalizeQuery(query), [query]);

  useEffect(() => {
    if (!normalizedQuery) return;

    let isCancelled = false;

    const fetchCoordinates = async () => {
      try {
        setStatus("loading");

        const cacheKey = normalizedQuery.toLowerCase();
        const cached = geocodeCache.get(cacheKey);
        if (cached) {
          if (!isCancelled) {
            setPosition(cached);
            setStatus("ok");
          }
          return;
        }

        const q = encodeURIComponent(normalizedQuery);
        const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${q}`;

        const response = await fetch(url, {
          headers: {
            "Accept-Language": "id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7",
          },
        });

        if (!response.ok) throw new Error(`Nominatim error: ${response.status}`);

        const data = await response.json();

        if (!isCancelled && Array.isArray(data) && data.length > 0) {
          const lat = parseFloat(data[0].lat);
          const lon = parseFloat(data[0].lon);
          const newPos = [lat, lon];

          geocodeCache.set(cacheKey, newPos);
          setPosition(newPos);
          setStatus("ok");
        } else {
          if (!isCancelled) setStatus("not_found");
        }
      } catch (err) {
        console.error("Gagal cari koordinat:", err);
        if (!isCancelled) setStatus("error");
      }
    };

    fetchCoordinates();

    return () => {
      isCancelled = true;
    };
  }, [normalizedQuery]);

  return (
    <div className={className}>
      <div className="mb-2 text-xs text-neutral-500">
        {status === "loading" && "Mencari lokasi di peta..."}
        {status === "not_found" && "Lokasi tidak ditemukan, menampilkan posisi default."}
        {status === "error" && "Gagal memuat lokasi peta."}
      </div>

      <div
        style={{ height, width: "100%" }}
        className="overflow-hidden rounded-xl border border-neutral-200"
      >
        <MapContainer
          center={position}
          zoom={zoom}
          scrollWheelZoom={false}
          style={{ height: "100%", width: "100%" }}
        >
          <MapRecenter position={position} />

          <TileLayer
            attribution='&copy; OpenStreetMap contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <Marker position={position}>
            <Popup>
              <div className="text-sm">
                <div className="font-semibold">{label}</div>
                <div className="text-neutral-600">{normalizedQuery}</div>
              </div>
            </Popup>
          </Marker>
        </MapContainer>
      </div>
    </div>
  );
}