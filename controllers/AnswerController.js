import mongoose from "mongoose";
import Form from "../models/Form.js";
import Answer from "../models/Answer.js";
import answerDuplicate from "../libraries/answerDuplicate.js";
import questionRequiredButEmpty from "../libraries/questionRequiredButEmpty.js";
import optionValueNoExist from "../libraries/optionValueNoExist.js";
import questionIdNotValid from "../libraries/questionIdNotValid.js";
import emailNotValid from "../libraries/emailNotValid.js";



class AnswerController {

    async store(req, res) {
        try {
        if(!req.params.formId) {throw{code: 400, message: "Required_Form_ID" }}
        if(!mongoose.Types.ObjectId.isValid(req.params.formId)) {throw{code: 400, message: Invalid_ID}}

        const form = await Form.findById(req.params.formId)

        const isDuplicated = await answerDuplicate(req.body.answers)
        if(isDuplicated) {throw{code: 400, message: "Duplicate_Answer"}}

        const questionRequiredEmpty = await questionRequiredButEmpty(form, req.body.answers)
        if(questionRequiredEmpty) {throw{code: 400, message: "Required_Question_Is_Empty"}}

        const optionNotExist = await optionValueNoExist(form, req.body.answers)
        if(optionNotExist.length > 0) {throw{code: 400, message: "Required_Value_Is_Empty", question: optionNotExist[0].question}}

        const questionNotExist = await questionIdNotValid(form, req.body.answers)
        if(questionNotExist.length > 0) {throw{code: 400, message: "Question_Is_Not_Exist", question: questionNotExist[0].questionId }}

        const emailIsNotValid = await emailNotValid(form, req.body.answers)
        if(emailIsNotValid.length > 0) {throw{code: 400, message: "Email_Is_Not_Valid", question: emailIsNotValid[0].questionId }}


        let fields = {}
        req.body.answers.forEach(answer => {
            fields[answer.questionId] = answer.value
        })

        const answers = await Answer.create({
            formId: req.params.formId,
            userId: req.jwt.id,
            ...fields
        })
        if(!answers) {throw{ code: 400, message: "Answer_Failed"}}

        return res.status(200).json({
            status: true,
            message: "Answer_Success",
            answers
        })
        
        } catch (error) {
            res.status(error.code || 500)
                .json({
                    status: false,
                    message: error.message,
                    question: error.question || null
                })
        }
    }

}

export default new AnswerController();