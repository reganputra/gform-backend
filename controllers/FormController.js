import mongoose from "mongoose";
import Form from "../models/Form.js";

class FormController {
  async store (req, res) {
    try {
        const form = await Form.create({
            userId: req.jwt.id,
            title: "Untitled Form",
            description: null,
            public: true
        })
        if(!form) {throw {code:400, message: "Failed to create fomr"}}

        return res.status(200).json({
            status: true,
            message: "Form created successfully",
            form
        })
    } catch (error) {
        return res.status(error.code || 500).json({
            status: false,
            message: error.message
        })
    } 
  }
}

export default new FormController();

