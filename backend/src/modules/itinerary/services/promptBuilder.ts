interface PromptInput {
  location: string;
  noOfDays: number;
  budget: string;
  traveler: string;
  hotels: any[];
  attractions: any[];
  restaurants: any[];
}

export function buildPrompt(data: PromptInput): string {
  return `
You are an expert travel planner.

Generate a travel itinerary in STRICT JSON.

DO NOT write markdown.
DO NOT use \`\`\`.
DO NOT explain anything.

Destination:
${data.location}

Trip Duration:
${data.noOfDays} days

Traveller:
${data.traveler}

Budget:
${data.budget}

Available Hotels:
${JSON.stringify(data.hotels, null, 2)}

Available Tourist Attractions:
${JSON.stringify(data.attractions, null, 2)}

Nearby Restaurants:
${JSON.stringify(data.restaurants, null, 2)}

Rules:

1. Use ONLY the hotels listed above.
2. Use ONLY the attractions listed above.
3. Suggest restaurants whenever appropriate.
4. Divide attractions across ${data.noOfDays} days.
5. Avoid repeating attractions.
6. Start sightseeing around 9 AM.
7. Finish each day around 7 PM.
8. Keep travel realistic.
9. Choose hotels according to the ${data.budget} budget.
10. If information like rating or price is unavailable, make a reasonable estimate.

Return ONLY this JSON:

{
  "location": "${data.location}",
  "budget": "${data.budget}",
  "noOfDays": ${data.noOfDays},
  "traveler": "${data.traveler}",

  "hotels":[
    {
      "hotelName":"",
      "hotelAddress":"",
      "price":"",
      "hotelImageUrl":"",
      "geoCoordinates":{
        "lat":0,
        "lon":0
      },
      "rating":4.5,
      "description":""
    }
  ],

  "itinerary":[
    {
      "day":1,
      "plan":[
        {
          "placeName":"",
          "placeDetails":"",
          "placeImageUrl":"",
          "geoCoordinates":{
            "lat":0,
            "lon":0
          },
          "ticketPricing":"",
          "rating":4.5,
          "timeToTravel":"",
          "bestTimeToVisit":""
        }
      ]
    }
  ]
}
`;
}