function loadMap(){

	var map = L.map('map').setView([51.9, 12], 5);

	L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'}).addTo(map);
        var LeafIcon = L.Icon.extend({
                options: {
                        iconSize:     [20, 20]
              }
        });

	 var iconType = {};
                iconType['1'] = new LeafIcon({iconUrl: '/img/Afoto.png'});
                iconType['2'] = new LeafIcon({iconUrl: '/img/Xfoto.png'});
                iconType['3'] = new LeafIcon({iconUrl: '/img/Avideo.png'});
                iconType['4'] = new LeafIcon({iconUrl: '/img/Xvideo.png'});
         
	for(var i in markers){
     		var lat = markers[i].lat;
     		var lng = markers[i].lng;
		var dif  = markers[i].icon;
		var title = markers[i].title;
	
		L.marker([lat, lng], {icon: iconType[dif]}).bindPopup(title).addTo(map);
	}
}
