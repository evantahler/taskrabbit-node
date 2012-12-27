/////////////////////////
// API PROTOTYPE SETUP //
/////////////////////////

var taskrabbit = function(options){
  var self = this;
  self.prepare(options);
}

taskrabbit.prototype.prepare = function(options){
  var self = this;
  if(typeof options == "undefined"){ options = {}; }
  
  var defaults = self.generateDefaults();
  for(var i in defaults){
    if(options[i] == null){
      options[i] = defaults[i];
    }
  }

  [
    'consumerKey', 
    'consumerSecret',
    'oauthCallback',
  ].forEach(function(requiredOption){
    if(options[requiredOption] == null){ throw new Error(requiredOption + " is required"); }
  });

  self.request = require('request');
  self.options = options;
}

taskrabbit.prototype.generateDefaults = function(){
  return {
    endpoint: "https://taskrabbitdev.com",
    apiVersion: "v1",
    verbose: true,
  }
}

taskrabbit.prototype.log = function(message){
  if(this.options.verbose === true){
    console.log("[taskrabbit] " + message);
  }
}

taskrabbit.prototype.makeRequest = function(method, route, accessToken, body, callback){
  var self = this;
  var err = null;

  var requestOptions = {
    method: method,
    url: self.options.endpoint  + "/api/" + self.options.apiVersion + "/" + route,
  };
  if(accessToken != null){
    requestOptions[headers] = { "Authorization": "OAuth "+user.taskrabbit_access_token };
  }
  if(body != null){
    requestOptions[body] = JSON.stringify(body);
  }
  self.log("requesting: " + requestOptions.url);
  self.request(requestOptions, function (error, response, body) {
    var resp = JSON.parse(body)
    self.log(JSON.stringify(resp));
    if(error == null && resp.error != null){
      error = resp.error;
    }
    if(typeof callback === "function"){
      callback(error, resp);
    }
  });
}

///////////////////////
// HELPERS FOR OAUTH //
///////////////////////

// ** You will need to set the callback to your application in your account on https://taskrabbitdev.com/developer/dashboard ** 
taskrabbit.prototype.oauthClientURL = function(){
  var self = this;
  return self.options.endpoint + "/api/authorize?response_type=code&client_id=" + self.options.consumerKey
}

taskrabbit.prototype.oauthAuthenticateClient = function(req, callback){
  var self = this;

  var query = req.url.split("?")[1].split("&");
  queryParams = {}
  for(var i in query){
    var parts = query[i].split("=");
    queryParams[parts[0]] = parts[1];
  }

  var url = self.options.endpoint + "/api/" + self.options.apiVersion + "/oauth/token/?";
  url += "grant_type=authorization_code";
  url += "&code=" + queryParams['code'];
  url += "&client_secret=" + self.options.consumerSecret;
  url += "&client_id=" + self.options.consumerKey;
  url += "&redirect_uri=" + self.options.oauthCallback;
  self.log('making oAuth requset: ' + url);

  self.request.post(url, function(error, response, body){
    var resp = JSON.parse(body);
    if(error == null && resp.error != null){
      error = resp.error;
    }
    var access_token = resp.access_token;
    if(typeof callback === 'function'){ callback(error, access_token); }
  });
};

/////////////////
// API METHODS //
/////////////////

taskrabbit.prototype.cities = function(callback){
  var self = this;
  self.makeRequest('GET', "cities", null, null, function(error, data){
    if(typeof callback === "function") { callback(error, data); }
  });
}

//////////////////

module.exports = taskrabbit;