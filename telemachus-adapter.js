// A node shim that connects Firebase to the Telemachus plugin

var Firebase = require("firebase");
var http = require('http');

var myFirebaseRef = new Firebase("https://test-firebase-please-ignore.firebaseio.com/ksp/");


//TODO: replace with WebSocket stuff
// Send telemetry
setInterval(function() {
	http.request({
		host: 'localhost',
		port: 8085, 
		path: '/telemachus/datalink?geeForce=v.geeForce&altitude=v.altitude&liquidFuel=r.resource[LiquidFuel]'
	  }, 
	  function(response) {
			var str = "";
		  response.on('data', function (chunk) {
			str += chunk;
		  });

		  response.on('end', function () {
            myFirebaseRef.child("telem").update(JSON.parse(str));
			// your code here if you want to use the results !
		  });
	  }).end();
}, 200);

// TODO: replace with WebSocket stuff
// Handle actions coming in
myFirebaseRef.child("actions").on("child_added", function(snapshot) {
  if(snapshot.val() === "stage") {
    console.log("staging!");
    http.request({
        host: 'localhost',
        port: 8085, 
        path: '/telemachus/datalink?stage=f.stage'
      }, 
      function(response) {
			var str = "";
		  response.on('data', function (chunk) {
			str += chunk;
		  });

		  response.on('end', function () {
			console.log(str);
			// your code here if you want to use the results !
		  });
      }).end();
  }
});
