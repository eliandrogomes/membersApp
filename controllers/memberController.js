const { MemberModel } = require("../models/MemberModel");
const dynamoose = require('dynamoose');
const uuid = require('uuid');

// list all members (no pagination)
const listMembers = async (req, res) => {
    try {
        // .attributes(["memberId", "firstName"])
        const myMembers = await MemberModel.scan().exec();
        res.json({ success: true, data: myMembers });
    } catch (error) {
        console.log(error);
        res.status(400).json({ success: false, msg: "Could not retreive members" });
    }
}

// get one member data 
const getMember = (req, res) => {
    const { memberId } = req.params;
    MemberModel.get(memberId, (error, myMember) => {
        if (!myMember || error) {
            res.status(400).json({ success: false, msg: `Member id ${memberId} not found!` });
        } else {
            res.json({ success: true, data: myMember });
        }
    });
}

// create a new member
const createMember = async (req, res) => {
    try {
        // const { firstName, lastName, middleInitial, phoneNumber, email, gender } = req.body;
        // const data = {
        //     memberId: uuid.v4(),        
        //     firstName: firstName, 
        //     lastName: lastName, 
        //     middleInitial: middleInitial, 
        //     phoneNumber: phoneNumber, 
        //     email: email, 
        //     gender: gender
        // }

        // verify is the member already exists
        const { email } = req.body;
        let memberFound = await MemberModel.findByEmail(email);
        if (memberFound.count > 0) {
            res.json({success: false, msg: "Member alread exists" });    
        } else {
            // add new member
            const data = {...req.body};
            data.memberId = uuid.v4();
            const result = await MemberModel.create(data);
            res.json({success: true, data: result });
        }
    } catch (error) {
        console.log(error);
        res.status(400).json({success: false, msg: "Could not create the member", error: error });
    }
}

// update part of the object
const updatePartialMember = async (req, res) => {
    const { memberId } = req.params;
    const data = {...req.body};
    const condition = new dynamoose.Condition().where("memberId").eq(memberId);
    try {
        let myMember = await MemberModel.update(
            { "memberId": memberId }, 
            { "$SET": data },
            { "condition": condition }
        );
        res.json({ success: true, data: myMember });
    } catch (error) {
        console.log(error);
        res.status(400).json({ success: false, msg: "Could not update member data", error: error });
    };
}

// update whole object
const updateMember = async (req, res) => {
    const { memberId } = req.params;
    const { firstName, lastName, middleInitial, phoneNumber, email, gender } = req.body;
    const data = {
        firstName: firstName, 
        lastName: lastName, 
        middleInitial: middleInitial, 
        phoneNumber: phoneNumber, 
        email: email, 
        gender: gender
    }
    const condition = new dynamoose.Condition().where("memberId").eq(memberId);
    try {
        let myMember = await MemberModel.update({ "memberId": memberId }, data, { "condition": condition });
        res.json({ success: true, data: myMember });
    } catch (error) {
        console.log(error);
        res.status(400).json({ success: false, msg: "Could not update member data", error: error });
    };
}

// remove the member if exists in the database
const removeMember = async (req, res) => {
    const { memberId } = req.params;
    const condition = new dynamoose.Condition().where("memberId").eq(memberId);
    try {
        await MemberModel.delete({ memberId: memberId }, { "condition": condition });
        res.json({ success: true });
    } catch (error) {
        res.status(400).json({ success: false, msg: `Member id ${memberId} not found or not removed!`, error: error })
    }
}

module.exports = {
    getMember, listMembers, createMember, updateMember, updatePartialMember, removeMember
};