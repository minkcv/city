var cityWorld = createWorld('three-city');
var buildingWorld = createWorld('three-building');
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

document.body.onclick = function() {
    stdin.focus();
}

function printWelcome() {
    print('CityOS 1.0');
    print('Type "help" for a list of commands');
}
printWelcome();

function parseCommand(cmd) {
    print('> ' + cmd);
    var tokens = cmd.split(' ');
    if (!tokens) {
        return;
    }
    if (tokens[0] === 'help')
        printHelp(tokens);
    else if (tokens[0] === 'nav')
        navCmd(tokens);
    else if (tokens[0] === 'sys')
        sysCmd(tokens);
    else if (tokens[0] === 'v')
        viewCmd(tokens);
    else
        printUnknownCmd(tokens[0]);

    stdout.scrollTop = stdout.scrollHeight;
}

function navCmd(args) {
    if (args.length < 2)
        printHelp(['help', 'nav']);
    else if (args[1] === 'list') {
        print('Sectors:');
        for (var i = 0; i < sectors.length; i++) {
            var name = sectors[i].name
            if (currentsector && name === currentsector.name)
                print(' *' + name);
            else
                print('  ' + name);
        }
    }
    else if (args[1] === 's') {
        if (args.length < 3)
            print('Must specify sector for option "s"');
        else {
            var newsector = getSector(args[2]);
            if (newsector == null)
                print('"' + args[2] + '" is not a valid sector');
            else {
                changeSector(newsector);
                changeBuilding(null);
                print('Changed to sector "' + currentsector.name + '"');
            }
        }
    }
    else if (args[1] === 'info') {
        var infosector = currentsector;
        if (args.length > 3)
            infosector = getSector(args[2]);

        print('Sector "' + infosector.name + '" information:');
        print(' ' + infosector.desc);
        print('  Number of buildings: ' + infosector.bldg.length);
        print(' ' + infosector.mech);
        print(' ' + infosector.elec);
        print(' ' + infosector.plmb);
    }
    else if (args[1] === 'b') {
        if (currentsector == null) {
            print('No sector selected');
        }
        else if (args.length < 3) {
            print('Buildings in sector "' + currentsector.name + '"');
            for (var i = 0; i < currentsector.bldg.length; i += 5) {
                var msg = ' ';
                for (var j = i; j < i + 5; j++) {
                    if (j < currentsector.bldg.length)
                        msg += j + ': ' + currentsector.bldg[j].name + '\t';
                }
                print(msg);
            }
        }
        else {
            var i = parseInt(args[2]);
            if (isNaN(i) || i >= currentsector.bldg.length)
                print('"' + args[2] + '" is not a known building in sector "' + currentsector.name + '"');
            else {
                changeBuilding(currentsector.bldg[i].clone());
                print('Selected building is now "' + i + ': ' + currentbuilding.name + '" in sector "' + currentsector.name + '"');
            }
        }
    }
    else
        printUnknownOption(args[0], args[1]);
}

function sysCmd(args) {
    if (args.length < 2)
        printHelp(['help', 'sys']);
    else if (args[1] === 'users') {
        print('tim');
        print('robert');
        print('charles');
        print('leonard');
    }
    else if (args[1] === 'whoami')
        print('guest');
    else if (args[1] === 'clear')
    {
        stdout.innerHTML = '';
        printWelcome();
    }
}

function viewCmd(args) {
    if (args.length < 3)
        printHelp(['help', 'v']);
    else {
        var camera = null;
        if (args[1] === 'b')
            camera = buildingWorld.camera;
        else if (args[1] === 's')
            camera = cityWorld.camera;
        else {
            printHelp(['help', 'v']);
            return;
        }

        if (args[2] === 'in') {
            camera.zoom += 0.25;
            camera.updateProjectionMatrix();
        }
        else if (args[2] === 'out') {
            camera.zoom -= 0.25;
            camera.updateProjectionMatrix();
        }
        else if (args[2] === 'top') {
            topView(camera);
        }
        else if (args[2] === 'iso') {
            isoView(camera);
        }
        else 
            printUnknownOption('v', args[2]);
    }
}

function printHelp(args) {
    if (args.length < 2 || args[1] === 'help') {
        print('Available Commands:')
        print('  help - Show this help');
        print('  help [command] - Get help on a specific command');
        print('  nav - Navigate Sectors');
        print('  sys - Manage CityOS System');
        print('  m - Control Mechanical Systems');
        print('  e - Control Electrical Systems');
        print('  p - Control Plumbing Systems');
        print('  t - Control Transit Systems');
        print('  v - Control 3D Views');
    }
    else if (args[1] == 'nav') {
        print('nav - options:');
        print('  list - List available sectors');
        print('  s [sector name] - Navigate to a different sector');
        print('  info [sector name] - Print sector info (name optional)');
        print('  b - List buildings in the current sector');
        print('  b [building id] - Select a building in the current sector');
    }
    else if (args[1] == 'sys') {
        print('sys - options:');
        print('  users - List system users');
        print('  whoami - List current user');
        print('  clear - Clear the console');
    }
    else if (args[1] == 'm') {
        print('m - options:');
    }
    else if (args[1] == 'e') {
        print('e - options:');
    }
    else if (args[1] == 'p') {
        print('p - options:');
    }
    else if (args[1] == 'v') {
        print('v - options:');
        print('  s [modifier] - Do modifier on sector view');
        print('  b [modifier] - Do modifier on building view');
        print(' modifiers:');
        print('  in - Zoom in');
        print('  out - Zoom out');
        print('  top - Top view');
        print('  iso - 3D view');
    }
    else {
        print('No help entry for "' + args[1] + '"');
    }
}

function printUnknownCmd(cmd) {
    print('"' + cmd + '" is not a recognized command.');
}

function printUnknownOption(cmd, option) {
    print('Unknown option "' + option + '" for command ' + cmd);
}

function print(line) {
    var li = document.createElement('pre');
    var txt = document.createTextNode(line);
    li.appendChild(txt);
    stdout.appendChild(li);
}
