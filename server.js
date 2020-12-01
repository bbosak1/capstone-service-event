// Set up
var express = require('express');
var app = express();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var cors = require('cors');

// Configuration
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/family");

app.use(bodyParser.urlencoded({'extended': 'true'}));
app.use(bodyParser.json());
app.use(bodyParser.json({type: 'application/vnd.api+json'}));
app.use(methodOverride());
app.use(cors());

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'DELETE, POST, PUT');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

var Event = mongoose.model('Event', {
    title: String,
    date: String,
    timeSt: String,
    timeEnd: String,
    loc: String,
    menuItem: String,
    menuAsgn: String,
    decoration: String,
    decorationAsgn: String,
    guestFirstName: String,
    guestLastName: String,
    supplyItem: String,
    supplyAsgn: String,
});

var Todo = mongoose.model('Todo', {
    descr: String,
    assignee: String,
});

// Todos

// Get all todos
app.get('/api/todos', function (req, res) {

    console.log("Listing Todos...");

    //use mongoose to get all Todos in the database
    Todo.find(function (err, todos) {

        // if there is an error retrieving, send the error. nothing after res.send(err) will execute
        if (err) {
            res.send(err);
        }
        res.json(todos); // return all Todos in JSON format
    });
});

// Create a todo item
app.post('/api/todos', function (req, res) {

    console.log("Creating Todo...");

    Todo.create({
        descr: req.body.descr,
        assignee: req.body.assignee,
    }, function (err, todo) {
        if (err) {
            res.send(err);
        }

        // create and return todos
        Todo.find(function (err, todos) {
            if (err)
                res.send(err);
            res.json(todos);
        });
    });

});

// Delete a todo
app.delete('/api/todos/:id', function (req, res) {
  Todo.remove({
    _id: req.params.id
  }, function (err, todo) {
    if (err) {
      console.error("Error deleting todo ", err);
    }
    else {
      Todo.find(function (err, todos) {
        if (err) {
          res.send(err);
        }
        else {
          res.json(todos);
        }
      });
    }
  });
});

// Events

// Get all Events
app.get('/api/events', function (req, res) {

    console.log("Listing Events...");

    //use mongoose to get all Events in the database
    Event.find(function (err, events) {
        // if there is an error retrieving, send the error. nothing after res.send(err) will execute
        if (err) {
            res.send(err);
        }
        res.json(events); // return all Events in JSON format
    });
});

// Update an event
app.put('/api/events/:id', function (req, res) {
  const event = {
    title: req.body.title,
    date: req.body.date,
    loc: req.body.loc,
    menuItem: req.body.menuItem,
    menuAsgn: req.body.menuAsgn,
    decoration: req.body.decoration,
    decorationAsgn: req.body.decorationAsgn,
    guestFirstName: req.body.guestFirstName,
    guestLastName: req.body.guestLastName,
    supplyItem: req.body.supplyItem,
    supplyAsgn: req.body.supplyAsgn,
  };
  console.log("Updating item - ", req.params.id);
  Event.update({_id: req.params.id}, event, function (err, raw) {
      if (err) {
          res.send(err);
      }
      res.send(raw);
  });
});

// Create a Event
app.post('/api/events', function (req, res) {
  console.log("Creating Event...");
  Event.create({
      title: req.body.title,
      date: req.body.date,
      timeSt: req.body.timeSt,
      timeEnd: req.body.timeEnd,
      loc: req.body.loc,
      menuItem: req.body.menuItem,
      menuAsgn: req.body.menuAsgn,
      decoration: req.body.decoration,
      decorationAsgn: req.body.decorationAsgn,
      guestFirstName: req.body.guestFirstName,
      guestLastName: req.body.guestLastName,
      supplyItem: req.body.supplyItem,
      supplyAsgn: req.body.supplyAsgn,
      done: false
  }, function (err, event) {
      if (err) {
          res.send(err);
      }

      // create and return Events
      Event.find(function (err, events) {
          if (err)
              res.send(err);
          res.json(events);
      });
  });
});

app.delete('/api/events/:id', function (req, res) {
  Event.remove({
    _id: req.params.id
  }, function (err, todo) {
    if (err) {
      console.error("Error deleting event ", err);
    }
    else {
      Event.find(function (err, todos) {
        if (err) {
          res.send(err);
        }
        else {
          res.json(todos);
        }
      });
    }
  });
});

// Start app and listen on port 8081
app.listen(process.env.PORT || 8081);
console.log("Events server listening on port  - ", (process.env.PORT || 8081));