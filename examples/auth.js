// getting oauthTokens 
// ** You will need to set the callback to your application in your account on https://taskrabbitdev.com/developer/dashboard ** 
// ** options.oauthCallback MUST match that set with taskrabbit ** 

var http = require('http');
var taskrabbitPrototype = require(__dirname + "/../lib/taskrabbit.js");

var taskrabbit = new taskrabbitPrototype({
  consumerKey: "N1CAdVgt1JHkZpot0z1JlJD7IT0uDCI5HDQI7IuF",
  consumerSecret: "f2XTfSZUROB5g61RlFj8GkemnbsUQMp3ijOMD8Uh",
  oauthCallback: "http://127.0.0.1:8080/oauth_callback",
  verbose: true,
});

http.createServer(function (req, res) {

  if(req.url == "/auth"){

    res.writeHead(301, {'Location': taskrabbit.oauthClientURL() });
    res.end('Go Here: ' + taskrabbit.oauthClientURL() + '\n');

  }else if(req.url.indexOf("/oauth_callback") >= 0){

    taskrabbit.oauthAuthenticateClient(req, function(error, access_token){
      res.writeHead(200, {'Content-Type': 'text/plain'});
      res.end('Your oAuth access token is: ' + access_token + '\n');
    });

  }else{

    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('Go Away\n');

  }
  
}).listen(8080, '0.0.0.0');

console.log("server running");