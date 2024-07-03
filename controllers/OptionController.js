import mongoose from "mongoose";
import Form from "../models/Form.js";

class OptionController {

    // Add option
    async store (req, res) {
        try {
            if(!req.params.id) { throw { code: 400, message: "ID_REQUIRED" } }
            if(!req.params.questionId) { throw { code: 428, message: "QUESTION_ID_REQUIRED" } }
            if(!mongoose.Types.ObjectId.isValid(req.params.id)) { throw { code: 400, message: "INVALID_ID" } }
            if(!mongoose.Types.ObjectId.isValid(req.params.questionId)) { throw { code: 400, message: "INVALID_QUESTION_ID" } }
            if(!req.body.option) {throw{code: 400, message:"Required_Option"}}


            const option = {
                id: new mongoose.Types.ObjectId(),
                value: req.body.option
            }    
        
            const form = await Form.findOneAndUpdate({_id: req.params.id, userId: req.jwt.id}, 
                {$push: {"questions.$[indexQuestion].options": option}}, 
                { 
                    arrayFilters: [{"indexQuestion.id": new mongoose.Types.ObjectId(req.params.questionId)}],
                    new: true 
                })

                if(!form) {throw{code: 400, message: "Add_Option_Failed"}}

                return res.status(200).json({
                    status: true,
                    message: "Add_Option_Success",
                    option
                })

        } catch (error) {
            res.status(error.code || 500)
                .json({
                    status: false,
                    message: error.message
                })
        }
    }

    // Update option
    async update (req, res) {
        try {
            if(!req.params.id) { throw { code: 400, message: "ID_REQUIRED" } }
            if(!req.params.questionId) { throw { code: 428, message: "QUESTION_ID_REQUIRED" } }
            if(!req.params.optionId) { throw { code: 428, message: "QUESTION_ID_REQUIRED" } }
            if(!mongoose.Types.ObjectId.isValid(req.params.id)) { throw { code: 400, message: "INVALID_ID" } }
            if(!mongoose.Types.ObjectId.isValid(req.params.questionId)) { throw { code: 400, message: "INVALID_QUESTION_ID" } }
            if(!mongoose.Types.ObjectId.isValid(req.params.optionId)) { throw { code: 400, message: "INVALID_OPTION_ID" } }
            if(!req.body.option) {throw{code: 400, message:"Required_Option"}}


           
    
            const form = await Form.findOneAndUpdate({_id: req.params.id, userId: req.jwt.id}, 
                {$set: {"questions.$[indexQuestion].options.$[indexOption].value": req.body.option}}, 
                { 
                    arrayFilters: [ 
                        {"indexQuestion.id": new mongoose.Types.ObjectId(req.params.questionId)},
                        {"indexOption.id": new mongoose.Types.ObjectId(req.params.optionId) }
                    ],
                    new: true 
                })

                if(!form) {throw{code: 400, message: "Add_Option_Failed"}}

                return res.status(200).json({
                    status: true,
                    message: "Update_Option_Success",
                    option: {
                        id: req.params.optionId,
                        value: req.body.option
                    }
                })

        } catch (error) {
            res.status(error.code || 500)
                .json({
                    status: false,
                    message: error.message
                })
        }
    }

    // Delete option
    async destroy (req, res) {
        try {
            if(!req.params.id) { throw { code: 400, message: "ID_REQUIRED" } }
            if(!req.params.questionId) { throw { code: 428, message: "QUESTION_ID_REQUIRED" } }
            if(!req.params.optionId) { throw { code: 428, message: "QUESTION_ID_REQUIRED" } }
            if(!mongoose.Types.ObjectId.isValid(req.params.id)) { throw { code: 400, message: "INVALID_ID" } }
            if(!mongoose.Types.ObjectId.isValid(req.params.questionId)) { throw { code: 400, message: "INVALID_QUESTION_ID" } }
            if(!mongoose.Types.ObjectId.isValid(req.params.optionId)) { throw { code: 400, message: "INVALID_OPTION_ID" } }

    
            const form = await Form.findOneAndUpdate({_id: req.params.id, userId: req.jwt.id}, 
                {
                    $pull: {
                        "questions.$[indexQuestion].options": { 
                            id: new mongoose.Types.ObjectId(req.params.optionId) 
                        }
                    }
                },

                { 
                    arrayFilters: [ 
                        {"indexQuestion.id": new mongoose.Types.ObjectId(req.params.questionId)}
                    ],
                    new: true 
                })

                if(!form) {throw{code: 400, message: "Add_Option_Failed"}}

                return res.status(200).json({
                    status: true,
                    message: "Delete_Option_Success",
                    form
                })

        } catch (error) {
            res.status(error.code || 500)
                .json({
                    status: false,
                    message: error.message
                })
        }
    }
}

export default new OptionController();