var fs = require( "fs" );
var http = require( "http" );
var sqlite = require( "sqlite3" );
var table = [];

function makeTable(num)
{
      table = [];
      var db = new sqlite.Database("school.sqlite");
      //Populates table depending on which button was clicked.
      if(num === 1){
          table.splice(0,0,"<tr><th>Name</th><th>Year</th></tr>");
          db.each("SELECT * FROM Students", function(err,row){
                      table.splice(0,0,"<tr><td>"+row.Name+"</td><td>"+row.Year+"</td></tr>");
                  });
      }
      else if(num === 2){
          table.splice(0,0,"<tr><th>Name</th><th>Office</th></tr>");
          db.each("SELECT * FROM Teachers", function(err,row){
                      table.splice(0,0,"<tr><td>"+row.Name+"</td><td>"+row.Office+"</td></tr>");
                  });
      }
      else if(num === 3){
          table.splice(0,0,"<tr><th>Name</th><th>Department</th></tr>");
          db.each("SELECT * FROM Classes", function(err,row){
                      table.splice(0,0,"<tr><td>"+row.Name+"</td><td>"+row.Department+"</td></tr>");
                  });
      }
      else if(num === 4){
          table.splice(0,0,"<tr><th>Student</th><th>Class</th></tr>");
          db.each("SELECT Students.Name AS Sname, Classes.Name AS Cname, * FROM Enrollments "+
                  "JOIN Students ON Enrollments.StudentId = Students.Id "+
                  "JOIN Classes ON Enrollments.ClassId = Classes.Id", function(err,row){
                      table.splice(0,0,"<tr><td>"+row.Sname+"</td><td>"+row.Cname+"</td></tr>");
                  });
      }
      else if(num === 5){
          table.splice(0,0,"<tr><th>Teacher</th><th>Class</th></tr>");
          db.each("SELECT Teachers.Name AS Tname, Classes.Name AS Cname, * FROM TeachingAssignments "+
                  "JOIN Teachers ON TeachingAssignments.TeacherId = Teachers.Id "+
                  "JOIN Classes ON TeachingAssignments.ClassId = Classes.Id", function(err,row){
                      table.splice(0,0,"<tr><td>"+row.Tname+"</td><td>"+row.Cname+"</td></tr>");
                  });
      }
}

function addStudent( req, res, info )
{
      var splits = info.split("&");
      var inform = [];
      for(var i = 0; i < splits.length; i++){
          inform.push(splits[i].split("=")[1]);
      }
      var numtest = /^\d+$/;
      if(numtest.test(inform[1])){
          var db = new sqlite.Database("school.sqlite");
          var sql_cmd = "INSERT INTO STUDENTS ('NAME', 'YEAR') VALUES ('"+
              inform[0]+"', '"+inform[1]+"')";
          db.run( sql_cmd );
          db.close(function(){
            //Runs after close so that the dropdown list updates.
              serveFile( req, res );
          });
      }

      else{
          console.log(inform[1]);
          console.log("A year, please.");
          serveFile( req, res );
      }
}
function enrollStudent( req, res, info )
{
      var splits = info.split("&");
      var inform = [];
      for(var i = 0; i < splits.length; i++){
          inform.push(splits[i].split("=")[1]);
      }
      var db = new sqlite.Database("school.sqlite");
      var sql_cmd = "INSERT INTO ENROLLMENTS ('StudentId', 'ClassId') VALUES ('"+
          inform[0]+"', '"+inform[1]+"')";
      db.run( sql_cmd );
      db.close(function(){
          serveFile( req, res );
      });
}

function serveFile( req, res )
{
    try
    {
    	var contents = fs.readFileSync( "./index.html" ).toString().split("\n");
    }
    catch( e )
    {
    	console.log(
    	    "Error: Something bad happened trying to open "+filename );
        res.writeHead( 404 );
        res.end( "" );
        return;
    }
    var db = new sqlite.Database("school.sqlite");
    //Provides dropdown list options
    var studoptions = [];
    db.each( "SELECT * FROM STUDENTS", function( err, row ) {
        studoptions.splice(0,0,'<option value = "'+row.Id+'">'+row.Name+'</option>');
      });
    var classoptions = [];
    db.each( "SELECT * FROM CLASSES", function( err, row ) {
        classoptions.splice(0,0,'<option value = "'+row.Id+'">'+row.Name+'</option>');
      });
    db.close(function(){
          //Adds options to the dropdown list.
          for(var j = 0; j < contents.length; j++){
              if(contents[j] == '<select id="studentnames" name="studid">'){
                  var soloc = j+1;
                  for(var i = 0; i < studoptions.length; i++){
                      contents.splice(soloc, 0, studoptions[i]);
                  }
              }
          }
          for(var j = 0; j < contents.length; j++){
              if(contents[j] == '<select id="classnames" name="classid">'){
                  var coloc = j+1;
                  for(var i = 0; i < classoptions.length; i++){
                      contents.splice(coloc, 0, classoptions[i]);
                  }
              }
          }
          //Adds table if one has been requested.
          for(var j = 0; j < contents.length; j++){
              if(contents[j] == '<!-- TABLE GOES HERE -->'){
                  var tabloc = j+1;
                  for(var i = 0; i < table.length; i++){
                       contents.splice(tabloc, 0, table[i]);
                  }
              }
          }
          var endhtml = "";
          for(var i = 0; i < contents.length; i++){
              endhtml += contents[i]+"\n";
          }
          res.writeHead( 200 );
          // console.log(endhtml);
          res.end( endhtml );
    });
}

function serverFn( req, res )
{
    var filename = req.url.substring( 1, req.url.length );
    if( filename.substring( 0, 13 ) == "list_students" )
    {
        makeTable(1);
        serveFile( req, res );
    }
    else if( filename.substring( 0, 13 ) == "list_teachers" )
    {
        makeTable(2);
        serveFile( req, res );
    }
    else if( filename.substring( 0, 12 ) == "list_classes" )
    {
        makeTable(3);
        serveFile( req, res );
    }
    else if( filename.substring( 0, 16 ) == "list_enrollments" )
    {
        makeTable(4);
        serveFile( req, res );
    }
    else if( filename.substring( 0, 16 ) == "list_assignments" )
    {
        makeTable(5);
        serveFile( req, res );
    }
    else if( filename.substring( 0, 11 ) == "add_student" )
    {
        addStudent(req, res, filename.split("?")[1]);
    }
    else if( filename.substring( 0, 14 ) == "enroll_student" )
    {
        enrollStudent(req, res, filename.split("?")[1]);
    }
    else
    {
        serveFile( req, res );
    }
}

var server = http.createServer( serverFn );

server.listen( 12121 );