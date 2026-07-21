import axios from "axios";

const api = axios.create({
  baseURL: "https://api.geoapify.com",
  timeout: 10000,
});

const API_KEY = process.env.GEOAPIFY_API_KEY!;
console.log("Backend Geoapify API Key:", API_KEY);

export interface Coordinates {
  lat: number;
  lon: number;
}

export class GeoapifyService {
  async getCoordinates(location: string): Promise<Coordinates> {
    const { data } = await api.get("/v1/geocode/search", {
      params: {
        text: location,
        apiKey: API_KEY,
      },
    });

    if (!data.features.length) {
      throw new Error("Location not found");
    }

    return {
      lat: data.features[0].properties.lat,
      lon: data.features[0].properties.lon,
    };
  }

  async getHotels(lat: number, lon: number) {
    const { data } = await api.get("/v2/places", {
      params: {
        categories: "accommodation.hotel",
        filter: `circle:${lon},${lat},5000`,
        limit: 10,
        apiKey: API_KEY,
      },
    });

    return data.features.map((hotel: any) => ({
      hotelName: hotel.properties.name ?? "Unknown Hotel",
      hotelAddress: hotel.properties.formatted ?? "",
      geoCoordinates: {
        lat: hotel.properties.lat,
        lon: hotel.properties.lon,
      },
      rating: hotel.properties.rating ?? 4,
    }));
  }

  async getRestaurants(lat: number, lon: number) {
    const { data } = await api.get("/v2/places", {
      params: {
        categories: "catering.restaurant",
        filter: `circle:${lon},${lat},5000`,
        limit: 15,
        apiKey: API_KEY,
      },
    });

    return data.features.map((restaurant: any) => ({
      name: restaurant.properties.name,
      address: restaurant.properties.formatted,
      lat: restaurant.properties.lat,
      lon: restaurant.properties.lon,
    }));
  }

  async getAttractions(lat: number, lon: number) {
    const { data } = await api.get("/v2/places", {
      params: {
        categories: "tourism.attraction",
        filter: `circle:${lon},${lat},10000`,
        limit: 20,
        apiKey: API_KEY,
      },
    });

    return data.features.map((place: any) => ({
      name: place.properties.name,
      address: place.properties.formatted,
      lat: place.properties.lat,
      lon: place.properties.lon,
    }));
  }
}