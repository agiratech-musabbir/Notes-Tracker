const mongodb = require('mongodb');

const MongoClient = mongodb.MongoClient;

let _db;

const mongoConnect = (callback) => {
MongoClient.connect(
'mongodb+srv://musabbir:Ns8vGl7UkyXlRHHL@cluster0.15g1tfw.mongodb.net/notes'
)
.then((client) => {
console.log('Connected to DB!');
_db = client.db();
callback();
})
.catch((error) => {
console.log('error in connecting database', error);
throw error;
});
};

const getDb = () => {
if (_db) {
return _db;
}
throw 'No database found/selected!';
};

// module.exports = mongoConnect;
exports.mongoConnect = mongoConnect;
exports.getDb = getDb;