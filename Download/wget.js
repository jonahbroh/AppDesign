var http = require('http');
var fs = require('fs');

try{
  var lines = fs.readFileSync(process.argv[2]).toString().split("\n");
}
catch(e){
    console.log("Format correctly, please.");
    process.exit(1);
}

var download = function(url, dest, cb) {
  var file = fs.createWriteStream(dest);
  console.log(url +" will be saved to "+ dest+".");
  var request = http.get( url, function( response ) {
  response.pipe( file );
        file.on( 'finish', function() {
            // close() is async, call cb after close completes.
            file.close( cb );
        });
    });
    request.on( 'error', function( err ) { // Handle errors
        fs.unlink(dest, cb);
        console.log("Unfortunately, the file at "+url+" could not be saved to "+dest+".");
    });

};


if(lines.length%2 !== 0)
{
    console.log("Even number of lines, please.");
}
function callb() { }
for(var i = 0; i < lines.length; i = i + 2)
{
  //Makes sure the file destination is valid.
  var possible;
  try {
    var fd = fs.openSync(lines[i+1], 'w');
    fs.closeSync(fs.openSync(lines[i+1], 'w'));
    possible = true;
  }
  catch (e) {
    possible = false;
    console.log("A file cannot be saved to " +lines[i+1]+".");
  }
  if(possible){
    download(lines[i], lines[i+1], callb );
  }
}
