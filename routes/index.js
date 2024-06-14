var express = require("express");
const Book = require("../models/book");
const mongoose = require('mongoose');
const router = express.Router();
const checkprice = require('../utils/checkPrice')
const upload = require('../utils/multer')
const path = require('path')
const fs = require('fs')
const sendmail = require("../utils/mailer").sendmail; // Correct import


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
  const bookID = req.params.id;
  try {
    const book = await Book.findById(bookID);
    res.render("readBook",{book});
  } catch (error) {
    console.log('error in reading book');
    console.log(error.message);
    res.send(error.message);
  }
});
router.post("/createBook",upload.single("coverImage"), async (req, res) => {
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

router.post('/delete/:id', async (req, res) => {
  const bookID = req.params.id;
  try {
    const book = await Book.findByIdAndDelete(bookID);
    fs.unlinkSync(path.join(__dirname, `../uploads/${book.coverImage}`));
    console.log(`Book with ID ${bookID} deleted`);
    res.redirect('/library');
  } catch (error) {
    console.log('Error in deleting the book');
    console.log(error.message);
    res.status(500).send(error.message);
  }
});

router.post('/edit/:id',upload.single("coverImage"), async (req, res) => {
  const bookID = req.params.id;
  const { bookTitle, bookAuthor, bookDescription, isbnNumber, price } = req.body;

  try {

    const book = await Book.findById(bookID);

    const updateData = {
      title: bookTitle,
      author: bookAuthor,
      description: bookDescription,
      isbnNumber: isbnNumber,
      price: price
    }

    if(req.file) {
      updateData.coverImage = `/uploads/${req.file.filename}`
      fs.unlinkSync(path.join(__dirname+'..'+'uploads'+`${book.oldImage}`))
    }else{
      updateData.coverImage = book.coverImage;
    }

    const updatedBook = await Book.findByIdAndUpdate(bookID, updateData, { new: true });

    if (!updatedBook) {
      return res.status(404).send('Book not found');
    }

    console.log('Book updated successfully:', updatedBook);

    res.redirect('/library');
  } catch (error) {
    console.log('Error in updating the book:', error.message);
    res.status(500).send(error.message);
  }
});


router.post('/send-mail',(req,res)=>{
  sendmail(req,res)
})
module.exports = router;
