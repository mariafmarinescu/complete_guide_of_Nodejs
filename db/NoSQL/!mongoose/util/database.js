const dotenv = require('dotenv');
dotenv.config();

const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.MONGO_USER}:${process.env.PASS}@cluster0.zj50u.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;


let _db;
const mongoConnect = callback => {
    MongoClient.connect(uri, { useNewUrlParser: true })
        .then(client => {
            console.log('Successfully connected to the database!');
            callback(client);
        })
        .catch(err => {
            console.log(err);
            throw err;
        });
};


const getDb = () => {
    if(_db) {
        return _db;
    }
    throw 'No database found!';
};

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;