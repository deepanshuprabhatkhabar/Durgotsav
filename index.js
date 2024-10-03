const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const voteRoutes = require('./routes/vote');
const cookieParser = require('cookie-parser');

require('dotenv').config({
    path: __dirname + '/.env'
});
const userRoutes = require('./routes/user');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(cookieParser());

const PORT = process.env.PORT || 5000;

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: 'durgotsav'
})
.then(() => console.log('Connected to MongoDB'))
.catch((err) => console.error('MongoDB connection error:', err));

// Use user routes
app.use('/api/users', userRoutes);
app.use('/api/votes', voteRoutes);

// Set up EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', './views');

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Example route to render an EJS file
app.get('/', (req, res) => {
    res.render('index', { title: 'Durgotsav Voting App' });
});
// Login route to serve login form
app.get('/login', (req, res) => {
    try {
        const token = req.cookies.jwtToken;
        if (token) {
            return res.redirect('/dashboard');
        }
        res.render('login', { title: 'Login - Durgotsav Voting App' });
    } catch (error) {
        console.error('Error rendering login page:', error);
        res.render('login', { title: 'Login - Durgotsav Voting App' });
    }
});

// Dashboard route (protected)
app.get('/dashboard', (req, res) => {
    try {
        const token = req.cookies.jwtToken;
        if (!token) {
            return res.redirect('/login');
        }
        res.render('dashboard', { title: 'Dashboard - Durgotsav Voting App' });
        
    } catch (error) {
        res.render('login', { title: 'Login - Durgotsav Voting App' });
    }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
