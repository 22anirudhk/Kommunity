const url = require("url");
const MongoClient = require("mongodb").MongoClient;

let cacheDB = null;

async function connectToDatabase(uri) {
    if(cacheDB) {
        return cacheDB;
    }
    
    const client = await MongoClient.connect(uri, { useUnifiedTopology: true });
    const db = await client.db(url.parse(uri).pathname.substr(1));
    cacheDB = db;
    return db;
}

module.exports = async (req, res) => {
    var myDB = await connectToDatabase(process.env.MONGODB_URI);
    
    if(req.body.task.length <= 1 || req.body.length <= 1 || req.body.length <= 1) {
        res.status(403).send("invalid");
    } else {
        myDB.collection("Tasks").insertOne(req.body, (err, result) => {
            if(err) return console.log(err);
        
            res.status(200).send("Inserted.");
        })
    }
}
