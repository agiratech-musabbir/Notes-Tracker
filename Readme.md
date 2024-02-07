# Notes Tracker

Notes Tracker is an innovative note management application developed using Node.js for backend functionality, CSS for styling, and ejs for dynamic content rendering.

As a learner, We've chosen to develop the Notes Tracker project to hone my skills in web development, particularly focusing on Node.js, CSS, and ejs. This project serves as a practical application of the concepts and techniques I've been studying, allowing me to deepen my understanding through hands-on experience

## Technology Stack

- #### Node js

      The core of the project, Node.js powers the server-side logic, handling requests, and managing data persistence.

- #### Express js

      Built on top of Node.js, Express.js provides a minimalist web application framework, simplifying the development of RESTful APIs and routing.

- #### Database (MongoDB)
      A NoSQL database, MongoDB stores and manages note data, offering scalability and flexibility in data modeling.

Once you have grasped all of these principles, you are prepared to advance with your Proof of Concept (POC) endeavor.

#### let's break down the project into three main steps:

- Requirement Gathering
- MVC pattern
- code

## Requirement Gathering

Gathering requirements for a project, such as Notes Tracker Management, is like understanding how many notes you have and what you need to do with them. Just as you need to know the ingredients and steps to cook a dish, you need to understand the features and functions your project requires. It's akin to having a blueprint before building a house – you need to know what rooms you want and how they'll be organized. In the case of Notes Tracker Management, it's about knowing the number of notes you have, which ones are completed, and what actions need to be taken with each note.

## Model

- The model contains only the pure application data.
- it contains no logic describing how to present the data to a user.
- example saving data to file/database fetching data from database.

## View

- The output we see on the UI through rendering out template using templating engine.
- Views are resposible for what we see on the screen.
- Resopnsible for rendering the right content in the html document and sending back to user.
- It doesn't care about application logic.

## Controller

- Controller are just connection point between the model and view.
- It is middleman between the model and view.
- Controller works with model.
- It also works for passing the data into view which was fetch in model

## Router

- Routes also fit in this picture.
- It define upon on which path, for which http methods, which controller should execute.
- The controller is responsible for defining the things that which model to work with and which view to render.
- This is the pattern it get follow:
- In express app we heavily depends on middleware concept.
- so controller are kind of split up into multiple middleware function or some of its logic seperated and moved to another middleware function.

## Code
app.js

```
// Import necessary modules
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

// Import MongoDB connection function
const mongoConnect = require('./connection/db').mongoConnect;

// Create Express application
const app = express();

// Import route controllers
const noteController = require('./routes/note');
const adminRoutes = require('./routes/admin');

// Set view engine and views directory
app.set('view engine', 'ejs');
app.set('views', 'views');

// Middleware for parsing request bodies
app.use(bodyParser.urlencoded({ extended: false }));

// Middleware for serving static files
app.use(express.static(path.join(__dirname, 'public')));

// Use noteController routes
app.use(noteController);

// Use adminRoutes with '/admin' prefix
app.use('/admin', adminRoutes);

// Middleware for handling 404 errors
app.use('/', (req, res, next) => {
  res.render('404', {
    pageTitle: 'Page not found',
    path: '',
  });
});

// Connect to MongoDB and start server
mongoConnect(() => {
  app.listen(3000);
});

```

##### Express and Middleware Setup:

The code sets up a web application using Node.js and Express.js. It starts by importing necessary tools like Express and body-parser. Then, it connects to a MongoDB database. Next, it creates the application and sets up routes for handling notes and administrative tasks. It configures the view engine and static file serving. After that, it establishes middleware for request handling and adds error handling for 404 pages. Finally, it connects to the database and starts the server on port 3000.

    const getDb = require('../connection/db').getDb;
    const mongodb = require('mongodb');

    module.exports = class Note {
      constructor(_title, _description, _imageUrl, _noteId) {
        this._id = _noteId;
        this.title = _title;
        this.description = _description;
        this.imageUrl = _imageUrl;
        this.status = 'unapproved';
      }

      save() {
        const db = getDb();
        if (this._id) {
          return db.collection('notes').updateOne(
            { _id: new mongodb.ObjectId(this._id) },
            {
              $set: {
                title: this.title,
                description: this.description,
                imageUrl: this.imageUrl,
                status: this.status,
              },
            }
          );
        }
        return db.collection('notes').insertOne(this);
      }

      saveChanges() {
        const db = getDb();
        return db.collection('notes').updateOne(
          { _id: new mongodb.ObjectId(this._id) },
          {
            $set: {
              title: this.title,
              description: this.description,
              imageUrl: this.imageUrl,
              status: this.status,
            },
          }
        );
      }

      static fetchAll(isAdmin) {
        const db = getDb();
        if (isAdmin) {
          return db.collection('notes').find().toArray();
        }
        return db.collection('notes').find({ status: 'approved' }).toArray();
      }

      static findNoteById(noteId) {
        const db = getDb();
        return db
          .collection('notes')
          .find({ _id: new mongodb.ObjectId(noteId) })
          .next();
      }

      static delete(noteId) {
        const db = getDb();
        return db
          .collection('notes')
          .deleteOne({ _id: new mongodb.ObjectId(noteId) });
      }

      static approve(noteId) {
        const db = getDb();
        let status = 'unapproved';

        return Note.findNoteById(noteId)
          .then((_note) => {
            if (_note.status === 'unapproved') {
              status = 'approved';
            }
          })
          .then(() => {
            return db
              .collection('notes')
              .updateOne(
                { _id: new mongodb.ObjectId(noteId) },
                {
                  $set: {
                    status: status,
                  },
                }
              )
              .next();
          })
          .catch((err) => console.log('error', err));
      }
    };



The Note class in this Node.js module handles CRUD operations for notes in a MongoDB database. It initializes new notes, saves them, updates existing notes, fetches all notes based on admin status, retrieves notes by ID, deletes notes, and approves notes by changing their status.

- db.js

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


This code establishes a connection to a MongoDB database and provides functions to connect to the database (mongoConnect) and retrieve the database object (getDb). The mongoConnect function connects to the database using a connection URI and sets the _db variable to the connected database object. The getDb function returns this database object. Finally, both functions are exported to make them available for use in other parts of the application.     