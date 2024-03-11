//import mongoose from "mongoose";
const mongoose = require('mongoose');

// modelo de book
const bookSchema = new mongoose.Schema(
    {
        title: String,
        author: String,
        genre: String,
        publication_date: String
    }
)

// se exporta como un modelo de mongo
module.exports = mongoose.model('Book', bookSchema);