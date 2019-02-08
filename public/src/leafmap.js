function loadMap() {
    
    var iconType = {};
        iconType['0'] = '/img/marker1.png';
        iconType['1'] = '/img/marker2.png';

    var legName = {};
        legName['0'] = 'unverified';
        legName['1'] = 'Verified';
    
    var cat = [];
    var catData =[];
    var data =[];
    
    for(i = 0; i < markers.length; i++){
        if (cat.indexOf(markers[i].Verified) === -1){
            
            cat.push(markers[i].Verified);
            console.log(cat.length);
        }
    }
    
    for(i = 0; i< cat.length; i++){
        
        catData = jQuery.grep(markers,function(item, c){return(item.Verified == cat[i] && c > 1);});
        distCount = catData.length;
        
        document.getElementById('legenda').innerHTML += "<img src="+iconType[cat[i]]+" height='20px' width='25px'> <input type='checkbox' class='leaflet-control-layers-selector' name='typeId' value="+cat[i]+" checked/> "+distCount+" "+legName[cat[i]]+" · ";

        data = catData.concat(data);
    }

    loadingMap(data, iconType);
}

function loadingMap(data, iconType){
    console.log(data.length);
    
    var map = L.map('map').setView([46.5, 9], 5);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'}).addTo(map);
    
    var LeafIcon = L.Icon.extend({
        options: {
                iconSize:[20, 25]
              }
        });

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
    
	for(var i in data){

        var country = data[i].Country;
		var name = data[i].Name;
        var address = data[i].Address;
        var zcode = data[i].Zip_Code;
        var city = data[i].City;
        var phone = data[i].Phone;
		var email = data[i].Email;
        var web = data[i].Website;
        var contact = data[i].Contact;
        var lat = data[i].Lat;
        var lng = data[i].Lng;
		var dif = data[i].Verified;
        
        var title = name+" - "+city;
        var code = "<big><u>"+title+" ("+country+")</u></big><p><center><br>"+ address;
		var marker = L.marker([lat, lng], {icon:  new LeafIcon({iconUrl:[iconType[dif]]})});
        marker.code = code;
        marker.title = title.replace("'","&#39;");
        marker.on('click', sideDiv);
		cluster.addLayer(marker);
	}

    map.addLayer(cluster);
    
    geojson = L.geoJson(ITcurrentRegions).addTo(map);
    geojson = L.geoJson(EUcurrentCountries).addTo(map);
    
    geojson.eachLayer(function (layer) {
        layer.bindPopup(layer.feature.properties.name);
    });    
}

function sideDiv(e){
    
	var text= this.code;
    var title = this.title;
    document.getElementById('title').innerHTML = "<h1><u>MarkerInfo</u></h1>";
    document.getElementById('markerInfo').innerHTML = text;
    document.getElementById('markerInfo').innerHTML += "<p><button onclick='read(`"+title+"`);'>Read Me</button>";
}

function read(title){
    responsiveVoice.speak(title);
}

function search(){
    var results =[];
    var term = document.getElementsByClassName('searchField')[0].value;
    var regex = new RegExp( term, 'ig');
    
    if (term == ''){
            document.getElementById('title').innerHTML = "<h2><u>Search</u></h2><br>What are you looking for?";
    }else{
        document.getElementById('title').innerHTML = "<h1><u>Search</u></h1>";
        document.getElementById('markerInfo').innerHTML = "";
    for (m in markers) {
        name = JSON.stringify(markers[m].Name);
        if (name.match(regex)){
            results.push(name);
          document.getElementById('markerInfo').innerHTML += "<li class='list-group-item link-class'>"+markers[m].Name+" | <span class='text-muted'>"+markers[m].Address+"</span></li>";
   
    }
        
   }
        document.getElementById('title').innerHTML += "Found: "+results.length+" results for "+term;
}
}