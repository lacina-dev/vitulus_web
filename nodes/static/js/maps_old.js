
///////////////////////////////////////////////////////////////////////  EXECUTE MAP PATH    ///////////////////////////////////////////////////////////////////////

function executePath(name){
    console.log(name);
    var executePathTopic = new ROSLIB.Topic({
        ros : ros,
        name : '/navi_manager/execute_path',
        messageType : 'std_msgs/String'
    });

    var executePathMsg = new ROSLIB.Message({
        data : name,
    });
    executePathTopic.publish(executePathMsg);
}






