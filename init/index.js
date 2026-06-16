const mongoose = require("mongoose");
const initdata = require("./data.js");
const Listing = require("../models/listing.js");
const User = require("../models/user.js");

const mongoURI = 'mongodb://127.0.0.1:27017/wanderlust';

async function main() {
    await mongoose.connect(mongoURI);
}

const initDB = async () => {
    await Listing.deleteMany({});

    // Find a user to assign as owner. Prefer 'vishalc' if exists, otherwise any user, otherwise a fallback ID.
    let user = await User.findOne({ username: "vishalc" });
    if (!user) {
        user = await User.findOne({});
    }
    const ownerId = user ? user._id : "69350a718da5e398175d96dd";

    const categories = ["Trending", "Rooms", "Iconic Cities", "Mountains", "Castles", "Amazing Pools", "Camping", "Farms", "Arctic", "Domes", "Boats"];
    initdata.data = initdata.data.map((item, index)=>({
        ...item,
        owner: ownerId,
        category: categories[index % categories.length]
    }));
    await Listing.insertMany(initdata.data);
    console.log("Data initialized");
};

main()
    .then(async () => {
        console.log("Connected to MongoDB");
        await initDB();
        mongoose.connection.close();
    })
    .catch((err) => {
        console.log(err);
    });