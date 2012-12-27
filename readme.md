# TaskRabbit API in node.js

**Full Details on the TaskRabbit REST API can be found here: [http://taskrabbit.github.com/](http://taskrabbit.github.com/)**

## Use

1. You will need to register a client application in the developer stand box @ [https://taskrabbitdev.com](https://taskrabbitdev.com)
2. Be sure to note your `consumerKey`, `consumerSecret` and `oauthCallback`.  You can always modify this information @ [https://taskrabbitdev.com/developer/dashboard](https://taskrabbitdev.com/developer/dashboard)
3. `npm install taskrabbit`
4. Configure the API: 

		var taskrabbitPrototype = require(taskrabbit");
		
		var taskrabbit = new taskrabbitPrototype({
		  consumerKey: "XXXX",
		  consumerSecret: "XXX",
		  oauthCallback: "http://127.0.0.1:8080/oauth_callback",
		});
		
5. Every action will be authenticated on behalf of a user.  This API provides some helpers to authenticate users and gain their oAuth tokens:

		http.createServer(function (req, res) {
		
		  if(req.url == "/auth"){
			res.writeHead(301, {'Location': taskrabbit.oauthClientURL() });
		    res.end('Go Here: ' + taskrabbit.oauthClientURL() + '\n');
		  }else if(req.url.indexOf("/oauth_callback") >= 0){
		    taskrabbit.oauthAuthenticateClient(req, function(error, access_token){
		      res.writeHead(200, {'Content-Type': 'text/plain'});
		      res.end('Your oAuth access token is: ' + access_token + '\n');
		    });
		  }
		  
		}).listen(8080, '0.0.0.0');

6. Use the API!

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
		  console.log(data)
		  next();
		});
		
		taskrabbit.taskView(userToken, taskID, function(error, data){
		  console.log(data)
		  next();
		});

7. When your application is ready, contact TaskRabbit to get a production developer account.

## NOTES

- Remember, every action is done on behalf of a user.  There are no 'open' actions you can call on the API without a user's token
- Users can revoke their tokens from your application.  Always be sure to check for authentication errors
- You will need to set the callback to your application in your account on [https://taskrabbitdev.com/developer/dashboard](https://taskrabbitdev.com/developer/dashboard) and `options.oauthCallback` MUST match that set with TaskRabbit

## Defaults

The following defaults are provided when you initialize a new API client.  You can overwrite them as you need:

	{
	  endpoint: "https://taskrabbitdev.com",
	  apiVersion: "v1",
	  verbose: false,
	}