import { Company } from "../models/company.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
// import getDataUri from "../utils/datauri.js";
// import cloudinary from "../utils/cloudinary.js";

export const registerCompany = async (req, res) => {
  try {
    const { companyName } = req.body;
    if (!companyName) {
      return res.status(400).json({
        message: "Company name is required.",
        success: false,
      });
    }
    let company = await Company.findOne({ name: companyName });
    if (company) {
      return res.status(400).json({
        message: "You can't register same company.",
        success: false,
      });
    }
    company = await Company.create({
      name: companyName,
      userId: req.id,
    });

    return res.status(201).json({
      message: "Company registered successfully.",
      company,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};
export const getCompany = async (req, res) => {
  try {
    const userId = req.id; // logged in user id
    const companies = await Company.find({ userId });
    if (!companies) {
      return res.status(404).json({
        message: "Companies not found.",
        success: false,
      });
    }
    return res.status(200).json({
      companies,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};
// get company by id
export const getCompanyById = async (req, res) => {
  try {
    const companyId = req.params.id;
    const company = await Company.findById(companyId);
    if (!company) {
      return res.status(404).json({
        message: "Company not found.",
        success: false,
      });
    }
    return res.status(200).json({
      company,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};
export const updateCompany = async (req, res) => {
  try {
    const { id } = req.params;

    // Optional fields – allow partial updates
    const { name, description, website, location } = req.body;

    // Build update payload only with provided fields
    const updateData = {};
    if (typeof name !== "undefined") updateData.name = name;
    if (typeof description !== "undefined") updateData.description = description;
    if (typeof website !== "undefined") updateData.website = website;
    if (typeof location !== "undefined") updateData.location = location;

    // Handle optional logo upload (Multer: upload.single("logo"))
    // NOTE: req.file is present only if a file was sent in the request
    if (req.file?.path) {
      const cloudResponse = await uploadOnCloudinary(req.file.path);
      if (!cloudResponse?.secure_url) {
        return res.status(500).json({
          success: false,
          message: "Logo upload failed. Please try again.",
        });
      }
      updateData.logo = cloudResponse.secure_url; // Only set when a new file was uploaded
    }

    // If the client sent nothing, bail early
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No fields to update.",
      });
    }

    const company = await Company.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Company information updated.",
      company, // return updated doc (useful for UI)
    });
  } catch (error) {
    console.error("updateCompany error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error.",
    });
  }
};