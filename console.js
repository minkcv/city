var cityWorld = createWorld('three-city');
var buildingWorld = createWorld('three-building');
var stdout = document.getElementById('stdout');
var stdin = document.getElementById('stdin');
var consolepane = document.getElementById('console');
stdin.focus();
changeSector(getSector('alpha'));

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
    print('CityOS 1.0 minkcv');
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
    else if (tokens[0] === 't')
        transitCmd(tokens);
    else if (tokens[0] === 'm')
        mechanicalCmd(tokens);
    else if (tokens[0] === 'e')
        electricalCmd(tokens);
    else if (tokens[0] === 'p')
        plumbingCmd(tokens);
    else
        printUnknownCmd(tokens[0]);

    stdout.scrollTop = stdout.scrollHeight;
}

function navCmd(args) {
    if (args.length < 2)
        printHelp(['help', 'nav']);
    else if (args[1] === 's') {
        if (args.length < 3) {
            print('Sectors:');
            for (var i = 0; i < sectors.length; i++) {
                var name = sectors[i].name
                if (currentsector && name === currentsector.name)
                    print(' *' + name);
                else
                    print('  ' + name);
            }
        }
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
            for (var i = 0; i < currentsector.bldg.length; i += 2) {
                var msg = ' ';
                for (var j = i; j < i + 2; j++) {
                    if (j < 10)
                        msg += ' ';
                    if (j < 100)
                        msg += ' ';
                    if (j < currentsector.bldg.length)
                        msg += j + ': ' + currentsector.bldg[j].name;
                    for (var w = msg.length; w < 40; w++)
                        msg += ' ';
                }
                print(msg);
            }
        }
        else {
            var i = parseInt(args[2]);
            if (isNaN(i) || i >= currentsector.bldg.length)
                print('"' + args[2] + '" is not a known building in sector "' + currentsector.name + '"');
            else if (currentsector.bldg[i] == null)
                print('"' + args[2] + '" is a vacant lot');
            else {
                var newBuilding = currentsector.bldg[i].clone();
                newBuilding.cityRef = currentsector.bldg[i];
                newBuilding.elec = currentsector.bldg[i].elec;
                newBuilding.mech = currentsector.bldg[i].mech;
                newBuilding.plmb = currentsector.bldg[i].plmb;
                changeBuilding(newBuilding);
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
        if (args[1] === 'b') {
            if (currentbuilding == null) {
                print('No building selected');
                return;
            }
            camera = buildingWorld.camera;
        }
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
            isoView(camera, args[1] === 'b');
        }
        else 
            printUnknownOption('v', args[2]);
    }
}

function transitCmd(args) {
    if (args.length < 2)
        printHelp(['help', 't']);
    else if (currentsector == null)
        print('No sector selected');
    else {
        if (args[1] === 'list') {
            if (args.length < 3) {
                print('Streets in sector "' + currentsector.name + '"');
                for (var i = 0; i < currentsector.tran.length; i += 2)
                {
                    var msg = ' ';
                    for (var j = i; j < i + 2; j++) {
                        if (j < 10)
                            msg += ' ';
                        if (j < 100)
                            msg += ' ';
                        if (j < currentsector.tran.length) {
                            msg += j + ': ' + currentsector.tran[j].name;
                            if (currentsector.tran[j].material == greenmaterial)
                                msg += ' - on';
                            else if (currentsector.tran[j].material == redmaterial)
                                msg += ' - off';
                        }
                        for (var w = msg.length; w < 40; w++)
                            msg += ' ';
                    }
                    print(msg);
                }
            }
            else {
            }
        }
        else {
            if (args.length < 3 || (args[1] !== 'on' && args[1] !== 'off'))
                printHelp(['help', 't']);
            else {
                var i = parseInt(args[2]);
                var street = null;
                if (isNaN(i) || i >= currentsector.tran.length) {
                    print('"' + args[2] + '" is not a known street in sector "' + currentsector.name + '"');
                    return;
                }
                else
                    street = currentsector.tran[i];

                if (args[1] === 'on')
                {
                    street.material = greenmaterial;
                    print('Turned on traffic signals at ' + street.name);
                }
                else if (args[1] === 'off')
                {
                    street.material = redmaterial;
                    print('Turned off traffic signals at ' + street.name);
                }
            }
        }
    }
}

