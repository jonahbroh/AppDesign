var fs = require( "fs" );
var http = require( "http" );
var sqlite = require( "sqlite3" );

function populateTable( res)
{
    var db = new sqlite.Database("linkdb.sqlite");
    var links = {};
    var i = 0;
    db.all('SELECT * FROM Links', function(err,rows){
    rows.forEach(function(row) {
        links[i] = {};
        links[i].address = row.Address;
        links[i].nickname = row.Nickname;
        links[i].id = row.Id;
        i++;
    });
    links.size = i;
    db.close(function(){
      //Runs after close so that the dropdown list updates.
        res.writeHead( 200 );
        console.log(JSON.parse(JSON.stringify(links)));
        res.end( JSON.stringify(links) );
    });
  });
}

function addLink( filename, res)
{
    var db = new sqlite.Database("linkdb.sqlite");
    var split1 = filename.split("?")[1].split("&");
    var url = split1[0].split("=")[1];
    var name = split1[1].split("=")[1];
    var row = split1[2].split("=")[1];
    var id = 0;
    var sql_cmd = "INSERT INTO Links ('Address', 'Nickname') VALUES ('"+
        url+"', '"+name+"')";
    db.run( sql_cmd );
    db.each("SELECT * FROM Links", function(err, row){id = row.Id;});
    db.close(function(){
      //Runs after close so that the dropdown list updates.
        res.writeHead( 200 );
        res.end( JSON.stringify(url + "+" + name + "+" + row + "+" + id ) );
    });
}

function removeLink( filename, res)
{
    var db = new sqlite.Database("linkdb.sqlite");
    var rid = filename.split("?")[1];
    var sql_cmd = "DELETE FROM Links WHERE Id = "+rid;
    db.run(sql_cmd);
    db.close(function(){
        res.writeHead( 200 );
        res.end("");
    });
    
}

function serveFile( filename, req, res )
{
    var contents = "";
    try {
    	contents = fs.readFileSync( filename ).toString();
    }
    catch( e ) {
    	console.log(
    	    "Error: Something bad happened trying to open "+filename );
        res.writeHead( 404 );
        res.end( "" );
        return;
    }

    res.writeHead( 200 );
    res.end( contents );
}

function serverFn( req, res )
{
    var filename = req.url.substring( 1, req.url.length );
    if( filename.substring( 0, 8 ) == "add_link" )
    {
        addLink(filename, res);
    }
    else if( filename.substring( 0, 11 ) == "remove_link" )
    {
        removeLink(filename, res);
    }
    else if( filename == "fill_table" )
    {
        populateTable(res);
    }
    else if( filename == "linkdb_front.js" )
    {
        serveFile( "linkdb_front.js", req, res );
    }
    else
    {
        serveFile( "index.html", req, res );
    }
}

var server = http.createServer( serverFn );

if( process.argv.length < 3 )
{
    var port = 8080;
}
else
{
    var port = parseInt( process.argv[2] );
}

server.listen( port );