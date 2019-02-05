function loadMap() {
    
	var map = L.map('map').setView([50.1, 6], 6);

	L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'}).addTo(map);
        var LeafIcon = L.Icon.extend({
                options: {
                    iconSize:[20, 25]
              }
        });

    var iconType = {};
        iconType['0'] = new LeafIcon({iconUrl: '/img/point01.png'});


	var cluster = L.markerClusterGroup({

        spiderfyOnMaxZoom: true,
		showCoverageOnHover: false,
		zoomToBoundsOnClick: true,
		removeOutsideVisibleBounds:true,
		maxClusterRadius: 20,
		spiderLegPolylineOptions: {
				weight: 1.5,
				color: '#222',
				opacity: 0.5
		}
	});

	for(var i in markers){

        var country = markers[i].Country;
		var name = markers[i].Name;
        var address = markers[i].Address;
        var zcode = markers[i].Zip_Code;
        var city = markers[i].City;
        var phone = markers[i].Phone;
		var email = markers[i].Email;
        var web = markers[i].Website;
        var contact = markers[i].Contact;
        var lat = markers[i].Lat;
        var lng = markers[i].Lng;
		var dif = markers[i].Verified;
        
        var title = name+" - "+city;
        var code = "<big><u>"+title+" ("+country+")</u></big><p><center><br>"+ address;
		var marker = L.marker([lat, lng], {icon: iconType[dif]});
        marker.code = code;
        marker.title = title.replace("'","&#39;");
        marker.on('click', sideDiv);
		cluster.addLayer(marker);
	}
	map.addLayer(cluster);
}

function sideDiv(e){

	var text= this.code;
    var title = this.title;
    document.getElementById('title').innerHTML = "<h1><u>MarkerInfo</u></h1>";
    document.getElementById('markerInfo').innerHTML = text;
    document.getElementById('markerInfo').innerHTML += "<p><button onclick='read(`"+title+"`);'>Read Me</button>";
}

function read(title){
    var text = title;
    responsiveVoice.speak(text);
}

function search(){
    
    var term = document.getElementsByClassName("searchField")[0].value;
    var result = [];
    if (term == ''){
        document.getElementById('title').innerHTML = "<h1><u>Search</u></h1><br>What are you looking for?";
    }else{
        document.getElementById('title').innerHTML = "<h1><u>Search</u></h1><br><br> RESULT For: "+term;
        document.getElementById('markerInfo').innerHTML = "<u>Search Result</u>";
    }
}
