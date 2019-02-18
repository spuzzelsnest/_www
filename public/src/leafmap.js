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
            
            var country     = markers[i].Country;
            var name        = markers[i].Name;
            var address     = markers[i].Address;
            var zcode       = markers[i].Zip_Code;
            var city        = markers[i].City;
            var phone       = markers[i].Phone;
            var email       = markers[i].Email;
            var web         = markers[i].Website;
            var contact     = markers[i].Contact;
            var lat         = markers[i].Lat;
            var lng         = markers[i].Lng;
            var dif         = markers[i].Icon;

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
        titleDiv.innerHTML = "<h3><u>Search</u></h3>";
        infoDiv.innerHTML = "<br>What are you looking for?";
    }else{
        titleDiv.innerHTML = "<h3><u>Search</u></h3>";
        infoDiv.innerHTML = "";
        for (m in markers) {
            name = JSON.stringify(markers[m].Name);
            if (name.match(regex)){
                results.push(name);

                infoDiv.innerHTML += "<li id='"+m+"' class='list-group-item link-class'>"+markers[m].Name+" | <span class='text-muted'>"+markers[m].Address+"</span></li>";
            }
        }
        titleDiv.innerHTML += "Found: "+results.length+" results for "+term;
    }
}