var stdout = document.getElementById('stdout');
var stdin = document.getElementById('stdin');
var consolepane = document.getElementById('console');

stdin.onkeypress = function(event) {
    var key = event.keyCode || event.which;
    if (key == 13)
    {
        parseCommand(stdin.value);
        stdin.value = "";
    }
}

consolepane.onclick = function() {
    stdin.focus();
}

function parseCommand(cmd) {
    console.log("Command: " + cmd);
}