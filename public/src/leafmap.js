function loadMap() {

   // markers = jQuery.grep(markers,function(item, i){return(item.Verified == "1" && i > 1);});

    var iconType = {};
    iconType['1'] = '/img/marker1.png';
    iconType['2'] = '/img/marker2.png';
    iconType['3'] = '/img/marker3.png';

    var legName = {};
    legName['1'] = 'Coffee Shops';
    legName['2'] = 'CBD stores';
    legName['3'] = 'Other';

    var catButtons = document.getElementById('legenda').getElementsByTagName('input');
    var titleDiv = document.getElementById('title');
    var infoDiv = document.getElementById('markerInfo');
    var cat = [];
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

    geojson = L.geoJson(ITcurrentRegions).addTo(map);
    geojson = L.geoJson(EUcurrentCountries).addTo(map);

    var catCluster = L.markerClusterGroup({

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
        if (cat.indexOf(markers[i].Icon) === -1){
            cat.push(markers[i].Icon);
        }
    }
    
    for(i = 0; i< cat.length; i++){

        catMarkers = jQuery.grep(markers,function(item, c){return(item.Icon == cat[i] && c > 1);});
        
        distCount = catMarkers.length;

        document.getElementById('legenda').innerHTML += "<img src="+iconType[cat[i]]+" height='20px' width='25px'> <input type='checkbox' class='leaflet-control-layers-selector' id='cat"+i+"' name='typeId' value="+cat[i]+" checked/> "+distCount+" "+legName[cat[i]]+" · ";
        
        var catButton = catButtons[i];
        
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
        console.log('Count Per '+catButton.value+ ' Category '+distCount);
    catCluster.addTo(map);
    }

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

                infoDiv.innerHTML += "<li id="+m+" class='list-group-item link-class'><a href='#' onclick='function(){map.setView(latLng("+markers[m].Lat+","+markers[m].Lng+"), 13, {animation: true});};'>"+markers[m].Name+"</a> | <span class='text-muted'>"+markers[m].Address+"</span></li>";

                document.getElementById(m).onClick = function(e){map.setView(markers[m].getLatLng(), '13', {animation: true});}
            }
        }
        titleDiv.innerHTML += "Found: "+results.length+" results for "+term;
    }
}

function update(catMarkers){

    var catButtons = document.getElementById('legenda').getElementsByTagName('input');
    
    for( i=0; i < catButtons.length; i++ ){
        
        var catButton = catButtons[i];
        markers = jQuery.grep(markers,function(item, c){return(item.Icon == catButton.value && c > 1);});
        
        catButton.addEventListener('change', (e) =>{
            map.removeLayer(catMarkers);
            if (e.target.unchecked){
                console.log('not checked'+catButton.value);
                catMarkers.clearLayers();
                map.removeLayer(catMarkers);
            }else{
                console.log('checked'+catButton.value);
                catMarkers.addTo(map);
            }
        });
    }
}