function mechanicalCmd(args) {
    if (args.length < 2)
        printHelp(['help', 'm']);
    else if (currentbuilding == null)
        print('No selected building');
    else {
        if (args[1] === 'list') {
            for (var i = 0; i < currentbuilding.mech.length; i++) {
                print(i + ': ' + currentbuilding.mech[i][0] + ' - ' + currentbuilding.mech[i][1]);
            }
        }
        else if (args.length > 3 && (args[1] === 'on' || args[1] === 'off')) {
            var i = parseInt(args[2]);
            if (isNaN(i) || i >= currentbuilding.mech.length) {
                print('"' + args[2] + '" is not a mechanical system in sector "' + currentbuilding.name + '"');
                return;
            }
            else {
                currentbuilding.mech[i][1] = args[1];
                print(currentbuilding.mech[i][0] + ' is now ' + args[1]);
            }
        }
        else
        printHelp(['help', 'm']);
    }
}

function electricalCmd(args) {
    if (args.length < 2)
        printHelp(['help', 'e']);
    else if (currentbuilding == null)
        print('No selected building');
    else {
        if (args[1] === 'on' || args[1] === 'off') {
            if (args[1] === 'on')
                currentbuilding.elec.material = yellowmaterial;
            else
                currentbuilding.elec.material = redmaterial;
            print('Electricity for "' + currentbuilding.name + '" is now ' + args[1]);
        }
    }
}

function plumbingCmd(args) {
    if (args.length < 2)
        printHelp(['help', 'p']);
    else if (currentbuilding == null)
        print('No selected building');
    else {
        if (args[1] === 'on' || args[1] === 'off') {
            if (args[1] === 'on')
                currentbuilding.plmb.material = bluematerial;
            else
                currentbuilding.plmb.material = redmaterial;
            print('Plumging systems for "' + currentbuilding.name + '" are now ' + args[1]);
        }
    }
}

function printHelp(args) {
    if (args.length < 2 || args[1] === 'help') {
        print('Available Commands:')
        print('  help - Show this help');
        print('  help [command] - Get help on a specific command');
        print('  nav - Navigate Sectors and Buildings');
        print('  sys - Manage CityOS System');
        print('  m - Control Mechanical Systems');
        print('  e - Control Electrical Systems');
        print('  p - Control Plumbing Systems');
        print('  t - Control Transit Systems');
        print('  v - Control 3D Views');
    }
    else if (args[1] === 'nav') {
        print('nav - options:');
        print('  s - List available sectors');
        print('  s [sector name] - Navigate to a different sector');
        print('  info [sector name] - Print sector info (name optional)');
        print('  b - List buildings in the current sector');
        print('  b [building id] - Select a building in the current sector');
    }
    else if (args[1] === 'sys') {
        print('sys - options:');
        print('  users - List system users');
        print('  whoami - List current user');
        print('  clear - Clear the console');
    }
    else if (args[1] === 't') {
        print('t - options:');
        print('  list - List streets in current sector');
        print('  off [street id] - Turn traffic signals off for a street');
        print('  on [street id] - Turn traffic signals on for a street');
    }
    else if (args[1] === 'm') {
        print('m - options:');
        print('  list - List mechanical systems of current building');
        print('  on [system id] - Enable mechanical system of the current building');
        print('  off [system id] - Disable mechanical system of the current building');
    }
    else if (args[1] === 'e') {
        print('e - options:');
        print('  on - Enable electricity of the current building');
        print('  off - Disable electricity of the current building');
    }
    else if (args[1] === 'p') {
        print('p - options:');
        print('  on - Enable plumbing systems of the current building');
        print('  off - Disable plumbing systems of the current building');
    }
    else if (args[1] === 'v') {
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
