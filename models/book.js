const { Schema, model, default: mongoose } = require("mongoose");

const bookSchema = new Schema({
    title: { type: String, required: [true,"title is required"],trim:true,minlength : 5},
    coverImage: { type: String, required: [true,"CoverImage is required"],trim:true},
    author: { type: String, required: [true,"Author Name is Required"],trim:true },
    description: { type: String, required: true,trim:true },
    isbnNumber: { type: Number, required: true,trim:true },
    price: { type: Number, required: true,trim:true },
});

const Book = model('Book', bookSchema);

module.exports = Book;
