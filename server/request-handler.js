/*************************************************************

You should implement your request handler function in this file.

requestHandler is already getting passed to http.createServer()
in basic-server.js, but it won't work as is.

You'll have to figure out a way to export this function from
this file and include it in basic-server.js so that it actually works.

*Hint* Check out the node module documentation at http://nodejs.org/api/modules.html.

**************************************************************/

// These headers will allow Cross-Origin Resource Sharing (CORS).
// This code allows this server to talk to websites that
// are on different domains, for instance, your chat client.
//
// Your chat client is running from a url like file://your/chat/client/index.html,
// which is considered a different domain.
//
// Another way to get around this restriction is to serve you chat
// client from this domain by setting up static file serving.
var utilities = require('./utilities');
var defaultCorsHeaders = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10, // Seconds.
  'Content-Type': 'application/JSON'
};

//this will give each message/object a specific id, and will function as a counter
var objectIdCount = 1;

//array of message 'objects'
var messages = [
//{ text: 'hello darkness my old friend', username: 'paul s.', objectId: objectIdCount}
];

//we can put all our request methods in one object
//get, post, and options

var actionType = {
  //200
  'GET': function (request, response) {
    utilities.sendResponse(response, {results: messages});
  },
  //201
  'POST': function (request, response) {
    //assign id to counter variable
    message.objectId = objectIdCount++;
    messages.push(message);
    utilities.sendResponse(response, {objectId: message.objectId}, 201);
  },
  //200
  'OPTIONS': function (request, response) {
    utilities.sendResponse(response, null);
  }
}

exports.requestHandler = utilities.makeActionHandler(actions);


//former code:


/* Current plan is:
We create a file that stores messages
Point router to said file
Upon GET request, pull file contents, put into object, stringify, then send stringified object.
Upon POST request, get file, append POST'd object into file.
*/

// var fs = require('fs');
// //var obj = {a: 1, b: 'hello'};

// var serveMsgs = function (response) {
//     // ourMessage is an empty string that will hold the contents of the file
//   var ourMessage = '';

//   // Open up messages.txt which holds our message data
//   fs.readFile('./server/messages.txt', 'utf-8', function(err, contents) {
//     // If there is an error, throw the error
//     if (err) { throw err; }
//     // Else, respond with the contents of the file
//     ourMessage = contents.split('\n');
//   });
//   for (var i = 0; i < ourMessage.length; i++) {
//     ourMessage[i] = JSON.parse(ourMessage[i]);
//   }
//   console.log(ourMessage);
//   ourMessage = JSON.stringify(ourMessage);
//   console.log(ourMessage);
//   response.end(ourMessage);
// };

// var writeMsgs = function (obj, request, response) {
//   var string = JSON.stringify(obj);
//   string += '\n';
//   fs.appendFile('./server/messages.txt', string, 'utf-8', function(err) {
//     if (err) { throw err; }
//     response.end();
//     console.log('The ' + string + 'has been appended to the file');
//   });
// };

// var parseMessage = function (request, response) {
//   var jsonString = '';

//   request.on('data', function (data) {
//     jsonString += data;
//   });

//   request.on('end', function () {
//     console.log(jsonString);
//     console.log(JSON.parse(jsonString));
//   });
// };

// var requestHandler = function(request, response) {
//   // Request and Response come from node's http module.
//   //
//   // They include information about both the incoming request, such as
//   // headers and URL, and about the outgoing response, such as its status
//   // and content.
//   //
//   // Documentation for both request and response can be found in the HTTP section at
//   // http://nodejs.org/documentation/api/

//   // Do some basic logging.
//   //
//   // Adding more logging to your server can be an easy way to get passive
//   // debugging help, but you should always be careful about leaving stray
//   // console.logs in your code.
//   console.log('Serving request type ' + request.method + ' for url ' + request.url);
//   // The outgoing status.
//   var statusCode = 200;

//   // See the note below about CORS headers.
//   //var headers = defaultCorsHeaders;

//   // Tell the client we are sending them plain text.
//   //
//   // You will need to change this if you are sending something
//   // other than plain text, like JSON or HTML.
//   //headers['Content-Type'] = 'application/JSON';

//   // .writeHead() writes to the request line and headers of the response,
//   // which includes the status and all headers.
//   response.writeHead(statusCode, headers);

//   if (request.method === 'GET') {
//     serveMsgs(response);
//   } else if (request.method === 'POST') {
//     console.log('Else');
//     writeMsgs(obj, request, response);
//     //parseMessage(request, response);
//   }
//   // Make sure to always call response.end() - Node may not send
//   // anything back to the client until you do. The string you pass to
//   // response.end() will be the body of the response - i.e. what shows
//   // up in the browser.
//   //
//   // Calling .end "flushes" the response's internal buffer, forcing
//   // node to actually send all the data over to the client.
//   //response.end(ourMessage);
// };


// exports.handleRequest = requestHandler;
// exports.corsHeaders = defaultCorsHeaders;