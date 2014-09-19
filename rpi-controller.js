// It's a simple one button, one LED proof of concept controller for Kerbal Space Program

var raspi = require('raspi-io'),
    five = require('johnny-five'),
    board = new five.Board({
      io: new raspi()
    });

var Firebase = require("firebase");

var myFirebaseRef = new Firebase("https://test-firebase-please-ignore.firebaseio.com/");


board.on('ready', function() {
  var led = five.Led(7);

  // Create an Led on pin 7 (GPIO4) and strobe it on/off
  // Optionally set the speed; defaults to 100ms
  myFirebaseRef.child("ksp/telem/geeForce").on("value", function(snapshot) {
    var gees = snapshot.val();
    if(gees > 1) {
      led.on();
    } else if(gees > 0.1 && gees < 1) {
      led.strobe();
    } else {
      led.off();
    }
  });

  // Send button presses to Firebase
  button = new five.Button(26);
  button.on("down", function() {
    console.log("down - staging");
    myFirebaseRef.child("ksp/actions").push("stage");
  });
});
