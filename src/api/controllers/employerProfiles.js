import mongoose from 'mongoose'
const User = mongoose.model('User');
const EmployerProfile = mongoose.model('EmployerProfile');

import response from './response.js'

//GET /employerProfiles/auth
function getProfileByAuthUser(req, res) {
    if (req.user.user_type !== 'recruiter') {
        return res.status(401).json({
            "message": response.onlyRecruiters
        });
    }

    return getProfile(req, res, req.user.employer_id);
}

//GET /employerProfiles?employer_id=xxx
function getProfileByQuery(req, res) {
    if (!req.query.employer_id) {
        return res.status(400).json({
            "message": response.getEmployerProfilesMissingEmployerId
        });
    }

    return getProfile(req, res, req.query.employer_id);
}

//helper: routes connect to this
function getProfile(req, res, empId) {

    try {
        return EmployerProfile.findOne({ employer_id: empId }).exec(function (err, employerProf) {
            if (err) {
                return res.status(500).json({
                    "message": err
                });
            }

            return res.status(200).json(employerProf);
        });
    } catch (err) {
        return res.status(500).json({
            "message": err
        });
    }
     
}

//PUT /employerProfiles
//you can only modify your own company's profile.
//Recruiters only.
async function putProfile(req, res) {
    //force update to only be own profile (ensure that employer_id field isn't overwritten by client.)
    req.body.employer_id = req.user.employer_id;

    if (req.user.user_type !== 'recruiter') {
        return res.status(401).json({
            "message": response.onlyRecruiters
        });
    }

    try {
        return EmployerProfile.findOneAndUpdate(
            { employer_id: req.user.employer_id }, req.body, {upsert: true, new: true}) //upsert: insert if doesn't exist
            .exec(function(err, employerProf) {

            if (err) {
                return res.status(500).json({
                    "message": err
                });
            }

            return res.status(200).json(employerProf);
        });
    } catch (err) {
        return res.status(500).json({
            "message": err
        });
    }
}

export default { getProfileByAuthUser, getProfileByQuery, putProfile }