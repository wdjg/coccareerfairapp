import mongoose from 'mongoose'
import idvalidator from 'mongoose-id-validator'

const Schema = mongoose.Schema;
const User = mongoose.model('User');

var recruiterProfileSchema = new Schema({
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    bio: {
        type: String
    },
    job_title: {
        type: String
    },
    created_by: {
        type: Date,
        default: Date.now,
        select: false
    }
});

recruiterProfileSchema.plugin(idvalidator);

module.exports = mongoose.model('RecruiterProfile', recruiterProfileSchema);
