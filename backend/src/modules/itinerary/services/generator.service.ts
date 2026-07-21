import { GeoapifyService } from "./geoapify.service";
import { GroqService } from "./groq.service";
import { buildPrompt } from "./promptBuilder";

interface GenerateTripInput {
  location: string;
  budget: string;
  traveler: string;
  noOfDays: number;
}

export class GeneratorService {
  private geoService: GeoapifyService;
  private groqService: GroqService;

  constructor() {
    this.geoService = new GeoapifyService();
    this.groqService = new GroqService();
  }

  async generateTrip(data: GenerateTripInput) {
    // 1. Convert location to coordinates
    const coordinates = await this.geoService.getCoordinates(data.location);

    // 2. Fetch nearby places
    const hotels = await this.geoService.getHotels(
      coordinates.lat,
      coordinates.lon
    );

    const attractions = await this.geoService.getAttractions(
      coordinates.lat,
      coordinates.lon
    );

    const restaurants = await this.geoService.getRestaurants(
      coordinates.lat,
      coordinates.lon
    );

    // 3. Build prompt for Groq
    const prompt = buildPrompt({
      location: data.location,
      budget: data.budget,
      traveler: data.traveler,
      noOfDays: data.noOfDays,
      hotels,
      attractions,
      restaurants,
    });

    // 4. Generate itinerary
    const itinerary = await this.groqService.generateItinerary(prompt);

    return itinerary;
  }
}