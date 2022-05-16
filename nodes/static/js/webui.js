var twist;
var cmdVel;
var publishImmidiately = true;
var robot_IP;
var manager;
var teleop;
var ros;
var openups;
var throttle = 0.42;
var upsState;
var batState;

//Subscribing to a Topic
//----------------------
// Like when publishing a topic, we first create a Topic object with details of the topic's name
// and message type. Note that we can call publish or subscribe on the same topic object.

function callStopLds() {
	// Calling a service
  // -----------------

  var stopMotorClient = new ROSLIB.Service({
    ros : ros,
    name : '/stop_motor',
    serviceType : 'std_srvs/EmptyRequest'
  });

  var request = new ROSLIB.ServiceRequest({
    
  });

  stopMotorClient.callService(request, function(result) {
    console.log('Result for service call on '
      + stopMotorClient.name
      + ': '
      + result.sum);
  });

}






function callStartLds() {
	// Calling a service
  // -----------------

  var startMotorClient = new ROSLIB.Service({
    ros : ros,
    name : '/start_motor',
    serviceType : 'std_srvs/EmptyRequest'
  });

  var request = new ROSLIB.ServiceRequest({
    
  });

  startMotorClient.callService(request, function(result) {
    console.log('Result for service call on '
      + startMotorClient.name
      + ': '
      + result.sum);
  });

}

document.getElementById('motor-lds-off').onclick = function() {
    callStopLds();
};

document.getElementById('motor-lds-on').onclick = function() {
    callStartLds();	
};


function publishTorque(torque) {
	// Publishing a Topic
  // ------------------

  var motorPowerTopic = new ROSLIB.Topic({
    ros : ros,
    name : '/motor_power',
    messageType : 'std_msgs/Bool'
  });

  var motor_power = new ROSLIB.Message({
    data : torque
  });
  motorPowerTopic.publish(motor_power);
}

document.getElementById('motor-torque-on').onclick = function() {
    publishTorque(true);
};
document.getElementById('motor-torque-off').onclick = function() {
    publishTorque(false);
};

function getSensorState() {
	// Subscribing to a Topic
  // ----------------------

  var listenerSensor = new ROSLIB.Topic({
    ros : ros,
    name : '/sensor_state',
    messageType : 'turtlebot3_msgs/SensorState'
  });

  listenerSensor.subscribe(function(message) {
     console.log('Received message on ' + listenerSensor.name + ': ' + message.torque);
	// console.log(message);
	if (message.torque) {
		document.getElementById("motor_torque").textContent = "On";
		document.getElementById("motor_torque").className = "text-success d-inline-flex d-xl-flex justify-content-xl-end";
		document.getElementById("motor-torque-on").className = "btn btn-outline-primary card-box-button";
		document.getElementById("motor-torque-off").className = "btn btn-primary card-box-button";
		
	} else {
		document.getElementById("motor_torque").textContent = "Off";
		document.getElementById("motor_torque").className = "text-danger d-inline-flex d-xl-flex justify-content-xl-end";
		document.getElementById("motor-torque-on").className = "btn btn-primary card-box-button";
		document.getElementById("motor-torque-off").className = "btn btn-outline-primary  card-box-button";
	}
    listenerSensor.unsubscribe();
  });
}


