var http = require('http');
var fs = require('fs');

try{
  var lines = fs.readFileSync(process.argv[2]).toString().split("\n");
}
catch(e){
    console.log("Nope.");
    process.exit(1);
}

var download = function(url, dest, cb) {
  var file = fs.createWriteStream(dest);
  var request = http.get(url, function(response) {
    response.pipe(file);
    file.on('finish', function() {
      file.close(cb);  // close() is async, call cb after close completes.
    });
  }).on('error', function(err) { // Handle errors
    fs.unlink(dest); // Delete the file async. (But we don't check the result)
    if (cb) cb(err.message);
  });
};

/*function readFile( f )
{
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function ()
    {
        if(xmlhttp.readyState == 4){
            prepare( xmlhttp.responseText );
        }
    }
    xmlhttp.open( "GET", f, true );
    xmlhttp.send();
    console.log( "Sent" );
}*/

function prepare( )
{
    //var lines = param.split("\n");
    /*if(lines.length%2 != 0)
    {
        console.log("Even number of lines, please");
    }*/
    for(var i = 0; i < lines.length; i = i + 2)
    {
        download(lines[i], lines[i+1], function() { console.log( "main cb" ) } );
    }
}

prepare();
