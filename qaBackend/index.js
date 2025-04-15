// index.js

import express from 'express';
import mongoose from 'mongoose';
import morgan from 'morgan';
import qaRoutes from './routes/qaRoutes.js';
import { initializeModel } from './controllers/qaControllers.js';

const app = express();
const port = 2201;

// Middleware to log HTTP requests
app.use(morgan('dev'));

// Middleware to parse JSON bodies
app.use(express.json());

// MongoDB connection URI (replace with your MongoDB connection string)
// const mongoURI = 'mongodb://localhost:27017/travelSage_v1';

// Connect to MongoDB
mongoose.set('strictQuery', false)
mongoose.connect('mongodb://localhost:27017/travelSage_v1')
    .then(() => {
        console.log('Connected to MongoDB');
        // Initialize your model or other setup here
        initializeModel()
            .then(() => {
                console.log('Model initialized');
            })
            .catch((error) => {
                console.error('Error initializing model:', error);
            });
    }).catch(error => console.log(error))


// Check MongoDB connection
// const db = mongoose.connection;
// db.on('error', console.error.bind(console, 'MongoDB connection error:'));
// db.once('open', () => {
//     console.log('Connected to MongoDB');
//     // Initialize your model or other setup here
//     initializeModel()
//         .then(() => {
//             console.log('Model initialized');
//         })
//         .catch((error) => {
//             console.error('Error initializing model:', error);
//         });
// });

// Use the QA routes
app.use('/qa', qaRoutes);

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
