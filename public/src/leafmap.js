function loadMap() {

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
    
      markers = jQuery.grep(markers,function(item, i){return(item.published == "1" && i > 1);});
    
    var cat = [];
    for(c = 0; c< markers.length; c++){    
        if(cat.indexOf(markers[c].typeId) === -1){
        cat.push(markers[c].typeId);        
        }        
    }
    
    for(i = 0; i< cat.length; i++){
        
        distCount = (jQuery.grep(markers,function(item, c){return(item.typeId == cat[i] && c > 1);})).length;
        
        document.getElementById('legenda').innerHTML += "<img src="+iconType[cat[i]]+"> <input type='checkbox' name='typeId' vaulue="+cat[i]+" checked onchange='loadingMap(markers);'/> "+distCount+" "+legName[cat[i]]+" · ";
    }
    
loadingMap(markers, iconType);
 
}

function loadingMap(markers,iconType){
    
    var map = L.map('map').setView([50.1, 6], 6);
    mapLink = 
            '<a href="http://www.esri.com/">Esri</a>';
        wholink = 
            'i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community';
    
	L.tileLayer(
            'http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
            attribution: '&copy; '+mapLink+', '+wholink,
            maxZoom: 18,
            }).addTo(map);
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

  
    for(var i in markers){

        var lat     = markers[i].lat;
        var lng     = markers[i].lng;
		var dif     = markers[i].typeId;
		var title   = markers[i].shortdesc;
		var img     = markers[i].name;
		var place   = markers[i].place;
		var country = markers[i].country;
		var date    = markers[i].date;
		var info    = markers[i].info;
        
        if (dif < 3){

			var cusCode = "<big><u>"+title+" "+place+" ("+country+")</u></big><p><center><img src='/images/" + img + ".jpg' alt='' width='350px'/></center><br>"+date+"<br>"+info;
		}else{
			var cusCode = "<big><u>"+title+" "+place+" ("+country+")</u></big><p>    <center><video id=\""+img+"\" poster=\"media/"+img+"/"+img+".jpg\" width=\"480\" height=\"360\" controls=\"autoplay\"><source src=\"media/"+img+"/"+img+".mp4\" type=\"video/mp4\"><source src=\"media/"+img+"/"+img+".ogg\" type=\"video/ogg\"></center><br>"+date+"<br>"+info;
		}

		var marker = L.marker([lat, lng], {icon:   new LeafIcon({iconUrl:[iconType[dif]]})});
        marker.html = cusCode;
        marker.info = info.replace("'","&#39;");
        marker.on('click', sideDiv);
		cluster.addLayer(marker);
	}
	map.addLayer(cluster);
    
}

function sideDiv(e){
    
	var text= this.html;
    var info = this.info;
    
    if (info !== ''){
        document.getElementById('speakButton').innerHTML = "<p><button onclick='responsiveVoice.speak(`"+info+"`);'>Read Me</button>";
    }else{
        document.getElementById('speakButton').innerHTML = "";
    }
    document.getElementById('markerInfo').innerHTML = text;
}

function search(){
    document.getElementById('speakButton').innerHTML = "";
    document.getElementById('markerInfo').innerHTML ="";
    
    var results =[];
    var term = document.getElementsByClassName('searchField')[0].value;
    var regex = new RegExp( term, 'ig');
    
    if (term == ''){
            document.getElementById('markerInfo').innerHTML = "What are you looking for?";
    }else{
        document.getElementById('markerInfo').innerHTML = "";
    for (m in markers) {
        name = JSON.stringify(markers[m].info);
        
        if (name.match(regex)){
            results.push(name);
          
            document.getElementById('markerInfo').innerHTML += "<li class='list-group-item link-class'>"+markers[m].shortdesc+" | <span class='text-muted'>"+markers[m].info+"</span></li>";
   
    }
        
   }
        document.getElementById('markerInfo').innerHTML += "Found: "+results.length+" results for "+term;
}
}