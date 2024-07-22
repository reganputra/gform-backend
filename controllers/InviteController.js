import mongoose, { trusted } from "mongoose";
import Form from "../models/Form.js"
import User from "../models/User.js";
import isEmailValid from "../libraries/isEmailValid.js";

class InviteController {

    async index (req, res) {
        try {
            if(!req.params.id) {throw { code: 400, message: "Required_Form_Id"}}
            if(!mongoose.Types.ObjectId.isValid(req.params.id)) {throw {code: 400, message:"Invalid_Id"}}
    
            // Check email not found
            const form = await Form.findOne({_id: req.params.id, userId: req.jwt.id}).select("invites")
            if(!form) {throw{code: 404, message: "Invites_Not_Found"}}
    
            return res.status(200)
                        .json({
                            status: true,
                            message: "Invite_Found",
                            invites: form.invites
                        })
    
            } catch (error) {
                res.status(error.code || 500)
                    .json({
                        status: false,
                        message: error.message
                    })
            }
    }
    
    async store(req, res){
        try {
        if(!req.params.id) {throw { code: 400, message: "Required_Form_Id"}}
        if(!req.body.email) {throw { code: 400, message: "Required_Email"}}
        if(!mongoose.Types.ObjectId.isValid(req.params.id)) {throw {code: 400, message:"Invalid_Id"}}

        //Check user cant invite himself
        const user = await User.findOne({_id: req.jwt.id, email: req.body.email})
        if(user) {throw {code: 400, message:"Cannot_Invite_Yourself"}}    
          
        // Check is email invited
        const emailInvited = await Form.findOne({_id: req.params.id, userId: req.jwt.id, invites: {"$in": req.body.email}})
        if(emailInvited) {throw{code: 400, message: "Email_Already_Invited"}}

        // Check email 
        if(!isEmailValid(req.body.email))
            {throw {code: 400, message:"Invalid_Email"}}


        const form = await Form.findOneAndUpdate({ _id: req.params.id, userId: req.jwt.id},
             {$push: {invites: req.body.email} }, 
             {new: true})

        if(!form) {throw {code: 400, message: "Invite_Failed"}}

        return res.status(200)
                    .json({
                        status: true,
                        message: "Invite_Success",
                        email: req.body.email
                    })

        } catch (error) {
            res.status(error.code || 500)
                .json({
                    status: false,
                    message: error.message
                })
        }
    }

    async destroy(req, res){
        try {
        if(!req.params.id) {throw { code: 400, message: "Required_Form_Id"}}
        if(!req.body.email) {throw { code: 400, message: "Required_Email"}}
        if(!mongoose.Types.ObjectId.isValid(req.params.id)) {throw {code: 400, message:"Invalid_Id"}}

        // Check email not found
        const emailIsExist = await Form.findOne({_id: req.params.id, userId: req.jwt.id, invites: {"$in": req.body.email}})
        if(!emailIsExist) {throw{code: 404, message: "Email_Not_Found"}}

        // Check email 
        if(/[a-z0-9]+@[a-z]+\.[a-z]{2,3}/.test(req.body.email) === false)
            {throw {code: 400, message:"Invalid_Email"}}


        const form = await Form.findOneAndUpdate({ _id: req.params.id, userId: req.jwt.id},
             {$pull: {invites: req.body.email} }, 
             {new: true})

        if(!form) {throw {code: 500, message: "Remove_Invite_Failed"}}

        return res.status(200)
                    .json({
                        status: true,
                        message: "Remove_Invite_Success",
                        email: req.body.email
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

export default new InviteController();