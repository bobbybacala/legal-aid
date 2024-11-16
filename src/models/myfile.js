// the schema for myfile object in mongo db
import mongoose from 'mongoose'

// schema object
const Schema = mongoose.Schema;

// schema defined for myFile
const MyFileSchema = new Schema({
    fileName: {
        type: String,
        required: [true, 'Filename is a required field.'],
        trim: true,
        maxLength: 500,
        unique: true,
    },
    fileUrl: {
        type: String,
        required: [true, 'File Url is a required field.'],
        trim: true,
        maxLength: 500,
        unique: true,
    },
    isProcessed: {
        type: Boolean,
        default: false,
    },
    vectorIndex: {
        type: String,
        maxLength: 500,
        unique: true,
        required: false,
    },
}, {
    timestamps: true,
});

// convert the schema to model and export it
const MyFileModel = mongoose.models.myFile || mongoose.model('myFile', MyFileSchema);


export default MyFileModel;