function loadMap() {

   // markers = jQuery.grep(markers,function(item, i){return(item.Verified == '1' && i > 1);});

    var iconType        = {};
        iconType['0']   = '/img/marker1.png';
        iconType['1']   = '/img/marker2.png';
        iconType['2']   = '/img/marker3.png';

    var legName         = {};
        legName['0']    = 'Coffee Shops';
        legName['1']    = 'CBD stores';
        legName['2']    = 'Other';

    var map = L.map('map').setView([46.5, 10], 4,catLayers);
    lableLink = '<a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>';

    L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',{
            attribution: '&copy;',
            maxZoom: 18,
            }).addTo(map);

    L.tileLayer('http://{s}.basemaps.cartocdn.com/dark_only_labels/{z}/{x}/{y}.png',{
	    id: 'cartodb_labels',
	    attribution: '&copy; '+lableLink
            }).addTo(map);
    
    var LeafIcon = L.Icon.extend({
        options: {
            iconSize:[20, 25]
        }
    });

    var catLayers = L.markerClusterGroup({
        animateAddingMarkers: true,
        spiderfyOnMaxZoom: true,
        showCoverageOnHover: false,
        zoomToBoundsOnClick: true,
        disableClusteringAtZoom: 7,
        removeOutsideVisibleBounds:true,
        maxClusterRadius: 80,
        spiderLegPolylineOptions: {
            weight: 1.5,
            color: '#222',
            opacity: 0.5
        }
    });

    var c =0;
    var catButtons = document.getElementById('legenda').getElementsByTagName('input');
    var infoDiv = document.getElementById('markerInfo');
    var titleDiv = document.getElementById('title');
    var cat = [];

    for(i = 0; i< markers.length; i++){
        if(cat.indexOf(markers[i].Icon) === -1){
            cat.push(markers[i].Icon);
        }
    }

    //loop through Categories
    for(i = 0; i< cat.length; i++){

        catData = jQuery.grep(markers,function(item, c){return(item.Icon == cat[i] && c > 1);});

        catLayers[i] = new L.markerClusterGroup({
            animateAddingMarkers: true,
            spiderfyOnMaxZoom: true,
            showCoverageOnHover: false,
            zoomToBoundsOnClick: true,
            disableClusteringAtZoom: 7,
            removeOutsideVisibleBounds:true,
            maxClusterRadius: 80,
            spiderLegPolylineOptions: {
                weight: 1.5,
                color: '#222',
                opacity: 0.5
            }
    });
        for(m in catData){

            var lat         = catData[m].Lat;
            var lng         = catData[m].Lng;
            var dif         = catData[m].Icon;
            var country     = catData[m].Country;
            var name        = catData[m].Name;
            var address     = catData[m].Address;
            var zcode       = catData[m].Zip_Code;
            var city        = catData[m].City;
            var phone       = catData[m].Phone;
            var email       = catData[m].Email;
            var web         = catData[m].Website;
            var contact     = catData[m].Contact;

            var title       = name+" - "+city;;
            var marker      = L.marker([lat, lng], {icon:  new LeafIcon({iconUrl:[iconType[i]]})});
            var code        = contact+"<br>"+address+" "+zcode+"<br>"+phone+"<br>"+email+"<br>"+web;

            marker.code     = code;
            marker.latLng   = marker.getLatLng();
            marker.title    = title.replace("'","&#39;");
            marker.on('click', sideDiv);

            catLayers[i].addLayer(marker);

        }
        catLayers[i].addTo(map);

            distCount           = catData.length;
            var icon            = document.createElement('img');
                icon.width      = 20;
                icon.height     = 20;
                icon.src        = iconType[i];
            var checkbox        = document.createElement('input');
                checkbox.type   = "checkbox";
                checkbox.name   = "typeId";
                checkbox.id     = i;
                checkbox.checked= true;
            var label = document.createElement('label')
                label.htmlFor = "id";
                label.appendChild(document.createTextNode(" "+distCount +" "+legName[i]+" · "));

            legenda.appendChild(checkbox);
            legenda.appendChild(icon);
            legenda.appendChild(label);

            checkbox.addEventListener('change', function(e){
                var id = this.id;
                 console.log (id);
                if (map.hasLayer(catLayers[id])) {
                    map.removeLayer(catLayers[id]);
                } else {
                    map.addLayer(catLayers[id]);
                }
        });

    geojson = L.geoJson(ITcurrentRegions).addTo(map);
    geojson = L.geoJson(EUcurrentCountries).addTo(map);
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
