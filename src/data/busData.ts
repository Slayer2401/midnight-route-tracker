export interface BusStop {
  id: string;
  name: string;
  lat: number;
  lng: number;
  routes: string[];
}

export interface BusRoute {
  id: string;
  name: string;
  color: string;
  stops: string[];
  frequency: string;
  operatingHours: string;
}

export interface Bus {
  id: string;
  routeId: string;
  lat: number;
  lng: number;
  heading: number;
  speed: number;
  lastUpdate: string;
  nextStop: string;
}

export const busStops: BusStop[] = [
  { id: "stop-1", name: "City Hall", lat: 40.7589, lng: -73.9851, routes: ["route-1", "route-2"] },
  { id: "stop-2", name: "Central Park", lat: 40.7829, lng: -73.9654, routes: ["route-1"] },
  { id: "stop-3", name: "Times Square", lat: 40.7580, lng: -73.9855, routes: ["route-2", "route-3"] },
  { id: "stop-4", name: "Grand Central", lat: 40.7527, lng: -73.9772, routes: ["route-1", "route-3"] },
  { id: "stop-5", name: "Brooklyn Bridge", lat: 40.7061, lng: -73.9969, routes: ["route-2"] },
  { id: "stop-6", name: "Union Square", lat: 40.7359, lng: -73.9911, routes: ["route-1", "route-3"] },
  { id: "stop-7", name: "Washington Square", lat: 40.7308, lng: -74.0014, routes: ["route-2"] },
  { id: "stop-8", name: "Financial District", lat: 40.7074, lng: -74.0113, routes: ["route-3"] },
];

export const busRoutes: BusRoute[] = [
  {
    id: "route-1",
    name: "Blue Line Express",
    color: "#3b82f6",
    stops: ["stop-1", "stop-2", "stop-4", "stop-6"],
    frequency: "Every 8 minutes",
    operatingHours: "5:30 AM - 11:30 PM"
  },
  {
    id: "route-2", 
    name: "Green Circle",
    color: "#22c55e",
    stops: ["stop-1", "stop-3", "stop-5", "stop-7"],
    frequency: "Every 12 minutes",
    operatingHours: "6:00 AM - 10:00 PM"
  },
  {
    id: "route-3",
    name: "Downtown Shuttle",
    color: "#f59e0b",
    stops: ["stop-3", "stop-4", "stop-6", "stop-8"],
    frequency: "Every 15 minutes", 
    operatingHours: "7:00 AM - 9:00 PM"
  }
];

export const liveBuses: Bus[] = [
  {
    id: "bus-1",
    routeId: "route-1",
    lat: 40.7589,
    lng: -73.9851,
    heading: 45,
    speed: 25,
    lastUpdate: new Date().toISOString(),
    nextStop: "stop-2"
  },
  {
    id: "bus-2", 
    routeId: "route-2",
    lat: 40.7580,
    lng: -73.9855,
    heading: 180,
    speed: 15,
    lastUpdate: new Date().toISOString(),
    nextStop: "stop-5"
  },
  {
    id: "bus-3",
    routeId: "route-3", 
    lat: 40.7527,
    lng: -73.9772,
    heading: 270,
    speed: 30,
    lastUpdate: new Date().toISOString(),
    nextStop: "stop-6"
  }
];