// import express from "express";
const express = require('express')
// import mongoose from "mongoose";
const mongoose = require('mongoose')
// import bodyParser from "body-parser";
const bodyParser = require('body-parser')
// import { config } from "dotenv";
const {config} = require('dotenv')
config();

// import bookRoutes from "routes/book.routes.js";
const bookRoutes = require('./routes/book.routes')

// usamos express para los middlewares
const app = express();
app.use(bodyParser.json());         // parsea el body que recibamos, use es para montar middlewares

// aca nos conectamos a la base de datos MONGO
mongoose.connect(process.env.MONGO_URL, {dbName: process.env.MONGO_DB_NAME});
const db = mongoose.connection;

// define la ruta base /books para el enrutador bookRoutes
app.use('/books',bookRoutes);

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Servidor iniciado en el puerto ${port}`)
})

