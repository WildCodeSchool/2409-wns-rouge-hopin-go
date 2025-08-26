// utils/buildStaticRouteUrl.ts
import polyline from "@mapbox/polyline";

type CenterMode =
  | { mode: "auto" }
  | {
      mode: "center";
      lon: number;
      lat: number;
      zoom: number;
      bearing?: number;
      pitch?: number;
    };

type BuildUrlOpts = {
  username?: string;
  styleId?: string;
  start: [number, number]; // [lon, lat]
  end: [number, number]; // [lon, lat]
  geometry: GeoJSON.LineString; // [lon, lat]
  width?: number;
  height?: number;
  pinAColor?: string;
  pinBColor?: string;
  stroke?: string;
  strokeWidth?: number;
  strokeOpacity?: number;
  center?: CenterMode; // auto | center
  token: string;
};

export function buildStaticRouteUrl({
  username = "mapbox",
  styleId = "streets-v12",
  start,
  end,
  geometry,
  width = 648,
  height = 300,
  pinAColor = "8E387C",
  pinBColor = "3887be",
  stroke = "3887be",
  strokeWidth = 5,
  strokeOpacity = 0.75,
  center = { mode: "auto" },
  token,
}: BuildUrlOpts) {
  // Static Images attend une polyline (precision 5) au format (lat,lon)
  const encoded = polyline.fromGeoJSON(
    { type: "Feature", geometry, properties: {} },
    5
  );

  const pathOverlay =
    `path-${strokeWidth}+${stroke}-${strokeOpacity}` +
    `(${encodeURIComponent(encoded)})`;

  const pins = [
    `pin-s-a+${pinAColor}(${start[0]},${start[1]})`,
    `pin-s-b+${pinBColor}(${end[0]},${end[1]})`,
  ];
  const overlays = [pathOverlay, ...pins].join(",");

  const centerPart =
    center.mode === "center"
      ? [
          center.lon,
          center.lat,
          center.zoom,
          ...(center.bearing !== undefined ? [center.bearing] : []),
          ...(center.pitch !== undefined ? [center.pitch] : []),
        ].join(",")
      : "auto";

  return `https://api.mapbox.com/styles/v1/${username}/${styleId}/static/${overlays}/${centerPart}/${width}x${height}?access_token=${token}`;
}
