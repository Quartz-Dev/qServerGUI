var child = require('child_process')
window.$ = window.jquery = require('jquery')

var java_path = 'java'
var server_path = 'C:\\Users\\derek\\Documents\\Minecraft\\Server\\Test\ Spigot\ Server'
var jar_name = 'spigot.jar'
var java_min = '-Xms8G'
var java_max = '-Xmx8G'

var server_jar = null

function startServer(){
    console.log('GUI Iussuing Start Server...')
    server_jar = child.spawn(
        java_path,
        [java_min, java_max, '-XX:+UseG1GC', '-jar', jar_name, 'nogui'] ,
        { cwd: server_path }
        )
    
    server_jar.stdout.on('data', function(data) {
            var serverOutput = data.toString()
            updateServerConsole(serverOutput)
        })

    server_jar.stderr.on("data", function (data) {
        var serverOutput = data.toString()
        updateServerConsole(serverOutput)
    })
    console.log(server_jar.pid)
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
});

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
    var newLine = document.createElement("ul")
    newLine.innerHTML = line
    document.getElementById('console-output-line').appendChild(newLine)
    $('#console-output').animate({scrollTop: $('#console-output').get(0).scrollHeight}, 0)
}