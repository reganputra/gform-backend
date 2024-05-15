import mongoose from "mongoose";
import Form from "../models/Form.js";

class QuestionController {

    // Add Question
    async store(req, res) {
        try {
            if(!req.params.id) {throw {code: 400, message: "Required_Fomr_ID"}}
            if(!mongoose.Types.ObjectId.isValid(req.params.id)) {throw {code: 400, message: "Required_Form_ID"}}

            const newQuestion = {
                _id: new mongoose.Types.ObjectId(),
                questions: null,
                type: "Text",
                required: false,
                option: []
            }

            const form = await Form.findOneAndUpdate({_id: req.params.id, userId: req.jwt.id}, {$push: {questions: newQuestion}}, {new: true})
            if(!form) {throw {code: 400, message: "Form not found"}}

            return res.status(200)
            .json({
                status: true,
                message: "Question added successfully",
                question: newQuestion
            })
        } catch (error) {
            return res.status(error.code || 500).json({
                status: false,
                message: error.message,

            })
        }
    }

    // Update Question
    async update(req, res) {
        try {
            if(!req.params.id) {throw{code: 400, message: "Required_Form_ID"}}
            if(!req.params.questionId) {throw{code: 400, message: "Required_Question_ID"}}
            if(!mongoose.Types.ObjectId.isValid(req.params.id)) {throw{code: 400, message: "Required_Question_ID"}}
            if(!mongoose.Types.ObjectId.isValid(req.params.questionId)) {throw{code: 400, message: "Invalid_ID"}}

            const question = await Form.findOneAndUpdate(
                { _id: req.params.id, userId: req.jwt.id},
                 {$set: {'questions.$[indexQuestion.id].question': req.body.question}},
                {arrayFilters: [{'indexQuestion.id':  mongoose.Types.ObjectId(req.params.questionId)}], new:true }
                )
            
                if(!form) {throw {code: 400, message: "Question_Update_Failed"}}

            return res.status(200).json({
                status: true,
                message: "Question updated successfully",
                question
            })
        } catch (error) {
            return res.status(error.code || 500).json({
                status: false,
                message: error.message,

            })
        }
    }
}

export default new QuestionController();

