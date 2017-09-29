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
        print('  help - Show this help');
        print('  help [command] - Get help on a specific command');
        print('  nav - Navigate Sectors');
        print('  sys - Manage CityOS System');
        print('  e - Control Electrical Systems');
        print('  p - Control Plumbing Systems');
        print('  v - Control 3D View Module');
        print('  s - Control Sound Module');
    }
    else if (args[0] == 'nav') {
        print('nav - options:');
        print('  current - (optional) list current sector');
        print('  list - list available sectors');
        print('  go [sector name] - set the current sector by name');
    }
    else if (args[0] == 'sys') {
        print('sys - options:');
        print('  users - list system users');
        print('  whoami - list current user');
        print('  logout - end the current session');
    }
    else if (args[0] == 'e') {
        print('e - options:');
    }
    else if (args[0] == 'p') {
        print('p - options:');
    }
    else if (args[0] == 'v') {
        print('v - options:');
    }
    else if (args[0] == 's') {
        print('s - options:');
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