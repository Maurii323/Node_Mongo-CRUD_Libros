//import express from "express";
const express = require('express');
const router = express.Router();
// import {book} from "../models/book.model.js";
const Book = require('../models/book.model');

// Rutas http para hacer las consultas a la base de datos

// MIDDLEWARE para acceder a un libro por id
const getBook = async (req,res,next) => {
    let book;
    // agarro solamente el id de los parametros de la URL
    const { id } = req.params;
    // valida si el id cumple con las caracteristicas de los id de mongo
    if(!id.match(/^[0-9a-fA-F]{24}$/)){
        return res.status(404).json({ message:"el id del libro no es valido"})
    }

    try {
        book = await Book.findById(id);    // busca por id 
        console.log(book);
        // valida si no existe ese id en la base de datos
        if(!book){
            return res.status(404).json([{message: 'El libro no fue encontrado'}])
        }

    } catch (error) {
        return res.status(500).json({message: error.message});
    }
    // setea el book en la respuesta
    res.book = book;
    // siempre en un middleware se usa next para que siga con la ejecucion
    next();
}

// obtener todos los libros [GET ALL]
router.get('/', async (req,res) => {
    try {
        const books = await Book.find();    // el find vacio va a traer todo
        console.log("Get ALL", books);
        // si no hay contenido en la base de datos
        if(books.length == 0){
            return res.status(204).json([])
        }
        res.json(books);                         // la respuesta son los books

    } catch (error) {
        res.status(500).json({message: error.message});
    }
})

// crear un nuevo libro (recurso) [POST]
router.post('/', async(req,res) => {
    // agarro los parametros del body de la URL
    const { title, author, genre, publication_date} = req?.body;
    // valido si estan todos los campos
    if(!title || !author || !genre || !publication_date){
        return res.status(400).json({message: "Los campos titulo, autor, genero y fecha son obligatorios"})
    }
    // construyo un nuevo libro con los parametros de la URL(req)
    const book = new Book({
        title, 
        author, 
        genre, 
        publication_date
    })

    try {
        // guardo el libro en la DB
        const newBook = await book.save();
        console.log( "POST", newBook);
        res.status(201).json(newBook);      // devuelve el nuevo libro creado
    } catch (error) {
        res.status(400).json({message: error.message});
    }
})

// obtener un libro segun su id [GET BY ID]
router.get('/:id', getBook, async(req,res) => {
    // res.book es el libro que se encontro segun la id con el middleware getBook
    res.json(res.book);                             //res.book esta seteado en el middleware getBook
})


// editar un libro [PUT]
router.put('/:id', getBook, async(req,res) => {
    try {
        const book = res.book;
        // actualizamos los campos con los parametros de la URL(req)
        book.title = req.body.title || book.title;         // || es por si no existe title en la URL
        book.author = req.body.author || book.author;
        book.genre = req.body.genre || book.genre;
        book.publication_date = req.body.publication_date || book.publication_date;

        updatedBook = await book.save();
        console.log('PUT', updatedBook);
        res.json(updatedBook);

    } catch (error) {
        res.status(400).json({message: error.message});
    }
})

// editar una propiedad de algun libro [PATCH]
router.patch('/:id', getBook, async(req,res) => {
    if(!req.body.title && !req.body.author && !req.body.genre && !req.body.publication_date){
        res.status(400).json({
            message: 'Al menos uno de estos campos debe ser enviado: titulo, autor, genero o fecha de publicacion'
        })
    }
    
    try {
        const book = res.book;
        book.title = req.body.title || book.title;
        book.author = req.body.author || book.author;
        book.genre = req.body.genre || book.genre;
        book.publication_date = req.body.publication_date || book.publication_date;

        updatedBook = await book.save();
        console.log('PATCH', updatedBook);
        res.json(updatedBook);

    } catch (error) {
        res.status(400).json({message: error.message});
    }
})

// eliminar un libro [DELETE]
router.delete('/:id', getBook, async(req,res) => {
    try {
        const book = res.book;
        // elimina el libro de la base de datos
        await book.deleteOne({
            _id: book._id
        });
        console.log('DELETE', book);
        res.json({
            message: `El libro ${book.title} fue eliminado correctamente`
        })
    } catch (error) {
        res.status(500).json({message: error.message});
    }
    
})

module.exports = router
