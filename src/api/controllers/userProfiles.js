import mongoose from 'mongoose'
const User = mongoose.model('User');
const StudentProfile = mongoose.model('StudentProfile');
const RecruiterProfile = mongoose.model('RecruiterProfile');

import response from './response.js'


//GET /userProfiles/auth
function getProfileByAuthUser(req, res) {
    return getProfile(req, res, req.user._id, req.user.user_type);
}

//GET /userProfiles?user_id=xxx
function getProfileByQuery(req, res) {
    if (req.query.user_id) {
        return User.findOne({ _id: req.query.user_id }).exec(function (err, foundUser) {
            if (err) {
                return res.status(500).json({
                    "message": err
                });
            }

            return getProfile(req, res, foundUser._id, foundUser.user_type);
        })
    } else {
        return res.status(400).json({
            "message": response.getProfileMissingUserId
        });
    }
}

//helper: routes connect to this
function getProfile(req, res, userId, userType) {

    if (userType === 'student') {

        try {
            return StudentProfile.findOne({ user_id: userId }).exec(function (err, studentProf) {
                if (err) {
                    return res.status(500).json({
                        "message": err
                    });
                }

                return res.status(200).json(studentProf);
            });
        } catch (err) {
            return res.status(500).json({
                "message": err
            });
        }

    } else if (userType === 'recruiter') {

        /*return res.status(501).json({
            "message": "Recruiter profiles not implemented."
        });*/
        
        try {
            return RecruiterProfile.findOne({ user_id: userId }).exec(function (err, recruiterProf) {
                if (err) {
                    return res.status(500).json({
                        "message": err
                    });
                }

                return res.status(200).json(recruiterProf);
            });
        } catch (err) {
            return res.status(500).json({
                "message": err
            });
        }

    } else {
        return res.status(401).json({
            "message": response.profileNoAdmins
        });
    }        
}

//PUT /userProfiles
//you can only modify your own profile.
async function putProfile(req, res) {
    //force update to only be own profile (ensure that user_id field isn't overwritten by client.)
    req.body.user_id = req.user._id;

    if (req.user.user_type === 'student') {
        try {
            return StudentProfile.findOneAndUpdate(
                { user_id: req.user._id }, req.body, {upsert: true, new: true}) //upsert: insert if doesn't exist
                .exec(function(err, studentProf) {

                if (err) {
                    return res.status(500).json({
                        "message": err
                    });
                }

                return res.status(200).json(studentProf);
            });
        } catch (err) {
            return res.status(500).json({
                "message": err
            });
        }
        
    } else if (req.user.user_type === 'recruiter') {
        /*
        return res.status(501).json({
            "message": "Recruiter profiles not implemented."
        });*/        
        
        try {
            return RecruiterProfile.findOneAndUpdate(
                { user_id: req.user._id }, req.body, {upsert:true, new: true}) //upsert: insert if doesn't exist
                .exec(function(err, recruiterProf) {

                if (err) {
                    return res.status(500).json({
                        "message": err
                    });
                }

                return res.status(200).json(recruiterProf);
            });
        } catch (err) {
            return res.status(500).json({
                "message": err
            });
        }

    } else {
        return res.status(401).json({
            "message": response.profileNoAdmins
        });
    }
}

export default { getProfileByAuthUser, getProfileByQuery, putProfile }