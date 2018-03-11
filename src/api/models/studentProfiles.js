import mongoose from 'mongoose'
import idvalidator from 'mongoose-id-validator'

const Schema = mongoose.Schema;
const User = mongoose.model('User');

var studentProfileSchema = new Schema({
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    major: {
        type: String
    },
    gpa: {
        type: Number
    },
    bio: {
        type: String
    },
    grad_date: {
        type: String //let users customize how they want to display it.
    },
    links: {
        type: [String] //array
    },
    created_by: {
        type: Date,
        default: Date.now,
        select: false
    }
});

studentProfileSchema.plugin(idvalidator);

module.exports = mongoose.model('StudentProfile', studentProfileSchema);
