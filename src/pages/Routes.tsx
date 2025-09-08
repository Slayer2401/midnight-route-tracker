import { Clock, MapPin, Palette } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { busRoutes, busStops } from "@/data/busData";
import { Link } from "react-router-dom";

const Routes = () => {
  const getStopName = (stopId: string) => {
    return busStops.find(stop => stop.id === stopId)?.name || stopId;
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-button bg-clip-text text-transparent">
            Bus Routes
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Choose your route and track buses in real-time. All routes operate with live GPS tracking.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {busRoutes.map((route) => (
            <Card key={route.id} className="bg-gradient-card border-border hover:border-primary/30 transition-smooth shadow-card hover:shadow-glow">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between mb-2">
                  <CardTitle className="text-xl font-bold text-foreground">
                    {route.name}
                  </CardTitle>
                  <div 
                    className="w-4 h-4 rounded-full border-2 border-white/20"
                    style={{ backgroundColor: route.color }}
                  />
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Clock className="w-4 h-4 mr-2" />
                  {route.frequency}
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold text-foreground mb-2 flex items-center">
                    <MapPin className="w-4 h-4 mr-2" />
                    Stops ({route.stops.length})
                  </h4>
                  <div className="space-y-1">
                    {route.stops.slice(0, 3).map((stopId) => (
                      <div key={stopId} className="text-sm text-muted-foreground ml-6">
                        • {getStopName(stopId)}
                      </div>
                    ))}
                    {route.stops.length > 3 && (
                      <div className="text-sm text-muted-foreground ml-6">
                        + {route.stops.length - 3} more stops
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-2 border-t border-border">
                  <div className="text-xs text-muted-foreground mb-3">
                    Operating: {route.operatingHours}
                  </div>
                  <Button 
                    variant="default" 
                    className="w-full"
                    asChild
                  >
                    <Link to={`/map?route=${route.id}`}>
                      Track Live Buses
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Button variant="outline" size="lg" asChild>
            <Link to="/map">
              View All Routes on Map
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Routes;