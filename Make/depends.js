var fs = require( "fs" );

if(process.argv.length == 4){
    var args = process.argv;
}
else{
    console.log("Input a file and a starting location, please.");
    process.exit(1);
}

try{
    var lines = fs.readFileSync( args[2] ).toString().split( "\n" );
}
catch(e){
    console.log("The file could not be read.");
    process.exit(1);
}

var targets = {};

for( var i = 0; i < lines.length; i++ )
{
    var target = {};
    var line = lines[ i ];
    var colon = line.split( ":" );
    var match = line.match(/.+(?=:)/);
    if(match === null){
        return;
    }
    if( colon.length != 2 )
    {
        continue;
    }
    target.name = colon[ 0 ];
    target.depend_names = colon[ 1 ].split( " " );
    target.visited = false;
    targets[ target.name ] = target;
}

function trace_dependencies( prev, target )
{
    if( target.visited )
    {
        return;
    }

    target.visited = true;
    if(prev != "[ Start ]"){
        console.log( "> " + prev + " depends on " + target.name );
    }
    for( var i = 0; i < target.depend_names.length; i++ )
    {
        var dep_name = target.depend_names[ i ];
        if( !( dep_name in targets ) )
            continue;
        var dep = targets[ dep_name ];
        trace_dependencies( target.name, dep );
    }
}

var check = new RegExp(args[3]);
if(check.test(lines)){
    trace_dependencies( "[ Start ]", targets[ args[3] ] );
}
else{
    console.log("A starting location within the file, please.");
}