function getOpenUPS() {
    console.log('getopenups');
  openups = new ROSLIB.Topic({
    ros: ros,
    name: "/ups",
    messageType: "vitulus_ups/vitulus_ups"
  });
  // Then we add a callback to be called every time a message is published on this topic.
  openups.subscribe(function(message) {
//    console.log('Received message on ' + openups.name + ': ' + message.ups_status);
//    console.log( message );


    document.getElementById("ups-state").textContent = message.ups_status;
    if (message.ups_status.includes("online")){
        document.getElementById("ups-state").className = "text-success d-inline-flex d-xl-flex justify-content-xl-end";
        upsState = "Online";
    }

	if (message.ups_status.includes("offline")){
		document.getElementById("ups-state").className = "text-warning d-inline-flex d-xl-flex justify-content-xl-end";
		upsState = "OnBattery";
	}

    document.getElementById("bat-state").textContent = message.battery_status;
	if (message.battery_status.includes("charging")){
		document.getElementById("bat-state").className = "text-warning d-inline-flex d-xl-flex justify-content-xl-end";
		batState = "Charging";
	} else if (message.battery_status.includes("discharging")){
		document.getElementById("bat-state").className = "text-danger d-inline-flex d-xl-flex justify-content-xl-end";
		batState = "Discharging";
	} else {
		document.getElementById("bat-state").className = "text-success d-inline-flex d-xl-flex justify-content-xl-end";
		batState = "Full";
	}

//	// document.getElementById("ups-state").textContent = message.ups_status;

    if (message.battery_capacity <= 100) {
      document.getElementById("bat-charge-ico").className = "fas fa-battery-full card-box-icon text-success";
    }
	if (message.battery_capacity < 76) {
      document.getElementById("bat-charge-ico").className = "fas fa-battery-three-quarters card-box-icon text-success";
    }
	if (message.battery_capacity < 51) {
      document.getElementById("bat-charge-ico").className = "fas fa-battery-half card-box-icon text-warning";
    }
	if (message.battery_capacity < 30) {
      document.getElementById("bat-charge-ico").className = "fas fa-battery-quarter card-box-icon text-danger";
    }
	if (message.battery_capacity < 21) {
      document.getElementById("bat-charge-ico").className = "fas fa-battery-empty card-box-icon text-danger";
    }
	document.getElementById("out-volts").textContent = (message.output_voltage/1000).toFixed(2);
    document.getElementById("out-amps").textContent = (message.output_current/1000).toFixed(2);
	var outWats = ((message.output_current/1000) * (message.output_voltage/1000))
	document.getElementById("out-wats").textContent = outWats.toFixed(2);

    document.getElementById("bat-volts").textContent = (message.battery_voltage/1000).toFixed(2);
	document.getElementById("bat-amps").textContent = (message.battery_current/1000).toFixed(2);


	var batWats = (message.battery_voltage/1000) * (message.battery_current/1000)
	document.getElementById("bat-wats").textContent = batWats.toFixed(2);
	document.getElementById("bat-perc").textContent = message.battery_capacity;

    document.getElementById("ups-volts").textContent = (message.input_voltage/1000).toFixed(2);
    document.getElementById("ups-amps").textContent = (message.input_current/1000).toFixed(2);
	document.getElementById("ups-wats").textContent = ((message.input_current/1000) * (message.input_voltage/1000)).toFixed(2);
	document.getElementById("ups-temp").textContent = 00;


    // If desired, we can unsubscribe from the topic as well.
//    openups.unsubscribe();
  });
}

function moveAction(linear, angular) {
  if (linear !== undefined && angular !== undefined) {
    twist.linear.x = linear;
    twist.angular.z = angular;
  } else {
    twist.linear.x = 0;
    twist.angular.z = 0;
  }
  cmdVel.publish(twist);
}

function initVelocityPublisher() {
  // Init message with zero values.
  twist = new ROSLIB.Message({
    linear: {
      x: 0,
      y: 0,
      z: 0
    },
    angular: {
      x: 0,
      y: 0,
      z: 0
    }
  });
  // Init topic object
  cmdVel = new ROSLIB.Topic({
    ros: ros,
    name: "/cmd_vel",
    messageType: "geometry_msgs/Twist"
  });
  // Register publisher within ROS system
  cmdVel.advertise();
}

