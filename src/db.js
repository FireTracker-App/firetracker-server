// From https://www.digitalocean.com/community/tutorials/containerizing-a-node-js-application-for-development-with-docker-compose
const mongoose = require('mongoose');

const {
    MONGO_USERNAME,
    MONGO_PASSWORD,
    MONGO_HOSTNAME,
    MONGO_PORT,
    MONGO_DB
} = process.env;

const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true
};

const url = `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOSTNAME}:${MONGO_PORT}/${MONGO_DB}?authSource=admin`;

mongoose.connect(url, options).then(() =>
{
    console.log('MongoDB is connected!');
}).catch(err => console.error(err));
