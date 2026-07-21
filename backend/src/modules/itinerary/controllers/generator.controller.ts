import { Request, Response } from "express";
import { GeneratorService } from "../services/generator.service";

const generatorService = new GeneratorService();

export const generateTrip = async (req: Request, res: Response) => {
  try {
    const { location, budget, traveler, noOfDays } = req.body;

    if (!location || !budget || !traveler || !noOfDays) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    const itinerary = await generatorService.generateTrip({
      location,
      budget,
      traveler,
      noOfDays,
    });

    return res.status(200).json({
      success: true,
      data: itinerary,
    });
  } catch (error: any) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};