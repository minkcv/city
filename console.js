var stdout = document.getElementById('stdout');
var stdin = document.getElementById('stdin');
var consolepane = document.getElementById('console');
stdin.focus();

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
    print('>' + cmd);
    var tokens = cmd.split(' ');
    if (!tokens) {
        return;
    }
    if (tokens[0] === 'help')
        printHelp(tokens.slice(1));
    else if (tokens[0] === 'nav')
        navCmd(tokens.slice(1));
    else
        printUnknownCmd(tokens[0]);

    stdout.scrollTop = stdout.scrollHeight;
}

function navCmd(args) {
    if (args.length < 1 || args[0] == 'current')
        print('Current sector: ' + 'wololo');
    else if (args[0] === 'list') {
        print('Sectors: ' + 'pssh');
    }
    else
        printUnknownOption(args[0], 'nav');
}

function printHelp(args) {
    if (args.length < 1 || args[0] == 'help') {
        print('Available Commands:')
        print('  help - show this help');
        print('  help [command] - get help on a specific command');
        print('  nav - navigate sectors');
        print('  sys - manage CityOS system');
        print('  e - control electrical systems');
        print('  p - control plumbing systems');
        print('  v - control 3D view module');
        print('  s - control sound module');
    }
    else if (args[0] == 'nav') {
        print('nav - options:');
        print('  current - (optional) list current sector');
        print('  list - list available sectors');
        print('  go [sector name] - set the current sector by name');
    }
    else if (args[0] == 'sys') {

    }
    else if (args[0] == 'e') {
        
    }
    else if (args[0] == 'p') {

    }
    else if (args[0] == 'v') {
        
    }
    else if (args[0] == 's') {
        
    }
    else {
        print('No help entry for "' + args[0] + '"');
    }
}

function printUnknownCmd(cmd) {
    print('"' + cmd + '" is not a recognized command.');
}

function printUnknownOption(option, cmd) {
    print('Unknown option "' + option + '" for command ' + cmd);
}

function print(line) {
    var li = document.createElement('pre');
    var txt = document.createTextNode(line);
    li.appendChild(txt);
    stdout.appendChild(li);
}