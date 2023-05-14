// import the 
const express = require("express");
const res = require("express/lib/response");
const app = express();

const { MongoClient } = require("mongodb");
const mongoURI = "mongodb://admin:password@mongo-svc:27017";

// const mongoURI = "mongodb://${process.env.MONGO_INITDB_ROOT_USERNAME}:${process.env.MONGO_INITDB_ROOT_PASSWORD}@mongo-svc:27017";
// const mongoURI = "mongodb://${process.env.MONGO_INITDB_ROOT_USERNAME}:${process.env.MONGO_INITDB_ROOT_PASSWORD}@mongo-svc:27017";
const dbName = "calculator"; // Update with your desired database name
const collectionName = "operations"; // Update with your desired collection name

// Establish a connection to the MongoDB database
async function connectToMongoDB() {
  try {
    const client = new MongoClient(mongoURI);
    await client.connect();
    return client.db(dbName).collection(collectionName);
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}
const {transports, createLogger, format} = require('winston');

const logger = createLogger({
    // Creating a format for logging by using simple winston format and combining it with timetamp.
    format: format.combine(
        format.timestamp(),
        format.json()
    ),
    defaultMeta: {service: 'user-service'},
    transports: [
        // -Write all the logs with importance level of 'error or less in 'error.log'
        // Write all logs with importance level of 'info' or less to 'info.log'

        new transports.Console(),
        new transports.File({ filename: 'error.log', level: 'error'}),
        new transports.File({ filename: 'info.log', level:'info'}),
    ],
});

// If not in production then log to the console.

if(process.env.NODE_ENV !== 'production'){
    logger.add(new transports.Console({
        format: format.combine(
            format.timestamp(),
            format.json()
        ),
    }));
}

// defining functions
const add= (n1,n2) => {
    return n1+n2;
}
const subtract= (n1,n2) => {
    return n1-n2;
}
const multiply= (n1,n2) => {
    return n1*n2;
}
const divide= (n1,n2) => {
    return n1/n2;
}

// defining endpoints

app.get("/operations", async (req, res) => {
    try {
      const collection = await connectToMongoDB();
      const operations = await collection.find({}).toArray();
      res.status(200).json({ statuscode: 200, data: operations });
    } catch (error) {
      console.error(error);
      res.status(500).json({ statuscode: 500, msg: error.toString() });
    }
});

app.get("/delete-operations", async (req, res) => {
    try {
      // Delete all operations from the database
      const collection = await connectToMongoDB();
      await collection.deleteMany({});
  
      // Send a success response
      res.status(200).json({ message: "All operations deleted successfully." });
    } catch (error) {
      console.error("Error deleting operations:", error);
      res.status(500).json({ message: "Error deleting operations." });
    }
});


app.get("/add", (req,res)=>{
    try{
        const n1= parseFloat(req.query.n1);
        const n2= parseFloat(req.query.n2);
        logger.info(`New addition operation requested:`);
        if(isNaN(n1)){
            logger.error("n1 is incorrectly defined");
            throw new Error("n1 is incorrectly defined");
        }
        if(isNaN(n2)){
            logger.error("n2 is incorrectly defined");
            throw new Error("n2 is incorrectly defined");
        }

        if (n1 === NaN || n2 === NaN) {
            console.log()
            logger.error("Parsing error");
            throw new Error("Parsing Error");
        }
        logger.info(`Performing addition operation: ${n1} + ${n2}`);

        const result = add(n1,n2);

        (async () => {
            const collection = await connectToMongoDB();
            await collection.insertOne({
              operation: "add",
              n1,
              n2,
              result,
              timestamp: new Date(),
            });
          })();

        logger.info(`Result of addition operation: ${result}`);
        res.status(200).json({statuscode:200, data: result });
    } catch(error) {
        console.log(error)
        res.status(500).json({statuscode:500, msg: error.toString() })
    }
});

app.get("/subtract", (req,res)=>{
    try{
        const n1= parseFloat(req.query.n1);
        const n2= parseFloat(req.query.n2);
        logger.info(`New subtraction operation requested:`);
        if(isNaN(n1)){
            logger.error("n1 is incorrectly defined");
            throw new Error("n1 is incorrectly defined");
        }
        if(isNaN(n2)){
            logger.error("n2 is incorrectly defined");
            throw new Error("n2 is incorrectly defined");
        }

        if (n1 === NaN || n2 === NaN) {
            console.log()
            logger.error("Parsing error");
            throw new Error("Parsing Error");
        }
        logger.info(`Performing subtraction operation: ${n1} - ${n2}`);
        
        const result = subtract(n1,n2);
        logger.info(`Result of subtraction operation: ${result}`);
        res.status(200).json({statuscode:200, data: result });
    } catch(error) {
        console.log(error)
        res.status(500).json({statuscode:500, msg: error.toString() })
    }
});

app.get("/multiply", (req,res)=>{
    try{
        const n1= parseFloat(req.query.n1);
        const n2= parseFloat(req.query.n2);
        logger.info(`New multiplication operation requested:`);
        if(isNaN(n1)){
            logger.error("n1 is incorrectly defined");
            throw new Error("n1 is incorrectly defined");
        }
        if(isNaN(n2)){
            logger.error("n2 is incorrectly defined");
            throw new Error("n2 is incorrectly defined");
        }

        if (n1 === NaN || n2 === NaN) {
            console.log()
            logger.error("Parsing error");
            throw new Error("Parsing Error");
        }
        logger.info(`Performing multiplication operation: ${n1} * ${n2}`);
        
        const result = multiply(n1,n2);
        logger.info(`Result of multiplication operation: ${result}`);
        res.status(200).json({statuscode:200, data: result });
    } catch(error) {
        console.log(error)
        res.status(500).json({statuscode:500, msg: error.toString() })
    }
});

app.get("/divide", (req,res)=>{
    try{
        const n1= parseFloat(req.query.n1);
        const n2= parseFloat(req.query.n2);
        logger.info(`New division operation requested:`);
        if(isNaN(n1)){
            logger.error("n1 is incorrectly defined");
            throw new Error("n1 is incorrectly defined");
        }
        if(isNaN(n2)){
            logger.error("n2 is incorrectly defined");
            throw new Error("n2 is incorrectly defined");
        }

        if (n1 === NaN || n2 === NaN) {
            console.log()
            logger.error("Parsing error");
            throw new Error("Parsing Error");
        }
        logger.info(`Performing division operation: ${n1} * ${n2}`);

        const result = divide(n1,n2);
        logger.info(`Result of division operation: ${result}`);
        res.status(200).json({statuscode:200, data: result });
    } catch(error) {
        console.log(error)
        res.status(500).json({statuscode:500, msg: error.toString() })
    }
});


'use strict';

// Constants
const PORT = 8080;
const HOST = '0.0.0.0';

// App
app.get('/', (req, res) => {
  res.send('Hello World');
});

app.listen(PORT, HOST, () => {
  console.log(`Running on http://${HOST}:${PORT}`);
});