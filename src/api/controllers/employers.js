import mongoose from 'mongoose'
const User = mongoose.model('User');
const Employer = mongoose.model('Employer');
const Line = mongoose.model('Line');

import response from './response.js'

// get /employers/auth
function getEmployerByAuthUser(req, res) {
    if (req.user.user_type === 'recruiter') {
        //return the company that this recruiter works for.
        User.findById(req.user._id).exec( function(err, user){
            if (err)
                return res.send(err);
            Employer.findById(user.employer_id).exec( function(err, employer){
                if (err)
                    return res.send(err);
                res.status(200).json(employer);
            });
        });
    } else if (req.user.user_type === 'student') {
        //check if the student has the company(ies) favorited.
        if (req.query.name) {
            Employer.findOne({name: req.query.name}).lean().exec(async function (err, employer) {
                if (err) {
                    return res.status(500).json({
                        "message": err
                    });
                }

                let thisUser = await User.findOne({ _id: req.user._id}).exec();
                if (thisUser.favorites.includes(employer._id.toString())) {
                    employer.favorite = "true";
                }
                return res.status(200).json(employer);
            });
        } else {
            Employer.find({ }).lean().exec(async function (err, employers) {
                if (err) {
                    return res.status(500).json({
                        "message": err
                    });
                }

                let thisUser = await User.findOne({ _id: req.user._id}).exec();

                employers.forEach(function(employer) {
                    if (thisUser.favorites.includes(employer._id.toString())) {
                        employer.favorite = "true";
                    }
                });  

                return res.status(200).json({
                    "employers": employers
                });
            });
        }
    } else {
        //admin
        return getEmployerBySearch(req, res);
    }
}

// get /employers/:id
// UNAUTHENTICATED ROUTE
function getEmployerById(req, res) {
    Employer.findById(req.params.id).exec(function (err, employer) {
        if (err)
            return res.send(err);
        res.status(200).json(employer);
    });
};

// get /employers, also:
// get /employers?name=XXX
// UNAUTHENTICATED ROUTE
function getEmployerBySearch(req, res) {
    if (!req.query.name) { //just return list of all employers
        Employer.find( { } ).exec(function (err, employers) {
            if (err)
                return res.send(err);
            res.status(200).json({
                "employers": employers
            });
        });
    } else {
        Employer.findOne({name: req.query.name}).exec(function (err, employer) {
            if (err)
                return res.send(err);
            res.status(200).json(employer);
        });
    }
};

// post employers
function createEmployer(req, res) {
    if (!req.body.name) {
        res.status(400).json({
            "message": response.postEmployersMissingNameBody
        });
    } else {
        var newEmployer = Employer();
        newEmployer.name = req.body.name;
        newEmployer.passcode = Employer.generateRandomCode();

        //if randomly generated code happens to be a duplicate, just have client try again.
        newEmployer.save(function(err){
            if(err)
                return res.send(err);
            res.status(200).json(newEmployer);
        });
    }
};

// put employers/:id
function updateEmployer(req, res) {

    Employer.findByIdAndUpdate({_id: req.params.id}, req.body, {new: true}).exec(function (err, employer) {
        if (err)
            return res.send(err);
        res.status(200).json(employer);
    })

};

// delete employers/:id
function deleteEmployer(req, res) {

    Employer.remove({_id: req.params.id}).exec(function (err, employer) {
        if (err)
            res.send(err);
        res.status(200).json({
            "message": response.success
        });
    });
    
};

// patch employers/auth/profile
function patchEmployersProfileByAuthUser(req, res) {

    if (req.user.user_type !== 'recruiter') {
        res.status(401).json({
            "message": response.onlyRecruiters
        });
    } else if (!req.body) {
        res.status(400).json({
            "message": response.patchEmployersMissingDataBody 
        });
    } else {

        try {
            return Employer.findById(req.user.employer_id).exec(function(err, employer) {
                employer.profile = req.body;
                employer.save(function(err, employer) {
                    if (err)
                        return res.send(err);
                    return res.status(200).json(employer);
                });
            });
        } catch (err) {
            return res.status(500).json({
                "message": err
            });
        }
    }
}

export default { getEmployerBySearch, getEmployerByAuthUser, getEmployerById, createEmployer, updateEmployer, deleteEmployer, patchEmployersProfileByAuthUser }

