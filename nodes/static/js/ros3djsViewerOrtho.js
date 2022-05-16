


// Create the main viewer.
    var viewer = new ROS3D.Viewer({
        divID : '3d_view',
        width : 600,
        height : 200,
        near : 0.5,
        far : 100000,

        antialias : true,
        intensity : 1.0,
        alpha : 0.5,
        background : '#1e2f38',  // 1e2f38
        cameraPose : {  x : 0, y : 0, z : 100 },
      displayPanAndZoomFrame : false
    });

//    viewer.camera = new THREE.OrthographicCamera( width / - 2, width / 2, height / 2, height / - 2, 1, 1000 );
    var ortho_width = 800;
    var ortho_height = 200;
    var ortho_aspect_ratio = ortho_width / ortho_height;
    var ortho_view_size = 100;
    var orthozoom = 100;
    var orthCam = new THREE.OrthographicCamera( (-ortho_aspect_ratio*ortho_view_size)/orthozoom,
                                                (ortho_aspect_ratio*ortho_view_size)/orthozoom,
                                                ortho_view_size/orthozoom,
                                                -ortho_view_size/orthozoom ,
                                                -1, 1000 );

    var last_camera = viewer.camera;
    var last_cam_controls = viewer.cameraControls;
    console.log(last_camera.position);


    orthCam.position.copy(last_camera.position);
    orthCam.rotation.copy(last_camera.rotation);
//    orthCam.rotation.z = -1.57;

//    viewer.camera = orthCam;
//    viewer.activeCamera = orthCam;
//    viewer.currentCamera = orthCam;
////    viewer.highlighter.mouseHandler.camera = viewer.camera;
////    viewer.renderer.clear(true, true, true);
////    viewer.renderer.render(viewer.scene, orthCam);
////    viewer.cameraControls.camera = viewer.camera;
//    viewer.cameraControls = new ROS3D.OrbitControls({
//	      scene : viewer.scene,
//	      camera : viewer.camera,
//	      displayPanAndZoomFrame : true,
//	      lineTypePanAndZoomFrame: 'full'
//	    });
//	    viewer.cameraControls.userZoomSpeed = 0.5;
//	var mouseHandler = new ROS3D.MouseHandler({
//      renderer : viewer.renderer,
//      camera : viewer.camera,
//      rootObject : viewer.selectableObjects,
//      fallbackTarget : viewer.cameraControls
//    });
//
//    // highlights the receiver of mouse events
//    viewer.highlighter = new ROS3D.Highlighter({
//      mouseHandler : mouseHandler
//    });
//    console.log("cam");
//    console.log(orthCam);
//    console.log("viewer");
    console.log(viewer);
////    viewer.camera.updateProjectionMatrix();
////    viewer.draw();
////    viewer.cameraControls.update();
//    viewer.stop();
//    viewer.start();
    viewer.camera.fov = 1;


//    viewer.cameraControls.scene = viewer.scene;
//    viewer.renderer.render(viewer.scene, orthCam);
//        viewer.cameraControls.camera.rotation.z = 1.57;
//    viewer.scene.quaternion.z = -1.57;

//    viewer.cameraControls.scene = viewer.scene;
//    viewer.highlighter.mouseHandler.camera = viewer.camera;

//    viewer.cameraControls.target=(0.0001,310,0.0001);
//    viewer.cameraControls.rotateLeft();
//    viewer.cameraControls.userRotate = false;

//    console.log("cam");
//    console.log(orthCam);
//    viewer.cameraControls.camera = viewer.camera;
//    viewer.highlighter.mouseHandler.camera = viewer.camera;
//    viewer.activeCamera = orthCam;
//    viewer.camera.updateProjectionMatrix();
//    viewer.camera.updateMatrixWorld();
//    viewer.cameraControls.update();

//    console.log(viewer.camera.position);

    function tstViewer(){
        console.log(viewer);
    }
//    setInterval(tstViewer, 2000)

    function zoom(event) {
      event.preventDefault();
      cam_zoom_delta = event.deltaY*0.01;
      orthozoom += cam_zoom_delta;
//       console.log(cam_zoom_delta)
       viewer.camera.left = (-ortho_aspect_ratio*ortho_view_size)/orthozoom;
       viewer.camera.right = (ortho_aspect_ratio*ortho_view_size)/orthozoom;
       viewer.camera.top = ortho_view_size/orthozoom;
       viewer.camera.bottom = -ortho_view_size/orthozoom;
       viewer.camera.updateProjectionMatrix();

    }

    let scale = 1;
    const el = document.getElementById("3d_view");
//    el.onwheel = zoom;


    posa = new THREE.Vector3(0, 0, 0);
    function move_cam(){
//        requestAnimationFrame( move_cam );
        orthCam.rotation.z +=  0.05;
//        viewer.scene.rotation.z = viewer.cameraControls.camera.rotation.z;
//        posa.x = posa.x + 0.5;;
//        viewer.cameraControls.target=(0,posa.x,0);
//        viewer.camera.updateProjectionMatrix();
//        viewer.camera.lookAt(posa);
//        viewer.camera.updateMatrixWorld();
//        viewer.camera.position.y += viewer.camera.position.y +0.005;
//        viewer.camera.rotation.onChangeCallback();
//        viewer.camera.updateProjectionMatrix();
//        viewer.camera.updateMatrixWorld();
            viewer.renderer.render(viewer.scene, orthCam);
            orthCam.updateProjectionMatrix();
        console.log("ssssssssssssssssss")
    }
//    setInterval(move_cam, 1000);


    function changeViewerSize(){
        var width = document.getElementById("3d_view").clientWidth;
        var height = document.getElementById("3d_view").clientHeight;
        var padding = parseInt((document.getElementById("3d_view").style.padding).replace('px', ''));
        viewer.resize(width-(padding*2), height-(padding*2));
    };
    new ResizeObserver(changeViewerSize).observe(document.getElementById("3d_view"));

    function updateCam(){
        viewer.cameraControls.rotateDown();
    }


    viewer.cameraControls.addEventListener('mousedown', function(event3d) {
       console.log(event3d.mouseRay);
       var map_x = event3d.mouseRay.origin.x + (event3d.mouseRay.direction.x * event3d.mouseRay.origin.z);
       var map_y = event3d.mouseRay.origin.y + (event3d.mouseRay.direction.y * event3d.mouseRay.origin.z);
       console.log('x: ' + map_x + '  y: ' + map_y);
    });


//    var updateViewCam = setInterval(updateCam, 1000);
