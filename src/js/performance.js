var osu = require('node-os-utils')
var cpu = osu.cpu
var mem = osu.mem
var drive = osu.drive
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
        console.log("RAM: " + used + "/" + total)
        console.log("RAM Usage: " + usage)
        $('#ram-usage-progress').val(usage)
        $('#ram-usage-percent').html("RAM Usage: " + usage + "% ")
        getMemUsage()
    })
}
