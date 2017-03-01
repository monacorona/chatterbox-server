//copy in cors headers from request handler
var defaultCorsHeaders = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10, // Seconds.
  //appended to headers object
  'Content-Type': 'application/JSON'
};

exports.sendResponse = function () {
  //make sure 200
  statusCode = statusCode || 200;
};

exports.collectData = function () {
  var data = '';
  request.on('data', function(chunk){
  	//appending chunk to data
  	data += chunk;
  })
  request.on('end', function () {
  	// ohh yeah baby. parse that data.
  	callback(JSON.parse(data));
  })
};

// exports.serveMessages = function () {
	
// };

//
exports.makeActionHandler = function () {
  return function(request, response) {
  	var action = actionMap[request.method];
  	if(action) {
  		action(request, response)
  	} else {
  	//if no action handled, send a 404/failed response
  		exports.sendResponse(response, '', '404')
  	}
  }
	
};