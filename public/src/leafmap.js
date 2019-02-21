function loadMap() {
    
    //Loading Json Data (only punlished)
    markers = jQuery.grep(markers,function(item, i){return(item.published == "1" && i > 1);});

    var iconType = {};
        iconType['1'] = '/img/Afoto.png';
        iconType['2'] = '/img/Xfoto.png';
        iconType['3'] = '/img/Avideo.png';
        iconType['4'] = '/img/XVideo.png';

     var legName = {};
         legName['1'] = "Allied photo\'s";
         legName['2'] = "Axis photo\'s";
         legName['3'] = "Allied Video\'s";
         legName['4'] = "Axis Video\'s";
    
    var map = L.map('map').setView([50.1, 6], 6);
    mapLink = '<a href="http://www.esri.com/">Esri</a>';
    wholink = 'i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community';

    L.tileLayer( 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',{
            attribution: '&copy; '+mapLink+', '+wholink,
            maxZoom: 18,
            }).addTo(map);
    
        var LeafIcon = L.Icon.extend({
            options: {
                    iconSize:[20, 20]
            }
        });
   
    var catLayers = L.markerClusterGroup({

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

    var titleDiv = document.getElementById('title');
    var infoDiv = document.getElementById('markerInfo');
    var catButtons = document.getElementById('legenda').getElementsByTagName('input');
    var cat = [];

    //get All Categories
    for(i = 0; i< markers.length; i++){
        if(cat.indexOf(markers[i].typeId) === -1){
            cat.push(markers[i].typeId);
        }
    }
    
    //loop through Categories
    for(i = 0; i< cat.length; i++){

        catData = jQuery.grep(markers,function(item, c){return(item.typeId == cat[i] && c > 1);});

        catLayers[i] = new L.markerClusterGroup();
        for(m in catData){

                var lat     = catData[m].lat;
                var lng     = catData[m].lng;
                var dif     = catData[m].typeId;
                var head    = catData[m].shortdesc;
                var img     = catData[m].name;
                var place   = catData[m].place;
                var country = catData[m].country;
                var date    = catData[m].date;
                var info    = catData[m].info;

                var title = place+" - "+date;

                if (dif < 3){
                    var cusCode = "<p><center><img src='/images/" + img + ".jpg' alt='' width='350px'/></center><br>";
                }else{
                    var cusCode = "<p>    <center><video id=\""+img+"\" poster=\"media/"+img+"/"+img+".jpg\" width=\"480\" height=\"360\" controls=\"autoplay\"><source src=\"media/"+img+"/"+img+".mp4\" type=\"video/mp4\"><source src=\"media/"+img+"/"+img+".ogg\" type=\"video/ogg\"></center><br>";
                }

                var marker = L.marker([lat, lng], {icon:   new LeafIcon({iconUrl:[iconType[dif]]})});
                marker.__index = i;
                marker.title = title;
                marker.html = cusCode;
                marker.latLng = marker.getLatLng();
                marker.info = info.replace("'","&#39;");
                marker.on('click', sideDiv);

                //catLayers[i].addLayer(marker);
            }
            //catLayers[i].addTo(map);
            //map.addLayer(catLayers[i]);
        distCount = catData.length;
        document.getElementById('legenda').innerHTML += "<img src="+iconType[cat[i]]+" height='20px' width='20px'> <input type='checkbox' class='leaflet-control-layers-selector' name='typeId' value="+cat[i]+" checked/> "+distCount+" "+legName[cat[i]]+" · ";

    }

 //updateMap(catMarkers,map);
    //Show SideDive per marker
    function sideDiv(e){

        var title= this.title;
        var text= this.html;
        var info = this.info;
        var latLng = this.latLng;

        titleDiv.innerHTML = "<h3><u>"+title+"</u></h3>";
        if (info !== ''){
            document.getElementById('speakButton').innerHTML = "<p><button onclick='responsiveVoice.speak(`"+info+"`);'>Read Me</button>";
        }else{
            document.getElementById('speakButton').innerHTML = "";
        }
        titleDiv.onmouseover = function(){titleDiv.style.color = '#428608';};
        titleDiv.onmouseout = function(){titleDiv.style.color = 'Black';};
        titleDiv.onclick = function(e){map.setView(latLng, '20', {animation: true});};

        infoDiv.innerHTML = text;
    }
}

function updateMap(catMarkers,map){
    catMarkers.addTo(map);
    var catButtons = document.getElementById('legenda').getElementsByTagName('input');
    console.log(catButtons.length);
    console.log(catMarkers.getLayers().length);
    
    for(i=0; i < catButtons.length; i++){
        
        jQuery.grep(catMarkers,function(item, c){return(item.typeId == i && c > 1);});
        var catButton = catButtons[i];
        catButton.addEventListener('change', function(e){

            if (e.target.unchecked){
                console.log('not checked'+catButton.value);
                catMarkers[i].clearLayers();
                map.removeLayer(catMarkers[i]);
            }else{
                catMarkers[i].addTo(map);
            }
        });
    }
}

function search(){
    markers = jQuery.grep(markers,function(item, i){return(item.published == "1" && i > 1);});
    
    var titleDiv = document.getElementById('title');
    var infoDiv = document.getElementById('markerInfo');
    var results =[];
    var term = document.getElementsByClassName('searchField')[0].value;
    var regex = new RegExp( term, 'ig');
    
    if (term == ''){
        titleDiv.innerHTML = "<h3><u>Search</u></h3>";
        infoDiv.innerHTML = "<br>What are you looking for?";
    }else{
        titleDiv.innerHTML = "<h3><u>Search</u></h3>";
        infoDiv.innerHTML = "";
        for (m in markers) {
            info = JSON.stringify(markers[m].info);
            if (info.match(regex)){
                results.push(name);

                infoDiv.innerHTML += "<li id="+m+" class='list-group-item link-class'>"+markers[m].shortdesc+"</a> | <span class='text-muted'>"+markers[m].place+"</span></li>";

                document.getElementById(m).onClick = function(e){map.setView(latLng(markers[m].Lat,markers[m].Lng), '13', {animation: true});};
            }
        }
        titleDiv.innerHTML += "Found: "+results.length+" results for "+term;
    }
}
