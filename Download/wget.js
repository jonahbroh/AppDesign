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
  var file;
  try{
      file = fs.createWriteStream(dest);
      console.log(url +" - "+ dest);
  }
  catch(e){
      console.log("Actual location, please.");
      fs.unlink(dest);
      return;
  }
  var request;
  try{
     request = http.get( url, function( response ) {
        console.log( "get callback!" );
        response.pipe( file );
        file.on( 'finish', function() {
            console.log( "finish callback!" );
            // close() is async, call cb after close completes.
            file.close( cb );
        });
    });
    request.on( 'error', function( err ) { // Handle errors
        console.log( "error callback!" );
        // Delete the file async. (But we don't check the result)
        fs.unlink(dest);
        if( cb )
            cb( err.message );
    });
    }
  catch(e){
    console.log("File, please.");
    return;
  }
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
    function callb() { console.log( "main cb" ) };
    for(var i = 0; i < lines.length; i = i + 2)
    {
        download(lines[i], lines[i+1], callb );
    }
}

prepare();
console.log("done");
