const mongoose = require("mongoose")

const booksSchema = new mongoose.Schema({
    title: String,
    author: String,
    publishedYear: Number,
    genre: [String],
    language: String,
    country: String,
    rating: Number,
    summary: String,
    coverImageUrl: String,

})

const Books = mongoose.model("Books", booksSchema)

module.exports = Books