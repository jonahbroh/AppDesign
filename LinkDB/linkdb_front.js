var num = 0;

function fillTable(){
    var link_req = new XMLHttpRequest();
    link_req.onload = tableFiller;
    link_req.open( "get", "fill_table" );
    link_req.send();
}

function addLink(){
    var urlbox = document.getElementById("urlbox");
    var namebox = document.getElementById("namebox");
    var table = document.getElementById("thetable");
    var nrow = document.createElement("tr");
    var addressbox = document.createElement("td");
    var addresslink = document.createElement("a");
    var buttonbox = document.createElement("td");
    var removebutton = document.createElement("input");
    
    addresslink.id = "address"+num;
    removebutton.type = "button";
    removebutton.value = "remove";
    removebutton.row = num;
    removebutton.url = urlbox.value;
    removebutton.nickname = namebox.value;
    removebutton.onclick = removeLink;
    nrow.id = "row"+num;
    addressbox.appendChild(addresslink);
    buttonbox.appendChild(removebutton);
    nrow.appendChild(addressbox);
    nrow.appendChild(buttonbox);
    table.appendChild(nrow);
    
    var link_req = new XMLHttpRequest();
    var url = "add_link?url="+urlbox.value+"&name="+namebox.value+"&row="+num;
    link_req.onload = linkAdder;
    console.log(url);
    link_req.open( "get", url );
    link_req.send();
    num++;
}

function removeLink(){
    var link_req = new XMLHttpRequest();
    var url = "remove_link?"+this.remove;
    console.log(url);
    var row = document.getElementById("row"+this.row);
    row.parentNode.removeChild(row);
    link_req.open( "get", url );
    link_req.send();    
}

function tableFiller(){
    var links = JSON.parse( this.responseText);
    var table = document.getElementById("thetable");
    console.log(links.size);
    for(i = 0; i < links.size; i++){
      var nrow = document.createElement("tr");
      var addressbox = document.createElement("td");
      var addresslink = document.createElement("a");
      var buttonbox = document.createElement("td");
      var removebutton = document.createElement("input");
      
      addresslink.id = "address"+num;
      addresslink.href = links[i].address;
      addresslink.innerHTML = links[i].nickname;
      removebutton.type = "button";
      removebutton.value = "remove";
      removebutton.row = num;
      removebutton.onclick = removeLink;
      removebutton.remove = links[i].id;
      nrow.id = "row"+num;
      addressbox.appendChild(addresslink);
      buttonbox.appendChild(removebutton);
      nrow.appendChild(addressbox);
      nrow.appendChild(buttonbox);
      table.appendChild(nrow);  
      num++;
    }
    
}

function linkAdder(){
    var info = JSON.parse( this.responseText ).split("+");
    console.log(info);
    var link = info[0];
    var name = info[1];
    var row = info[2];
    var id = info[3];
    var linkbox = document.getElementById("address"+row);
    var rbutton = document.getElementById("button"+row);
    rbutton.remove = id;
    linkbox.href = link;
    linkbox.innerHTML = name;

}

function linkRemover(){
  
}