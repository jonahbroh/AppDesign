var fs = require( "fs" );
var http = require( "http" );
var sqlite = require( "sqlite3" );

function listPerformers( req, res )
{
    var db = new sqlite.Database( "telluride.sqlite" );
    var performers = [];
    var stages = [];
    var times = [];
    var resp_text = "<!DOCTYPE html>"+
    "<html>" +
    "<head>"+
    "<title>Telluride Manager!</title>"+
    "</head>"+
  	"<body>";
    db.each( "SELECT NAME FROM PERFORMERS", function( err, row ) {
        performers.push(row.NAME);
    });
    db.each( "SELECT NAME FROM STAGES", function( err, row ) {
        stages.push(row.NAME);
    });
    db.each( "SELECT TIME FROM PERFORMANCE", function( err, row ) {
        times.push(row.TIME);
    });
    db.close(
	   function() {
         resp_text += "<table border = '1'>" + "<tbody>" + "<tr>" +
                      "<th>Performer</th>"+
                      "<th>Stage</th>"+
                      "<th>Time</th>"+
                      "</tr>";
         for(var i = 0; i < performers.length; i++)
         {
           resp_text += "<tr>" +
                        "<td>"+performers[i]+"</td>"+
                        "<td>"+stages[i]+"</td>"+
                        "<td>"+times[i]+"</td>"+
                        "</tr>";

         }
	       resp_text += "</tbody>" + "</table>" + "</body>" + "</html>";
	       res.writeHead( 200 );
	       res.end( resp_text );
	   } );
}

function serveFile( filename, req, res )
{
    try
    {
    	var contents = fs.readFileSync( filename ).toString();
    }
    catch( e )
    {
    	console.log(
    	    "Error: Something bad happened trying to open "+filename );
    	process.exit( 1 );
    	/* Return a 404 page */
    }

    res.writeHead( 200 );
    res.end( contents );
}

function serverFn( req, res )
{
    var filename = req.url.substring( 1, req.url.length );
    if( filename == "" )
    {
        filename = "./index.html";
    }
    if( filename == "list_performers" )
    {
        listPerformers( req, res );
    }
    else
    {
        serveFile( filename, req, res );
    }
}

var server = http.createServer( serverFn );

server.listen( 8080 );
