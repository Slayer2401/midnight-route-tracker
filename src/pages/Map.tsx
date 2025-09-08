import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { useSearchParams } from "react-router-dom";
import L from "leaflet";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, MapPin, Navigation } from "lucide-react";
import { busStops, busRoutes, liveBuses, Bus } from "@/data/busData";
import "leaflet/dist/leaflet.css";

// Fix for default markers in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

// Custom bus icon
const busIcon = L.divIcon({
  html: `<div style="background: #22c55e; color: white; border-radius: 50%; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; font-size: 16px; border: 2px solid white; box-shadow: 0 2px 10px rgba(34, 197, 94, 0.4);">🚌</div>`,
  className: 'custom-div-icon',
  iconSize: [30, 30],
  iconAnchor: [15, 15]
});

// Custom stop icon  
const stopIcon = L.divIcon({
  html: `<div style="background: #f59e0b; color: white; border-radius: 50%; width: 20px; height: 20px; display: flex; align-items: center; justify-content: center; font-size: 12px; border: 2px solid white; box-shadow: 0 2px 8px rgba(245, 158, 11, 0.4);">●</div>`,
  className: 'custom-div-icon',
  iconSize: [20, 20],
  iconAnchor: [10, 10]
});

const MapUpdater = ({ buses }: { buses: Bus[] }) => {
  const map = useMap();
  
  useEffect(() => {
    if (buses.length > 0) {
      const group = new L.FeatureGroup(buses.map(bus => 
        L.marker([bus.lat, bus.lng])
      ));
      map.fitBounds(group.getBounds().pad(0.1));
    }
  }, [buses, map]);
  
  return null;
};

const Map = () => {
  const [searchParams] = useSearchParams();
  const routeFilter = searchParams.get("route");
  const [buses, setBuses] = useState<Bus[]>(liveBuses);
  
  // Filter data based on route
  const filteredBuses = routeFilter 
    ? buses.filter(bus => bus.routeId === routeFilter)
    : buses;
    
  const filteredStops = routeFilter
    ? busStops.filter(stop => stop.routes.includes(routeFilter))
    : busStops;
    
  const selectedRoute = routeFilter 
    ? busRoutes.find(route => route.id === routeFilter)
    : null;

  // Simulate live bus updates
  useEffect(() => {
    const interval = setInterval(() => {
      setBuses(prevBuses => prevBuses.map(bus => ({
        ...bus,
        lat: bus.lat + (Math.random() - 0.5) * 0.001,
        lng: bus.lng + (Math.random() - 0.5) * 0.001,
        speed: Math.max(5, Math.min(35, bus.speed + (Math.random() - 0.5) * 10)),
        lastUpdate: new Date().toISOString()
      })));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getRouteInfo = (routeId: string) => {
    return busRoutes.find(route => route.id === routeId);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-button bg-clip-text text-transparent">
            {selectedRoute ? `${selectedRoute.name} - Live Map` : "Live Bus Tracking"}
          </h1>
          <p className="text-muted-foreground">
            Real-time bus positions updated every 5 seconds
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Live Buses Panel */}
          <div className="lg:col-span-1 space-y-4">
            <Card className="bg-gradient-card border-border shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center text-bus-live">
                  <Navigation className="w-5 h-5 mr-2" />
                  Live Buses ({filteredBuses.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {filteredBuses.map((bus) => {
                  const route = getRouteInfo(bus.routeId);
                  const nextStop = busStops.find(stop => stop.id === bus.nextStop);
                  return (
                    <div key={bus.id} className="p-3 bg-muted rounded-lg border border-border">
                      <div className="flex items-center justify-between mb-2">
                        <Badge 
                          style={{ backgroundColor: route?.color }}
                          className="text-white"
                        >
                          {route?.name}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {bus.speed} km/h
                        </span>
                      </div>
                      <div className="text-sm space-y-1">
                        <div className="flex items-center text-muted-foreground">
                          <MapPin className="w-3 h-3 mr-1" />
                          Next: {nextStop?.name}
                        </div>
                        <div className="flex items-center text-muted-foreground">
                          <Clock className="w-3 h-3 mr-1" />
                          {new Date(bus.lastUpdate).toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </div>

          {/* Map */}
          <div className="lg:col-span-3">
            <Card className="bg-gradient-card border-border shadow-card overflow-hidden">
              <div className="h-[600px] relative">
                <MapContainer
                  center={[40.7589, -73.9851]}
                  zoom={13}
                  className="h-full w-full rounded-lg"
                  style={{ background: '#1a1a1a' }}
                >
                  <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                  />
                  
                  <MapUpdater buses={filteredBuses} />
                  
                  {/* Bus Markers */}
                  {filteredBuses.map((bus) => {
                    const route = getRouteInfo(bus.routeId);
                    const nextStop = busStops.find(stop => stop.id === bus.nextStop);
                    return (
                      <Marker
                        key={bus.id}
                        position={[bus.lat, bus.lng]}
                        icon={busIcon}
                      >
                        <Popup className="custom-popup">
                          <div className="p-2 bg-card text-foreground rounded">
                            <h3 className="font-semibold text-bus-live mb-2">
                              🚌 {route?.name}
                            </h3>
                            <div className="space-y-1 text-sm">
                              <div>Speed: {bus.speed} km/h</div>
                              <div>Next Stop: {nextStop?.name}</div>
                              <div>Updated: {new Date(bus.lastUpdate).toLocaleTimeString()}</div>
                            </div>
                          </div>
                        </Popup>
                      </Marker>
                    );
                  })}
                  
                  {/* Stop Markers */}
                  {filteredStops.map((stop) => (
                    <Marker
                      key={stop.id}
                      position={[stop.lat, stop.lng]}
                      icon={stopIcon}
                    >
                      <Popup className="custom-popup">
                        <div className="p-2 bg-card text-foreground rounded">
                          <h3 className="font-semibold text-stop-marker mb-2">
                            📍 {stop.name}
                          </h3>
                          <div className="text-sm">
                            <div className="mb-1">Routes:</div>
                            <div className="flex flex-wrap gap-1">
                              {stop.routes.map(routeId => {
                                const route = getRouteInfo(routeId);
                                return (
                                  <Badge
                                    key={routeId}
                                    style={{ backgroundColor: route?.color }}
                                    className="text-white text-xs"
                                  >
                                    {route?.name}
                                  </Badge>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      </Popup>
                    </Marker>
                  ))}
                </MapContainer>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Map;