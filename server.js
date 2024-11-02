const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = 3000;

// Middleware
app.use(express.json());
app.use(express.static('public'));

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/tea-time-thoughts', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Define Thought schema
const thoughtSchema = new mongoose.Schema({
    name: String,
    text: String,
    timestamp: { type: Date, default: Date.now }
});

const Thought = mongoose.model('Thought', thoughtSchema);

// API Routes
app.get('/api/thoughts', async (req, res) => {
    try {
        const thoughts = await Thought.find().sort({ timestamp: -1 });
        res.json(thoughts);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching thoughts' });
    }
});

app.post('/api/thoughts', async (req, res) => {
    try {
        const thought = new Thought(req.body);
        await thought.save();
        res.status(201).json(thought);
    } catch (error) {
        res.status(500).json({ error: 'Error saving thought' });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
}); 