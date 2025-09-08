import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, MapPin, Navigation } from "lucide-react";
import { busStops, busRoutes, liveBuses, Bus } from "@/data/busData";

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
            {selectedRoute ? `${selectedRoute.name} - Live Map` : "ConnectVI Live Tracking"}
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

          {/* Map Placeholder */}
          <div className="lg:col-span-3">
            <Card className="bg-gradient-card border-border shadow-card overflow-hidden">
              <div className="h-[600px] relative bg-muted flex items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl mb-4">🗺️</div>
                  <h3 className="text-xl font-semibold mb-2">Interactive Map Loading...</h3>
                  <p className="text-muted-foreground">
                    Map will display {filteredBuses.length} live buses and {filteredStops.length} stops
                  </p>
                  <div className="mt-4 space-y-2">
                    {filteredBuses.map((bus) => {
                      const route = getRouteInfo(bus.routeId);
                      return (
                        <div key={bus.id} className="flex items-center justify-between p-2 bg-background rounded">
                          <span>🚌 {route?.name}</span>
                          <span className="text-sm text-muted-foreground">
                            {bus.lat.toFixed(4)}, {bus.lng.toFixed(4)}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Map;