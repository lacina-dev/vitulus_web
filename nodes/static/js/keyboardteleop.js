/**
 * @author Russell Toris - rctoris@wpi.edu
 */

var KEYBOARDTELEOP = KEYBOARDTELEOP || {
  REVISION : '0.3.0'
};

/**
 * @author Russell Toris - rctoris@wpi.edu
 */

/**
 * Manages connection to the server and all interactions with ROS.
 *
 * Emits the following events:
 *   * 'change' - emitted with a change in speed occurs
 *
 * @constructor
 * @param options - possible keys include:
 *   * ros - the ROSLIB.Ros connection handle
 *   * topic (optional) - the Twist topic to publish to, like '/cmd_vel'
 *   * throttle (optional) - a constant throttle for the speed
 */
KEYBOARDTELEOP.Teleop = function(options) {
  var that = this;
  options = options || {};
  var ros = options.ros;
  var topic = options.topic || '/cmd_vel';
  // permanent throttle
  var throttle = options.throttle || 1.0;

  // used to externally throttle the speed (e.g., from a slider)
  this.scale = 1.0;
  this.working = true;

  // linear x and y movement and angular z movement
  var x = 0;
  var y = 0;
  var z = 0;

  var cmdVel = new ROSLIB.Topic({
    ros : ros,
    name : topic,
    messageType : 'geometry_msgs/Twist'
  });

  var speed_up = 0;
  var speed_down = 0;
  var speed_left = 0;
  var speed_right = 0;
  var pub = true;
  var oldX = x;
  var oldY = y;
  var oldZ = z;

  // sets up a key listener on the page used for keyboard teleoperation
  var handleKey = function(keyCode, keyDown) {
    // used to check for changes in speed
    oldX = x;
    oldY = y;
    oldZ = z;
    
    pub = true;


//    console.log(pub)
    // check which key was pressed
    switch (keyCode) {
      case 65: // turn left
        if (keyDown === true) { speed_left = throttle * that.scale;}else{speed_left = 0;};
        z = 2 * speed_left; // 1
        break;
      case 87:  // up
        if (keyDown === true) { speed_up = throttle * that.scale;}else{speed_up = 0;};
        x = 1 * speed_up; // 0.5
        break;
      case 68:  // turn right
        if (keyDown === true) { speed_right = throttle * that.scale;}else{speed_right = 0;};
        z = -2 * speed_right; // -1
        break;
      case 83:  // down
        if (keyDown === true) { speed_down = throttle * that.scale;}else{speed_down = 0;};
        x = -1 * speed_down; // -0.5
        break;

      default:
        pub = false;
    }
};

    function pub_key_speed(){
        // publish the command
        if (pub === true && that.working) {
          var twist = new ROSLIB.Message({
            angular : {
              x : 0,
              y : 0,
              z : z
            },
            linear : {
              x : x,
              y : y,
              z : 0
            }
          });

          cmdVel.publish(twist);


          // check for changes
          if (oldX !== x || oldY !== y || oldZ !== z) {
            that.emit('change', twist);
          }

        }
    }
   setInterval(pub_key_speed, 100);



var body = document.getElementsByTagName('body')[0];
  body.addEventListener('keyup', function(e) {
    handleKey(e.keyCode, false);
  }, false);
  body.addEventListener('keydown', function(e) {
    handleKey(e.keyCode, true);
  }, false);


};
KEYBOARDTELEOP.Teleop.prototype.__proto__ = EventEmitter2.prototype;
