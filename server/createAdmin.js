const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const createAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        const phone = process.argv[2]; // Get phone number from command line argument

        if (!phone) {
            console.log('Please provide a phone number: node createAdmin.js <phone_number>');
            process.exit(1);
        }

        const user = await User.findOne({ phone });

        if (!user) {
            console.log(`User with phone ${phone} not found.`);
            process.exit(1);
        }

        user.isAdmin = true;
        await user.save();

        console.log(`Success! User ${phone} is now an Admin.`);
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

createAdmin();