function initTeleopKeyboard() {
  // Use w, s, a, d keys to drive your robot

  // Check if keyboard controller was aready created
  if (teleop == null) {
    // Initialize the teleop.
    teleop = new KEYBOARDTELEOP.Teleop({
      ros: ros,
      topic: "/cmd_vel",
      throttle: throttle
    });
    teleop.scale = document.getElementById("robot-speed").value / 100;
    document.getElementById("r-speed-badge").textContent = (teleop.scale * throttle).toFixed(2);
	teleop.working = false;
    // console.log('scale: ' + teleop.scale);
    // console.log(teleop.scale);
    // console.log('throttle: ' + throttle);
    // console.log(throttle);
  }

  // Add event listener for slider moves
  robotSpeedRange = document.getElementById("robot-speed");
  robotSpeedRange.oninput = function() {
    teleop.scale = robotSpeedRange.value / 100;
    document.getElementById("r-speed-badge").textContent = (teleop.scale * throttle).toFixed(2);
    console.log('scale: ' + teleop.scale);
    console.log(teleop.scale);
    console.log('throttle: ' + throttle);
    console.log(throttle);
  };
  
}

function createJoystick() {
  // Check if joystick was aready created
  if (manager == null) {
    joystickContainer = document.getElementById("joystick");
    // joystck configuration, if you want to adjust joystick, refer to:
    // https://yoannmoinet.github.io/nipplejs/
    var options = {
      zone: joystickContainer,
      position: { left: 50 + "%", top: 105 + "px" },
      mode: "dynamic",
      size: 200,
      color: "#0066ff",
      restJoystick: true
    };
    manager = nipplejs.create(options);
    // event listener for joystick move
    manager.on("move", function(evt, nipple) {
      // nipplejs returns direction is screen coordiantes
      // we need to rotate it, that dragging towards screen top will move robot forward
      var direction = nipple.angle.degree - 90;
      if (direction > 180) {
        direction = -(450 - nipple.angle.degree);
      }
      // convert angles to radians and scale linear and angular speed
      // adjust if youwant robot to drvie faster or slower
      var lin = Math.cos(direction / 57.29) * nipple.distance * 0.0052;
      var ang = Math.sin(direction / 57.29) * nipple.distance * 0.019;
      // nipplejs is triggering events when joystic moves each pixel
      // we need delay between consecutive messege publications to
      // prevent system from being flooded by messages
      // events triggered earlier than 50ms after last publication will be dropped
    //   console.log('LIN: ' + lin);
    //   console.log('ANG: ' + ang);

      if (publishImmidiately) {
        publishImmidiately = false;
        moveAction(lin, ang);
        setTimeout(function() {
          publishImmidiately = true;
        }, 50);
      }
    });
    // event litener for joystick release, always send stop message
    manager.on("end", function() {
      moveAction(0, 0);
    });
  }
}

document.getElementById('keyboard-checkbox').onclick = function() {
    if ( this.checked ) {
		teleop.working = true;
        document.getElementById("keyboard-label").textContent = "On";
    } else {
		teleop.working = false;
		document.getElementById("keyboard-label").textContent = "Off";
		
    }
};

//window.onload = function() {
//  // determine robot address automatically
//  // robot_IP = location.hostname;
//  // set robot address statically
//  // robot_IP = "192.168.0.131";
//  // robot_IP = "10.42.0.1";
//  robot_IP = "192.168.88.244";
//
//  // // Init handle for rosbridge_websocket
//  ros = new ROSLIB.Ros({
//    url: "ws://" + robot_IP + ":9090"
//  });

//  getOpenUPS();
//  setInterval(getOpenUPS, 1000);
//  initVelocityPublisher();
//  // get handle for video placeholder
//  video = document.getElementById("camera-image");
//  // Populate video source
//  video.src = "http://" + robot_IP + ":8080/stream?topic=/camera/color/image_raw&type=mjpeg&quality=40";
//  video.onload = function() {
//    // joystick and keyboard controls will be available only when video is correctly loaded
//    createJoystick();
//    initTeleopKeyboard();
//	getSensorState()
//	setInterval(getSensorState, 1000);
//  };
//};
