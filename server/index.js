require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
const connectDB = require('./config/db');
const GameResult = require('./models/GameResult');
const Bet = require('./models/Bet');
const User = require('./models/User');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*", // Allow all for dev, restrict in prod
        methods: ["GET", "POST"]
    }
});

// Middleware
app.use(cors());
app.use(express.json());

connectDB().then(async () => {
    try {
        const GameResult = require('./models/GameResult'); 
        // Force drop ALL indexes to clear the sticky 'unique' constraint
        await GameResult.collection.dropIndexes();
        console.log('Dropped ALL indexes on GameResult to fix unique constraint');
    } catch (e) {
        console.log('Index drop error (ignorable if no indexes): ', e.message);
    }
});

// --- Multi-TimeFrame Game Logic ---
const TIME_FRAMES = {
    '30s': { duration: 30, initialPeriod: 202512070001 },
    '1Min': { duration: 60, initialPeriod: 202512070001 },
    '3Min': { duration: 180, initialPeriod: 202512070001 },
    '5Min': { duration: 300, initialPeriod: 202512070001 }
};

// Store active game states
const gameStates = {}; 

const generateResult = () => {
    const number = Math.floor(Math.random() * 10);
    let color = '';
    
    if (number === 0) color = 'red-violet';
    else if (number === 5) color = 'green-violet';
    else if (number % 2 === 0) color = 'red';
    else color = 'green';

    return { number, color };
};

const processBets = async (currentPeriodId, timeFrame, result) => {
    console.log(`Processing bets for ${timeFrame} - ${currentPeriodId}`);
    // Find bets for this specific timeFrame and periodId
    const bets = await Bet.find({ periodId: currentPeriodId, timeFrame: timeFrame, status: 'pending' });
    
    for (const bet of bets) {
        let win = false;
        let multiplier = 0;

        // Number Bet
        if (bet.type === 'number' && parseInt(bet.selection) === result.number) {
            win = true;
            multiplier = 9;
        }
        
        // Color Bet
        if (bet.type === 'color') {
            const isViolet = result.number === 0 || result.number === 5;
            
            if (bet.selection === 'violet' && isViolet) {
                win = true;
                multiplier = 4.5;
            } else if (bet.selection === 'green' && (result.color.includes('green'))) {
                 win = true;
                 multiplier = isViolet ? 1.5 : 2; 
            } else if (bet.selection === 'red' && (result.color.includes('red'))) {
                 win = true;
                 multiplier = isViolet ? 1.5 : 2;
            }
        }

        if (win) {
            bet.status = 'win';
            bet.winAmount = bet.amount * multiplier;
            await User.findByIdAndUpdate(bet.user, { $inc: { balance: bet.winAmount } });
        } else {
            bet.status = 'loss';
        }
        await bet.save();
    }
};

class GameEngine {
    constructor(timeFrame, config) {
        this.timeFrame = timeFrame;
        this.duration = config.duration;
        this.timer = this.duration;
        this.periodId = config.initialPeriod;
        this.isBettingOpen = true;
        
        this.init();
    }

    async init() {
        try {
            // Find last game for THIS timeFrame
            const lastGame = await GameResult.findOne({ timeFrame: this.timeFrame }).sort({ createdAt: -1 });
            if (lastGame) {
                const lastId = parseInt(lastGame.periodId);
                // Reset logic for new day/year if needed, keeping simple increment for now or reuse 2025 reset logic
                 if (lastId < 202500000000) {
                     this.periodId = 202512070001;
                 } else {
                     this.periodId = lastId + 1;
                 }
            }
            console.log(`Initialized ${this.timeFrame} game with Period: ${this.periodId}`);
            this.startLoop();
        } catch (err) {
            console.error(`Failed to init ${this.timeFrame}`, err);
        }
    }

    startLoop() {
        setInterval(async () => {
            this.timer--;

            // Update global state for this frame
            gameStates[this.timeFrame] = {
                time: this.timer,
                periodId: this.periodId,
                isBettingOpen: this.isBettingOpen
            };

            // Emit update specifically for this timeFrame
            // Alternatively, emit one big object, but separate events are cleaner for clients subscribing to one?
            // Actually, client listens to everything usually. Let's emit a generic 'timer_update'.
            io.emit('timer_update', { 
                timeFrame: this.timeFrame, 
                time: this.timer, 
                periodId: this.periodId, 
                isBettingOpen: this.isBettingOpen 
            });

            if (this.timer === 5) { // Close betting 5s before
                this.isBettingOpen = false;
            }

            if (this.timer <= 0) {
                await this.handleRoundEnd();
                // Reset
                this.timer = this.duration;
                this.periodId++;
                this.isBettingOpen = true;
            }
        }, 1000);
    }

    async handleRoundEnd() {
        const result = generateResult();
        try {
            await GameResult.create({
                periodId: this.periodId.toString(),
                resultNumber: result.number,
                resultColor: result.color,
                timeFrame: this.timeFrame
            });

            io.emit('result', { ...result, timeFrame: this.timeFrame, periodId: this.periodId });

            // Process bets for this specific time frame
            await processBets(this.periodId.toString(), this.timeFrame, result);
        } catch (err) {
            console.error(`Error saving result for ${this.timeFrame}:`, err);
        }
    }
}

// Start all game engines
Object.keys(TIME_FRAMES).forEach(tf => {
    new GameEngine(tf, TIME_FRAMES[tf]);
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/game', require('./routes/game'));
app.use('/api/wallet', require('./routes/wallet'));
app.use('/api/user', require('./routes/user')); // For profile/balance

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
