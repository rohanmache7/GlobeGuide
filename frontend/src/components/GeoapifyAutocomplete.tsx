"use client";

import { useEffect, useRef, useState } from "react";

interface Place {
  label: string;
  lat: number;
  lon: number;
}

interface Props {
  onSelect: (place: Place) => void;
}

export default function GeoapifyAutocomplete({ onSelect }: Props) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (query.length < 2) {
        setResults([]);
        return;
      }
console.log(
  "Frontend key:",
  process.env.NEXT_PUBLIC_GEOAPIFY_API_KEY
);
      fetch(
        `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(
          query
        )}&limit=5&apiKey=${process.env.NEXT_PUBLIC_GEOAPIFY_API_KEY}`
      )
        .then((res) => res.json())
        .then((data) => {
          setResults(data.features || []);
        })
        .finally(() => setLoading(false));
    }, 300);

    setLoading(true);

    return () => clearTimeout(handler);
  }, [query]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setResults([]);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={wrapperRef}>
      <input
        type="text"
        className="w-full rounded-md border p-2"
        placeholder="Enter destination..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      {loading && (
        <div className="absolute z-10 mt-1 rounded bg-white p-2 shadow">
          Searching...
        </div>
      )}

      {results.length > 0 && (
        <div className="absolute z-20 mt-1 max-h-60 w-full overflow-y-auto rounded-md border bg-white shadow-lg">
          {results.map((item: any) => (
            <div
              key={item.properties.place_id}
              className="cursor-pointer border-b p-3 hover:bg-gray-100"
              onClick={() => {
                const place = {
                  label: item.properties.formatted,
                  lat: item.properties.lat,
                  lon: item.properties.lon,
                };

                setQuery(place.label);
                setResults([]);
                onSelect(place);
              }}
            >
              {item.properties.formatted}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}