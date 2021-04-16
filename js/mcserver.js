var child = require('child_process')
window.$ = window.jquery = require('jquery')
const config = require('electron-json-config');

var java_path = null;
var jar_name = null;
var server_dir = null;
var java_min = null;
var java_max = null; 

function startServer(){
    console.log('GUI Iussuing Start Server...')

    var check = checkRequirements()

    if(check){
        alert(check)
        console.log("Error: " + check)
        return
    }

    server_jar = child.spawn(
        java_path,
        ["-Xms" + java_min, "-Xmx" + java_max, '-XX:+UseG1GC', '-jar', jar_name, 'nogui'] ,
        { cwd: server_dir }
        )
    
    changeStatusOn()
    console.log('Server Started on PID: ' + server_jar.pid)

    server_jar.stdout.on('data', function(data) {
            var serverOutput = data.toString()
            updateServerConsole(serverOutput)
        })

    server_jar.stderr.on("data", function (data) {
        var serverOutput = data.toString()
        updateServerConsole(serverOutput)
    })

    server_jar.on('close', function(){
        console.log('Server Closed')
        changeStatusOff()
    })
}

function checkRequirements(){
    var alert_prefix = 'Update the following launch options: \n'
    var alert_msg = ""

    java_path = config.get('java-path')
    jar_name = config.get('jar-name')
    server_dir = config.get('server-dir')
    java_min = config.get('java-min-ram')
    java_max = config.get('java-max-ram')

    if(!java)
        alert_msg += '- Java Version\n'
    if(!server_dir)
        alert_msg += '- Server Directory\n'
    if(!jar_name)
        alert_msg += '- Server Jar\n'
    if(jar_name)
        if(!jar_name.endsWith('.jar'))
            alert_msg += '- Server needs to be a jar file\n'
    if(!java_min)
        alert_msg += '- Java Min Ram\n'
    if(!java_max)
            alert_msg += '- Java Max Ram\n'
    if(alert_msg !== ""){
        return alert_prefix + alert_msg
    }
}


function changeStatusOff(){
    $('#status-icon').removeClass('status-on')
    $('#status-icon').addClass('status-off')
}

function changeStatusOn(){
    $('#status-icon').removeClass('status-off')
    $('#status-icon').addClass('status-on')
}

function stopServer(){
    if(server_jar){
        sendServerCommand("stop")
    }
}

$(document).on("keypress", "#console-input", function(e){
    if(e.key == 'Enter'){
        if(server_jar){
            sendServerCommand($(this).val())
            $(this).val("")
        }
    }
})

function submitConsoleInput(){
    if(server_jar){
        sendServerCommand($('#console-input').val())
        $('#console-input').val("")
    }
}

function sendServerCommand(cmd){
    if(server_jar){
        console.log("GUI Issuing Command: \'" + cmd + "\'")
        server_jar.stdin.write(cmd + "\r")
    }
}

function updateServerConsole(line){
    var newLine = "<p class=\"line\">" + line + "<p>"
    $('#output-text').append(newLine)
    $('#output-text').animate({scrollTop: $('#output-text').get(0).scrollHeight}, 0)
}

function openTab(evt, tabName) {
    // Declare all variables
    var i, tabcontent, tablinks
  
    // Get all elements with class="tabcontent" and hide them
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = "none"
    }
  
    // Get all elements with class="tablinks" and remove the class "active"
    tablinks = document.getElementsByClassName("tablinks")
    for (i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" active", "")
    }
  
    // Show the current tab, and add an "active" class to the button that opened the tab
    document.getElementById(tabName).style.display = "block"
    evt.currentTarget.className += " active"
}