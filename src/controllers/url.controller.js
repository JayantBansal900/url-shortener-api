import { nanoid } from "nanoid";
import Url from "../models/url.model.js";

export const createShortUrl = async (req, res) => {
  try {
    const { originalUrl } = req.body;

    if (!originalUrl) {
      return res.status(400).json({
        success: false,
        message: "Original URL is required",
      });
    }

    const shortCode = nanoid(6);

    const newUrl = await Url.create({
      originalUrl,
      shortCode,
    });

    res.status(201).json({
      success: true,
      message: "Short URL created successfully",
      data: newUrl,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
