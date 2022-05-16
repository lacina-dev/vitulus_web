function navi(ros){



	  
	var tfClient = new ROSLIB.TFClient({
    ros : ros,
    fixedFrame : 'map',
    angularThres : 0.01,
    transThres : 0.01
  });

  tfClient.subscribe('base_link', function(tf) {
    console.log(tf);
  });
	  
	 var width = 600;
	 var height = 600;
	  var widthI = width;
	 var heightI = height; 
	 var aspect = 0.0;
// Create the main viewer.
    var viewer = new ROS2D.Viewer({
      divID : 'map',
      width : widthI,
      height : heightI
    });

///////////////////////////////////////////////////////////////////////
	var maplistener = new ROSLIB.Topic({
    ros : ros,
    name : '/rtabmap/grid_map',
    messageType : 'nav_msgs/OccupancyGrid'
  });
  var mapWidth;
  var mapHeight;
	 
  maplistener.subscribe(function(message) {
	mapWidth = message.info.width;
	mapHeight = message.info.height;
    console.log('map width: ' + mapWidth + ' map height: ' + mapHeight);
	console.log(message);
	  if (mapWidth > mapHeight){
		 aspect = (mapHeight/mapWidth);
		  console.log(aspect);
		  heightI = (height * aspect);
	 } else {
		 aspect = (mapWidth/mapHeight);
		 console.log(aspect);
		 widthI = (width * aspect);
		 
	 }
	  console.log(widthI);
	  console.log(heightI);
	  viewer.width = widthI;
	  viewer.height = heightI;
    // maplistener.unsubscribe();
  });
///////////////////////////////////////////////////////////////////////
	 
	  
	  
	  
	 console.log(widthI);
	  console.log(heightI);
    

    // Setup the map client.
	  
	  /**
 * A OccupancyGridClientNav uses an OccupancyGridClient to create a map for use with a Navigator.
 *
 * @constructor
 * @param options - object with following keys:
 *   * ros - the ROSLIB.Ros connection handle
 *   * tfClient (optional) - Read information from TF
 *   * topic (optional) - the map topic to listen to
 *   * robot_pose (optional) - the robot topic or TF to listen position
 *   * rootObject (optional) - the root object to add this marker to
 *   * continuous (optional) - if the map should be continuously loaded (e.g., for SLAM)
 *   * serverName (optional) - the action server name to use for navigation, like '/move_base'
 *   * actionName (optional) - the navigation action name, like 'move_base_msgs/MoveBaseAction'
 *   * rootObject (optional) - the root object to add the click listeners to and render robot markers to
 *   * withOrientation (optional) - if the Navigator should consider the robot orientation (default: false)
 *   * image (optional) - the route of the image if we want to use the NavigationImage instead the NavigationArrow
 *   * viewer - the main viewer to render to
 */
	  
	  
	  
	  
	  
//     var gridClient = new ROS2D.OccupancyGridClient({
//       ros : ros,
//       rootObject : viewer.scene,
// 	  topic : '/rtabmap/grid_map',
// 	  robot_pose : '/rtabmap/localization_pose',
// 	  // viewer : viewer,
// 		// Use this property in case of continuous updates			
//       continuous: true,
//     });
//     // Scale the canvas to fit to the map
//     gridClient.on('change', function(){
//       // viewer.scaleToDimensions(gridClient.currentGrid.width, gridClient.currentGrid.height);
// 	  viewer.shift(gridClient.currentGrid.pose.position.x, gridClient.currentGrid.pose.position.y);
// 		console.log(gridClient.currentGrid.pose.position.y);
//     });
	  
	  
	  

	  

	  // Setup the nav client.
      var nav = NAV2D.OccupancyGridClientNav({
         ros : ros,
         rootObject : viewer.scene,
         viewer : viewer,
		 topic : '/rtabmap/grid_map',
         serverName : '/move_base',
		 robot_pose : '/t265/odom/sample',
//		 robot_pose : '/robot_pose',
		 continuous: true,
		 actionName: 'move_base_msgs/MoveBaseActionGoal', 
		  
       });
	  
	  
	// viewer.shift(900, 3000);
	// viewer.scaleToDimensions(gridClient.currentGrid.width, gridClient.currentGrid.height);
	// viewer.scaleToDimensions(gridClient.currentGrid.width, gridClient.currentGrid.height);
    //viewer.shift(gridClient.currentGrid.pose.position.x, gridClient.currentGrid.pose.position.y);
    

}