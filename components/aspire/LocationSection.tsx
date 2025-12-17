"use client";

import { Section } from "./ui/Section";
import { FadeInSection } from "./ui/FadeInSection";
import dynamic from "next/dynamic";
import { useMemo } from "react";
import styles from "./LocationSection.module.css";
import "leaflet/dist/leaflet.css";

// Dynamically import map components to avoid SSR issues
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false },
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false },
);
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false },
);
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), {
  ssr: false,
});

export function LocationSection() {
  // Aspire Academics location coordinates
  const position: [number, number] = [-37.84129696747103, 144.74723069503193];

  // Custom marker icon
  const customIcon = useMemo(() => {
    if (typeof window === "undefined") return null;
    const L = require("leaflet");
    return L.divIcon({
      className: styles.customMarker,
      html: `
        <div class="${styles.markerCard}">
          <div class="${styles.markerTitle}">ASPIRE</div>
          <div class="${styles.markerSubtitle}">ACADEMICS</div>
        </div>
        <div class="${styles.markerArrow}"></div>
        <div class="${styles.markerDot}"></div>
      `,
      iconSize: [70, 70],
      iconAnchor: [0, 63], // Adjusted to where the red dot actually is
      popupAnchor: [0, -63], // Popup positioned above the marker
    });
  }, []);

  return (
    <Section variant="medium-blue" className="bg-[#0144AB] py-12">
      <div className="space-y-6 max-w-2xl mx-auto">
        {/* Section Title */}
        <FadeInSection>
          <h2 className="text-center text-2xl lg:text-4xl font-bold text-white">
            Where to Find Us
          </h2>
        </FadeInSection>

        {/* Map Card */}
        <FadeInSection delay={0.1}>
          <div className="overflow-hidden rounded-[24px] bg-white p-4 shadow-lg">
            {/* Map Area */}
            <div className="relative h-[300px] w-full overflow-hidden rounded-[16px]">
              {typeof window !== "undefined" && (
                <MapContainer
                  center={position}
                  zoom={16}
                  style={{
                    height: "100%",
                    width: "100%",
                    borderRadius: "16px",
                  }}
                  scrollWheelZoom={false}
                  zoomControl={false}
                  attributionControl={false}
                >
                  {/* Satellite imagery base layer */}
                  <TileLayer
                    url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                    maxZoom={19}
                  />
                  {/* Street labels and road names overlay */}
                  <TileLayer
                    url="https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Transportation/MapServer/tile/{z}/{y}/{x}"
                    maxZoom={19}
                  />
                  {/* Place names and boundaries overlay */}
                  <TileLayer
                    url="https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}"
                    maxZoom={19}
                  />
                  {customIcon && (
                    <Marker position={position} icon={customIcon}>
                      <Popup>
                        <div className="text-center">
                          <p className="font-bold text-aspire-blue">
                            Aspire Academics
                          </p>
                          <p className="text-xs">Unit 15, 150 Palmers Rd</p>
                          <p className="text-xs">Truganina VIC 3029</p>
                        </div>
                      </Popup>
                    </Marker>
                  )}
                </MapContainer>
              )}
            </div>

            {/* Address Info */}
            <div className="space-y-2 p-6 text-center">
              <p className="text-base font-semibold text-black">
                Unit 15, 150 Palmers Rd, Truganina VIC 3029
              </p>
              <p className="text-sm text-gray-600">
                Parking available. Easy access from Williams Landing, Tarneit,
                and surrounding suburbs.
              </p>
            </div>
          </div>
        </FadeInSection>
      </div>
    </Section>
  );
}
