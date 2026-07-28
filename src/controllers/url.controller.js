import { nanoid } from "nanoid";
import validator from "validator";
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

    if (
      !validator.isURL(originalUrl, {
        protocols: ["http", "https"],
        require_protocol: true,
      })
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid URL.",
      });
    }

    const existingUrl = await Url.findOne({ originalUrl });

    if (existingUrl) {
      return res.status(200).json({
        success: true,
        message: "Short URL already exists",
        data: {
          ...existingUrl.toObject(),
          shortUrl: `${req.protocol}://${req.get("host")}/${existingUrl.shortCode}`,
        },
      });
    }

    const shortCode = nanoid(6);

    const newUrl = await Url.create({
      originalUrl,
      shortCode,
    });

    return res.status(201).json({
      success: true,
      message: "Short URL created successfully",
      data: {
        ...newUrl.toObject(),
        shortUrl: `${req.protocol}://${req.get("host")}/${newUrl.shortCode}`,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const redirectToOriginalUrl = async (req, res) => {
  try {
    const { shortCode } = req.params;

    const url = await Url.findOne({ shortCode });

    if (!url) {
      return res.status(404).json({
        success: false,
        message: "Short URL not found",
      });
    }

    url.clicks += 1;
    await url.save();

    return res.redirect(url.originalUrl);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
