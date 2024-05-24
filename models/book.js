const { Schema, model, default: mongoose } = require("mongoose");

const bookSchema = new Schema({
    title: { type: String, required: true },
    coverImage: { type: String, required: true },
    author: { type: String, required: true },
    description: { type: String, required: true },
    isbnNumber: { type: Number, required: true },
    price: { type: Number, required: true },
});

const Book = model('Book', bookSchema);

module.exports = Book;
