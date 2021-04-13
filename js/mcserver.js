var child = require('child_process')
window.$ = window.jquery = require('jquery')

var java_path = 'java'
var server_path = null;
var jar_name = null;
var java_min = null;
var java_max = null;

var server_jar = null

function startServer(){

    if(!server_path || !jar_name || !java_min || !java_max){
        alert("Update Settings")
        return
    }

    console.log('GUI Iussuing Start Server...')
    server_jar = child.spawn(
        java_path,
        [java_min, java_max, '-XX:+UseG1GC', '-jar', jar_name, 'nogui'] ,
        { cwd: server_path }
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
    var newLine = document.createElement("p")
    newLine.innerHTML = line
    document.getElementById('console-output-line').appendChild(newLine)
    $('#console-output').animate({scrollTop: $('#console-output').get(0).scrollHeight}, 0)
}

function setRamRange(){
    var total_memory_mb = process.getSystemMemoryInfo().total/1000
    console.log("Total Memory: " + total_memory_mb + "mb")
    $('#range-min-ram').prop("max", total_memory_mb);
    $('#range-max-ram').prop("max", total_memory_mb);
    updateMinAmount()
    updateMaxAmount()
    printLaunchOptions()
}

function updateMinAmount(){
    var slider = $('#range-min-ram').val()
    $('#amount-min-ram').val(slider)
    java_min = "-Xms" + slider + "M"
}

function updateMinSlider(){
    var amount = $('#amount-min-ram').val()
    $('#range-min-ram').val(amount)
    java_min = "-Xms" + amount + "M"
}

function updateMaxAmount(){
    var slider = $('#range-max-ram').val()
    $('#amount-max-ram').val(slider)
    java_max = "-Xmx" + slider + "M"
}

function updateMaxSlider(){
    var amount = $('#amount-max-ram').val()
    $('#range-max-ram').val(amount)
    java_max = "-Xmx" + amount + "M"
}

function printLaunchOptions(){
    console.log("Server Path: \'" + server_path + "\'")
    console.log("Jar File Name: \'" + jar_name + "\'")
    console.log("Java : \'" + java_path + "\'")
    console.log("RAM Min: \'" + java_min + "\'")
    console.log("RAM Max: \'" + java_max + "\'")
}

function updateJarLocation(){
    if(document.getElementById('input-jar-path').files){
        var input_file_name = document.getElementById('input-jar-path').files[0].name
        var input_file_path = document.getElementById('input-jar-path').files[0].path.replace(input_file_name, "")
        server_path = input_file_path
        jar_name = input_file_name
    }
}

function openTab(evt, tabName) {
    // Declare all variables
    var i, tabcontent, tablinks
    if(tabName.toLowerCase() == 'settings'){
        setRamRange()
    }
  
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