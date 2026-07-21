import { Router } from "express";
import { isAuthenticated } from "../../user/middlewares/user.middleware";
import {
  saveItinerary,
  getAItinerary,
  getUsersItinerary,
} from "../controllers/itinerary.controller";
import { generateTrip } from "../controllers/generator.controller";

const itineraryRouter = Router();

// NEW ROUTE
itineraryRouter.post("/generate", isAuthenticated, generateTrip);

// Existing routes
itineraryRouter.post("/", isAuthenticated, saveItinerary);
itineraryRouter.get("/:tripId", isAuthenticated, getAItinerary);
itineraryRouter.get("/", isAuthenticated, getUsersItinerary);

export { itineraryRouter };