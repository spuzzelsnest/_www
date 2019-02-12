function loadMap() {
    
    var iconType = {};
        iconType['0'] = '/img/marker1.png';
        iconType['1'] = '/img/marker2.png';

    var legName = {};
        legName['0'] = 'unverified';
        legName['1'] = 'Verified';
    var titleDiv = document.getElementById('title');
    var infoDiv = document.getElementById('markerInfo');
    var cat = [];
    var map = L.map('map', {
        center:[46.5, 9],
        zoom: 5,
        layers: catMarkers
    });
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'}).addTo(map);
    
    var LeafIcon = L.Icon.extend({
        options: {
                iconSize:[20, 25]
        }
    });
    
    var catMarkers = L.markerClusterGroup({

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
    
    for(i = 0; i < markers.length; i++){
        if (cat.indexOf(markers[i].Verified) === -1){
            cat.push(markers[i].Verified);
        }
    }
  
    for(i = 0; i< cat.length; i++){
        
        catData = jQuery.grep(markers,function(item, c){return(item.Verified == cat[i] && c > 1);});
        console.log(catData.length);
        
        distCount = catData.length;
        
        document.getElementById('legenda').innerHTML += "<img src="+iconType[cat[i]]+" height='20px' width='25px'> <input type='checkbox' class='leaflet-control-layers-selector' name='typeId' value="+cat[i]+" checked/> "+distCount+" "+legName[cat[i]]+" · ";

        for (m in catData){
            
            var id = i+"-"+m;
            var country = catData[m].Country;
            var name = catData[m].Name;
            var address = catData[m].Address;
            var zcode = catData[m].Zip_Code;
            var city = catData[m].City;
            var phone = catData[m].Phone;
            var email = catData[m].Email;
            var web = catData[m].Website;
            var contact = catData[m].Contact;
            var lat = catData[m].Lat;
            var lng = catData[m].Lng;
            var dif = catData[m].Verified;
        
            var title = name+" - "+city;
            var marker = L.marker([lat, lng], {icon:  new LeafIcon({iconUrl:[iconType[dif]]})});
            var code = "<center><br>"+ address;
            
            marker.id = id;
            marker.code = code;
            marker.latLng = marker.getLatLng();
            marker.title = title.replace("'","&#39;");
            marker.on('click', sideDiv);
            
            catMarkers.addLayer(marker);
        }
    }
    
    map.addLayer(catMarkers);
    geojson = L.geoJson(ITcurrentRegions).addTo(map);
    geojson = L.geoJson(EUcurrentCountries).addTo(map);

    function sideDiv(e){

        var text= this.code;
        var title = this.title;
        var latLng = this.latLng;
        titleDiv.innerHTML = "<h3><u>"+title+"</u></h3>";

        titleDiv.onmouseover = function(){titleDiv.style.color = '#428608';};
        titleDiv.onmouseout = function(){titleDiv.style.color = 'Black';};
        titleDiv.onclick = function(e){map.setView(latLng, '13', {animation: true});};

        infoDiv.innerHTML = text;
        infoDiv.innerHTML += "<p><button onclick='read(`"+title+"`);'>Read Me</button>";
    }
    
}

function read(title){
    responsiveVoice.speak(title);
}

function search(){
    
    var titleDiv = document.getElementById('title');
    var infoDiv = document.getElementById('markerInfo');
    var results =[];
    var term = document.getElementsByClassName('searchField')[0].value;
    var regex = new RegExp( term, 'ig');
    
    titleDiv.onclick = function() {return false;};
    titleDiv.onmouseover = function(){return false;};
    titleDiv.onmouseout = function(){return false;};
    
    if (term == ''){
        titleDiv.innerHTML = "<h2><u>Search</u>";
        infoDiv.innerHTML = "</h2><br>What are you looking for?";
    }else{
        titleDiv.innerHTML = "<h1><u>Search</u></h1>";
        infoDiv.innerHTML = "";
        for (m in markers) {
            name = JSON.stringify(markers[m].Name);
            if (name.match(regex)){
                results.push(name);

                infoDiv.innerHTML += "<li id="+m+" class='list-group-item link-class'><a href='#' onclick='fucntion(){map.setView(latLng("+markers[m].Lat+","+markers[m].Lng+"), 13, {animation: true});};'>"+markers[m].Name+"</a> | <span class='text-muted'>"+markers[m].Address+"</span></li>";

                document.getElementById(m).onClick = function(e){map.setView(markers[m].getLatLng(), '13', {animation: true});}
            }
        }
        titleDiv.innerHTML += "Found: "+results.length+" results for "+term;
    }
}
