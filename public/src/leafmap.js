function loadMap(){

	var map = L.map('map').setView([50.1, 8], 6);

	L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'}).addTo(map);
        var LeafIcon = L.Icon.extend({
                options: {
                        iconSize:     [20, 25]
              }
        });

	 var iconType = {};
                iconType['1'] = new LeafIcon({iconUrl: '/img/Afoto.png'});
                iconType['2'] = new LeafIcon({iconUrl: '/img/Xfoto.png'});
                iconType['3'] = new LeafIcon({iconUrl: '/img/Avideo.png'});
                iconType['4'] = new LeafIcon({iconUrl: '/img/XVideo.png'});

	var cluster = L.markerClusterGroup({
		spiderfyOnMaxZoom: false,
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

	var customOptions ={
	        'maxWidth': '500',
		'overflow-y': 'scroll',
       		'className' : 'custom'
        }

	for(var i in markers){
     		var lat = markers[i].lat;
     		var lng = markers[i].lng;
		var dif  = markers[i].typeId;

		var title = markers[i].shortdesc;
		var img = markers[i].name+'.jpg';
		var place = markers[i].place;
		var country = markers[i].country;
		var date = markers[i].date;
		var info = markers[i].info;
		
		if (dif < 2){

			var customPopup = "<b><u>"+title+" "+place+" ("+country+")</u></b><br/><center><img src='/images/" + img + ".jpg' alt='' width='350px'/></center><br>"+ info;
		}else{
	
			var customPopup = "<b><u>"+title+" "+ place+" ("+country+")</u></b><br><center><video id=\""+img+"\" poster=\"media/"+img+"/"+img+".jpg\" width=\"480\" height=\"360\" controls=\"autoplay\"><source src=\"media/"+img+"/"+img+".mp4\" type=\"video/mp4\"><source src=\"media/"+img+"/"+img+".ogg\" type=\"video/ogg\"></center><br>"+ info;
		}


		var marker = L.marker([lat, lng], {icon: iconType[dif]}).bindPopup(customPopup,customOptions);
		cluster.addLayer(marker);
	}
	map.addLayer(cluster);
}
