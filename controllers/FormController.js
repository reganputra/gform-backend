import mongoose from "mongoose";
import Form from "../models/Form.js";

class FormController {
    async index(req, res) {
        try {

            const form = await Form.find({ userId: req.jwt.id })
            if (!form) { throw { code: 400, message: "Forms not Found" } }

            return res.status(200).json({
                status: true,
                message: "Forms found",
                total: form.length,
                form
            })

        } catch (error) {
            return res.status(error.code || 500).json({
                status: false,
                message: error.message,

            })
        }
    }

    // Create a new form
    async store(req, res) {
        try {
            const form = await Form.create({
                userId: req.jwt.id,
                title: "Untitled Form",
                description: null,
                public: true
            })
            if (!form) { throw { code: 400, message: "Failed to create form" } }

            return res.status(200).json({
                status: true,
                message: "Form created successfully",
                form
            })
        } catch (error) {
            return res.status(500).json({
                status: false,
                message: error.message
            })
        }
    }

    // Show a Form
    async show(req, res) {
        try {
            if (!req.params.id) { throw { code: 400, message: "ID Required" } }
            if (!mongoose.Types.ObjectId.isValid(req.params.id)) { throw { code: 400, message: "Invalid Form Id" } }

            const form = await Form.findOne({ _id: req.params.id, userId: req.jwt.id })
            if (!form) { throw { code: 400, message: "Form not Found" } }

            return res.status(200).json({
                status: true,
                message: "Form retrieved successfully",
                form
            })

        } catch (error) {
            return res.status(error.code || 500).json({
                status: false,
                message: error.message,

            })
        }
    }

    // Update a Form
    async update(req, res) {
        try {
            if (!req.params.id) { throw { code: 400, message: "Required Form ID" } }
            if (!mongoose.Types.ObjectId.isValid(req.params.id)) { throw { code: 400, message: "Invalid Form ID" } }

            const form = await Form.findOneAndUpdate({ _id: req.params.id, userId: req.jwt.id }, req.body, { new: true })
            if (!form) { throw { code: 400, message: "Form update Failed" } }

            return res.status(200).json({
                status: true,
                message: "Form updated successfully",
                form
            })

        } catch (error) {
            return res.status(error.code || 500).json({
                status: false,
                message: error.message,

            })
        }
    }

    async destroy(req, res) {
        try {
            if (!req.params.id) { throw { code: 400, message: "Required Form ID" } }
            if (!mongoose.Types.ObjectId.isValid(req.params.id)) { throw { code: 400, message: "Invalid Form ID" } }

            const form = await Form.findOneAndDelete({ _id: req.params.id, userId: req.jwt.id })
            if (!form) { throw { code: 400, message: "Form delete Failed" } }

            return res.status(200).json({
                status: true,
                message: "Form delete successfully",
                form
            })

        } catch (error) {
            return res.status(error.code || 500).json({
                status: false,
                message: error.message,

            })
        }
    }
}

export default new FormController();

