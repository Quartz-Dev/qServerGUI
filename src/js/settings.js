window.$ = window.jquery = require('jquery')
//const config = require('electron-json-config');

var java_path = null;
var jar_name = null;
var server_dir = null;
var java_min = null;
var java_max = null;

onAppLoad()

function onAppLoad(){
    setRamRange()
    loadLaunchOptions()
}

function loadLaunchOptions(){
    console.log('Loading launch options...')
    java = config.get('java-path')
    jar_name = config.get('jar-name')
    server_dir = config.get('server-dir')
    java_min = config.get('java-min-ram')
    if(java_min){
        var int_min = parseInt(java_min.slice(0,-1))
        $('#range-min-ram').val(int_min)
        $('#amount-min-ram').val(int_min)
    }
    
    java_max = config.get('java-max-ram')
    if(java_max){
        var int_max = parseInt(java_max.slice(0,-1))
        $('#range-max-ram').val(int_max)
        $('#range-max-ram').val(int_max)
        $('#amount-max-ram').val(int_max)
    }
}

function saveLaunchOptions(){

    // java environment (if 'java' use default path)
    java = 'java'
    if(java)
        config.set('java-path', java)

    // server.jar and server directory
    updateJarPath()
    if(jar_name)
        config.set('jar-name', jar_name)

    if(server_dir)
        config.set('server-dir', server_dir)
    
    // java vm memory size
    java_min = $('#amount-min-ram').val() + "M"
    if(java_min)
        config.set('java-min-ram', java_min)

    java_max = $('#amount-max-ram').val() + "M"
    if(java_max)
        config.set('java-max-ram', java_max)

    // prints options to console
    printLaunchOptions()
}

function setRamRange(){
    var total_memory_mb = process.getSystemMemoryInfo().total/1000
    $('#range-min-ram').prop("max", total_memory_mb);
    $('#range-max-ram').prop("max", total_memory_mb);
    $('#amount-min-ram').prop("max", total_memory_mb);
    $('#amount-max-ram').prop("max", total_memory_mb);
}

function updateMinAmount(){
    var slider = $('#range-min-ram').val()
    $('#amount-min-ram').val(slider)
}

function updateMinSlider(){
    var amount = $('#amount-min-ram').val()
    $('#range-min-ram').val(amount)
}

function updateMaxAmount(){
    var slider = $('#range-max-ram').val()
    $('#amount-max-ram').val(slider)
}

function updateMaxSlider(){
    var amount = $('#amount-max-ram').val()
    $('#range-max-ram').val(amount)
}

function printLaunchOptions(){
    var msg = "Launch Options: \n"
    msg += "- Server Directory: \'" + config.get('server-dir') + "\'\n"
    msg += "- Jar File Name: \'" + config.get('jar-name') + "\'\n"
    msg += "- Java : \'" + config.get('java-path') + "\'\n"
    msg += "- RAM Min: \'" + config.get('java-min-ram') + "\'\n"
    msg += "- RAM Max: \'" + config.get('java-max-ram') + "\'\n"

    console.log(msg)
}

function updateJarPath(){
    if(document.getElementById('input-jar-path').files){
        if(document.getElementById('input-jar-path').files[0]){
            var input_file_name = document.getElementById('input-jar-path').files[0].name
            var input_file_path = document.getElementById('input-jar-path').files[0].path.replace(input_file_name, "")
            server_dir = input_file_path
            jar_name = input_file_name
        }
    }
}
