function loadMap() {

    //markers = jQuery.grep(markers,function(item, i){return(item.Country == 'Italy' && i > 1);});

    var iconType = {};
        iconType['0'] = '/img/marker1.png';
        iconType['1'] = '/img/marker2.png';
        iconType['2'] = '/img/marker3.png';

    var legName = {};
        legName['0'] = 'Coffee Shops';
        legName['1'] = 'CBD stores';
        legName['2'] = 'Other';

    var map = L.map('map', {
        center:[46.5, 9],
        zoom: 5,
        layers: catCluster
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'}).addTo(map);

    var LeafIcon = L.Icon.extend({
        options: {
            iconSize:[20, 25]
        }
    });

    var catCluster = L.markerClusterGroup({

        spiderfyOnMaxZoom: true,
        showCoverageOnHover: false,
        zoomToBoundsOnClick: true,
        removeOutsideVisibleBounds:true,
        maxClusterRadius: 30,
        spiderLegPolylineOptions: {
            weight: 1.5,
            color: '#222',
            opacity: 0.5
        }
    });

    var c =0;
    var catButtons = document.getElementById('legenda').getElementsByTagName('input');
    var titleDiv = document.getElementById('title');
    var infoDiv = document.getElementById('markerInfo');
    var catMarkers = [];
    
    for(i = 0; i < markers.length; i++){

        if (catMarkers.indexOf(markers[i].Icon) === -1){
            
            catMarkers.push(markers[i].Icon);
            catMarkers = jQuery.grep(markers,function(item, b){return(item.Icon == c && b > 1);});

            c++
        }

        for (m in catMarkers){
            
            var country     = catMarkers[m].Country;
            var name        = catMarkers[m].Name;
            var address     = catMarkers[m].Address;
            var zcode       = catMarkers[m].Zip_Code;
            var city        = catMarkers[m].City;
            var phone       = catMarkers[m].Phone;
            var email       = catMarkers[m].Email;
            var web         = catMarkers[m].Website;
            var contact     = catMarkers[m].Contact;
            var lat         = catMarkers[m].Lat;
            var lng         = catMarkers[m].Lng;
            var dif         = catMarkers[m].Icon;

            var title       = name+" - "+city;
            var marker      = L.marker([lat, lng], {icon:  new LeafIcon({iconUrl:[iconType[dif]]})});
            var code        = "<center><br>"+ address;

            marker.code = code;
            marker.latLng = marker.getLatLng();
            marker.title = title.replace("'","&#39;");
            marker.on('click', sideDiv);

            catCluster.addLayer(marker);
            
        }
        catCluster.addTo(map);
    }

    geojson = L.geoJson(ITcurrentRegions).addTo(map);
    geojson = L.geoJson(EUcurrentCountries).addTo(map);
    
    function sideDiv(e){

        var text= this.code;
        var title = this.title;
        var latLng = this.latLng;
        titleDiv.innerHTML = "<h3><u>"+title+"</u></h3>";

        titleDiv.onmouseover = function(){titleDiv.style.color = '#428608';};
        titleDiv.onmouseout = function(){titleDiv.style.color = 'Black';};
        titleDiv.onclick = function(e){map.setView(latLng, '17', {animation: true});};

        infoDiv.innerHTML = text;
        infoDiv.innerHTML += "<p><button onclick='responsiveVoice.speak(`"+title+"`);'>Read Me</button>";
    }

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

                infoDiv.innerHTML += "<li id="+m+" class='list-group-item link-class'><a href='#'>"+markers[m].Name+"</a> | <span class='text-muted'>"+markers[m].Address+"</span></li>";

                document.getElementById(m).onclick = function(e){map.setView(markers[m].getLatLng(), '17', {animation: true});};
            }
        }
        titleDiv.innerHTML += "Found: "+results.length+" results for "+term;
        
    }
}