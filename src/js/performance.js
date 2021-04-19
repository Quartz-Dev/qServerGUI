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

function startUptimeTimer(){
    
}

function test(){
    var foo = process.memoryUsage().heapUsed / 1024 / 1024
    var foo2 = process.getSystemMemoryInfo().total / 1024
    console.log("Used:" + Math.round(foo * 100) / 100 )
    console.log("Total:" + Math.round(foo2 * 100) / 100 )
    console.log("Percentage:" + (foo/foo2*100).toFixed(2) + "%")
}
