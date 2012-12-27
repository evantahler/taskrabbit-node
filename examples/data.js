// getting oauthTokens 
// ** every action is done on behalf of a user **

/*
Oupt from this example looks like:

> node examples/data.js 
------------------
TaskRabbit Account:
Hi, Evan Tahler
I see you are in Chicago
------------------
TaskRabbit Cities:
Austin: [30.267153,-97.743061]
Boston: [42.358431,-71.059773]
Chicago: [41.878114,-87.629798]
LA & OC: [33.8859512167,-118.0946829248]
New York City: [40.714353,-74.005973]
Portland: [45.523452,-122.676207]
San Antonio: [29.4241219,-98.4936282]
Seattle: [47.60621,-122.332071]
SF Bay Area: [37.77493,-122.419416]
Virtual (Anywhere): [40.1,-72.91]
------------------
Post a task:
You just posted task #453 in the city of Boston
You can see your new task @ http://taskrabbitdev.com/tasks/dog-walking--10
------------------
Task Details:
This task is currently opened
Description: I want you to walk him to his favorite state park
------------------
Delete the Task:
You just deleted a task named: Dog walking

*/

var async = require('async');
var taskrabbitPrototype = require(__dirname + "/../lib/taskrabbit.js");

var userToken = "XXX";

var taskrabbit = new taskrabbitPrototype({
  consumerKey: "XXX",
  consumerSecret: "XXX",
  oauthCallback: "http://127.0.0.1:8080/oauth_callback",
  verbose: false,
});

var DATA = {};

async.series([

  function(next){
    console.log('------------------');
    console.log('TaskRabbit Account:');
    taskrabbit.account(userToken, function(error, data){
      console.log("Hi, " + data.full_name);
      console.log("I see you are in " + data.city.name);
      next();
    });
  },

  function(next){
    console.log('------------------');
    console.log('TaskRabbit Cities:');
    taskrabbit.cities(userToken, function(error, data){
      data.items.forEach(function(city){
        console.log(city.name + ": ["+city.lat+","+city.lng+"]");
      });
      next();
    });
  },

  function(next){
    console.log('------------------');
    console.log('Post a task:');
    var payload = {
      "task": {
        "name":"Dog walking",
        "named_price": 20, 
        "city_id": 1,
        "description": "I want you to walk him to his favorite state park",
        "private_description": "Secret informations",
        "cost_in_cents": 500,
        "virtual": true,
        "assignment_type": "review"
      }
    };
    taskrabbit.taskPost(userToken, payload, function(error, data){
      DATA.taskID = data.id;
      console.log("You just posted task #" + data.id + " in the city of " + data.city.name);
      console.log("You can see your new task @ " + data.links.html);
      next();
    });
  },

  function(next){
    console.log('------------------');
    console.log('Task Details:');
    taskrabbit.taskView(userToken, DATA.taskID, function(error, data){
      console.log("This task is currently " + data.state);
      console.log("Description: " + data.description);
      next();
    });
  },

  function(next){
    console.log('------------------');
    console.log('Delete the Task:');
    taskrabbit.taskDelete(userToken, DATA.taskID, function(error, data){
      console.log("You just deleted a task named: " + data.name)
      next();
    });
  },

]);

