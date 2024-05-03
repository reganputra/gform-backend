import mongoose from "mongoose";
import Form from "../models/Form.js";

class FormController {
  async store(req, res) {
    try {
      const form = await Form.create({
        userId: req.jwt.id,
        title: "Untitled Form",
        description: null,
        public: true,
      });

      if (!form) {
        throw { code: 500, message: "failed create form" };
      }

      return res.status(200).json({
        staus: true,
        message: "Form created successfully",
        form,
      });
    } catch (error) {
      return res
        .status(error.code || 500)
        .json({ status: false, message: error.message });
    }
  }

    async show(req, res) {
      try {
        if (!req.params.id) {
          throw { code: 404, message: "Form_ID_Required" };
        }
        if (!mongoose.Schema.Types.ObjectId.isValid(req.params.id)) {
          throw { code: 404, message: "Invalid_ID" };
        }

        const form = await Form.findOne({
          _id: req.params.id,
          userId: req.jwt.id,
        });
        if (!form) {
          throw { code: 404, message: "Form_Not_Found" };
        }

        return res.status(200).json({
          staus: true,
          message: "Form_Found",
          form,
        });
      } catch (error) {
        return res
          .status(error.code || 500)
          .json({ status: false, message: error.message });
      }
    }
}

export default new FormController();
