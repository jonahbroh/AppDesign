var http = require( "http" );
var fs = require("fs");

function serverFn( req, res )
{
    var datetime = new Date();
    var time = datetime.getTime();
    if( req.url.substring( 0, 16 ) == "/submit_the_form" )
    {
        var add = req.url.substring(17);
        var input = add.split("&");
        var inputcontents = [];
        var inputtype = [];
        var finalinput;
        for(i = 0; i < input.length; i++)
        {
            var arr = input[i].split("=");
            inputtype.push(arr[0]);
            inputcontents.push(arr[1]);
        }
        for(i = 0; i < inputcontents.length; i++)
        {
            console.log(inputtype[i] + " - " + inputcontents[i]);
            finalinput = finalinput + inputtype[i] + " - " + inputcontents[i] + "\n";
        }
        var log = fs.writeFile("log"+time+".txt", finalinput, function (){console.log("Input written to log"+time+".txt");});
    }

    res.writeHead( 200 );
    var h = "<!DOCTYPE html>"+
        "<html>"+
        "<body>"+
        "<form action='submit_the_form' method='get'>"+
        "<input name='textbox' type='text' value='write something'>"+
        "<input name='range' type='range'>"+
        "<input name='pass' type='password'>"+
        "<input type='submit'>"+
        "</form>"+
        "</body>"+
        "</html>";
    res.end( h );
}

var server = http.createServer( serverFn );

server.listen( 8080 );
