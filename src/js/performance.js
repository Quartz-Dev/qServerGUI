var osu = require('node-os-utils')
var disk = require('check-disk-space')
var cpu = osu.cpu
var mem = osu.mem
var netstat = osu.netstat


getCPUUsage()

function getCPUUsage(){
    cpu.usage(2000).then(info => {
        var usage = Math.round(info)
        $('#cpu-usage-progress').val(usage)
        $('#cpu-usage-percent').html("CPU Usage: " + usage + "% ")
        getCPUUsage()
    })
}

getMemUsage()

function getMemUsage(){
    mem.used().then(info => {
        var used = info.usedMemMb
        var total = info.totalMemMb
        var usage = Math.round((used/total)*100)
        $('#ram-usage-progress').val(usage)
        $('#ram-usage-percent').html("RAM Usage: " + usage + "% ")
        getMemUsage()
    })
}

getDiskSpace()


var config = require('electron-json-config');

function getDiskSpace(){
    var path = config.get('server-dir')
    disk(path).then((diskSpace) => {
        var size = diskSpace.size
        var free = diskSpace.free
        var used = Math.round((1 - (free/size))*100)
        $('#disk-space-progress').val(used)
        $('#disk-space-percent').html("Disk Space: " + used + "% ")
        getDiskSpace()
    })
}

var stopwatch = require('timer-stopwatch')

var uptime = new stopwatch()

function startUptimeTimer(){
    uptime.reset()
    uptime.start()
}

function stopUptimeTimer(){
    uptime.stop()
}

var date = null

uptime.onTime(function(rawtime){
    date = new Date(rawtime.ms)
    days = date.getUTCDate()-1
    if(days<10) days = "0" + days
    hours = date.getUTCHours()
    if(hours<10) hours = "0" + hours
    minutes = date.getUTCMinutes() 
    if(minutes<10) minutes = "0" + minutes
    seconds = date.getUTCSeconds()
    if(seconds<10) seconds = "0" + seconds
    digital = `[${days}:${hours}:${minutes}:${seconds}]`
    $('#server-uptime').html(`Server Uptime: ${digital} `)
})

function test(){
    // var foo = process.memoryUsage().heapUsed / 1024 / 1024
    // var foo2 = process.getSystemMemoryInfo().total / 1024
    // console.log("Used:" + Math.round(foo * 100) / 100 )
    // console.log("Total:" + Math.round(foo2 * 100) / 100 )
    // console.log("Percentage:" + (foo/foo2*100).toFixed(2) + "%")
}
