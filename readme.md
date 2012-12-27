# TaskRabbit API in node.js

- **Full Details on the TaskRabbit REST API can be found here: [http://taskrabbit.github.com/](http://taskrabbit.github.com/)**
- **Support for the API can be found at [http://support.taskrabbit.com/forums/21264831-faqs-for-developers](http://support.taskrabbit.com/forums/21264831-faqs-for-developers)**
- **If you have any questions (including asking for production access), email bdapi@TaskRabbit.com**

## Use

1. You will need to register a client application in the developer sand box @ [https://taskrabbitdev.com](https://taskrabbitdev.com)
2. Be sure to note your `consumerKey`, `consumerSecret` and `oauthCallback`.  You can always modify this information @ [https://taskrabbitdev.com/developer/dashboard](https://taskrabbitdev.com/developer/dashboard)
3. `npm install taskrabbit`
4. Configure the API (these three parameters are required): 

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

## Methods

- `taskrabbit.account(accessToken, callback)`
- `taskrabbit.cities(accessToken, callback)`
- `taskrabbit.taskPost(accessToken, payload, callback)`
- `taskrabbit.taskView(accessToken, taskID, callback)`
- `taskrabbit.taskDelete(accessToken, taskID, callback)`
- `taskrabbit.taskClose(accessToken, taskID, callback)`
- `taskrabbit.taskComment(accessToken, taskID, payload, callback)`
- `taskrabbit.taskOffers(accessToken, taskID, callback)`
- `taskrabbit.taskOfferAccept(accessToken, taskID, offerID, callback)`
- `taskrabbit.taskConverstaions(accessToken, taskID, callback)`

## Notes

- Remember, every action is done on behalf of a user.  There are no 'open' actions you can call on the API without a user's token
- Users can revoke their tokens from your application.  Always be sure to check for authentication errors
- You will need to set the callback to your application in your account on [https://taskrabbitdev.com/developer/dashboard](https://taskrabbitdev.com/developer/dashboard) and `options.oauthCallback` MUST match that set with TaskRabbit

## Examples

- [Gaining user oAuth tokens](https://github.com/evantahler/taskrabbit-node/blob/master/examples/auth.js)
- [using the API methods](https://github.com/evantahler/taskrabbit-node/blob/master/examples/data.js)

## Defaults

The following defaults are provided when you initialize a new API client.  You can overwrite them as you need:

	{
	  endpoint: "https://taskrabbitdev.com",
	  apiVersion: "v1",
	  verbose: false,
	}