import mongoose from 'mongoose'
import idvalidator from 'mongoose-id-validator'

const Schema = mongoose.Schema;
const Employer = mongoose.model('Employer');

var employerProfileSchema = new Schema({
    employer_id: {
        type: Schema.Types.ObjectId,
        ref: 'Employer',
        required: true,
        index: true
    },
    info: {
    	type: String
    },
    links: {
    	type: [String]
    },
    location: {
    	type: [Number]
    },
    attendance_date: {
    	type: Date
    },
    created_by: {
        type: Date,
        default: Date.now,
        select: false
    }
});

employerProfileSchema.plugin(idvalidator);

module.exports = mongoose.model('EmployerProfile', employerProfileSchema);