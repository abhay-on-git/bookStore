var express = require("express");
const Book = require("../models/book");
const multer = require("multer");
const mongoose = require('mongoose');
const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    newFile = Date.now() + "-" + file.originalname;
    cb(null, newFile);
  },
});

const upload = multer({ storage: storage });

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("home");
});
router.get("/library", async function (req, res, next) {
  try {
    const allBooks = await Book.find({});
    res.render("library", {
      books: allBooks,
    });
  } catch (error) {
    console.log('error in rendering the books')
    console.log(error.message);
    res.send(error);
  }
});
router.get("/about", function (req, res, next) {
  res.render("about");
});
router.get("/readBook/:id", async function (req, res, next) {
  const bookID = new mongoose.Types.ObjectId(req.params.id);
  try {
    const book = await Book.findById(bookID);
    res.render("readBook",{book});
  } catch (error) {
    console.log('error in reading book');
    console.log(error.message);
    res.send(error.message);
  }
});
router.post("/createBook", upload.single("coverImage"), async (req, res) => {
  try {
    const { bookTitle, bookAuthor, bookDescription, isbnNumber, price } = req.body;
    console.log('Received data:', req.body);
    console.log('Received file:', req.file);
    
    if (!req.file) {
      throw new Error('File not uploaded');
    }

    const book = await Book.create({
      title:bookTitle,
      coverImage: `/uploads/${req.file.filename}`,
      author:bookAuthor,
      description:bookDescription,
      isbnNumber:isbnNumber,
      price:price,
    });
    
    console.log('Book created successfully:', book);
    res.redirect("/library");
  } catch (error) {
    console.log('Error in creating the book');
    console.log(error.message);
    res.status(500).send(error.message);
  }
});

module.exports = router;
