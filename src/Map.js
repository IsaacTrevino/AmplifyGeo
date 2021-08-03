import React, { useCallback, useEffect, useRef } from "react";
import { Geo } from '@aws-amplify/geo';
import { AmplifyMapLibreRequest } from "maplibre-gl-js-amplify";
import awsconfig from './aws-exports';
import MaplibreGeocoder from "@maplibre/maplibre-gl-geocoder";
import maplibregl from "maplibre-gl";
import "@maplibre/maplibre-gl-geocoder/dist/maplibre-gl-geocoder.css";

const GeoMapSearch = ({
  ...rest
}) => {
  const mapContainerRef = useRef(null);

  const InitializeMap = useCallback(() => {
      return AmplifyMapLibreRequest.createMapLibreMap({
        container: mapContainerRef.current,
        center: [-98.0867403, 26.2460953],
        zoom: 10,
        region: awsconfig.geo.amazon_location_services.region
      })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  const SearchLocation = async config => {
    const data = await Geo.searchByText(config.query);
    const features = data.map((result) => {
      const { geometry, ...otherResults } = result;
      return {
        type: "Feature",
        geometry: { type: "Point", coordinates: geometry.point },
        properties: { ...otherResults },
        place_name: otherResults.label,
        text: otherResults.label,
        center: geometry.point,
      };
    });
    return { features };
  };

  useEffect(() => {
    (async () => {
      try {
        //test
        const search = await Geo.searchByText("walmart");
        console.log(search);


        const map = await InitializeMap();
        console.log("Map initialized");
        const geocoder = new MaplibreGeocoder(
          { forwardGeocode: async (config) => await SearchLocation(config) },
          { maplibregl: maplibregl, showResultMarkers: true }
        );
        map.addControl(geocoder);
      } catch (e) {
        console.error(e);
      }
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div ref={mapContainerRef} {...rest} />;
};

export default GeoMapSearch;
