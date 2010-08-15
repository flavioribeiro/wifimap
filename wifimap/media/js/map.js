
var Map = {
    
    init: function() {
        this.container = $('#map');
        this.defaultOptions = {
            zoom: 8,
            center: new google.maps.LatLng(-22.9963233069, -43.3637237549),
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            scrollwheel: false
        };
        this.map = new google.maps.Map(this.container.get(0), this.defaultOptions);
        
        // this is the Marker instance used in /spots/add to choose the position
        this.markerToAdd = null;
    },
    followCenter: function(callback) {
        google.maps.event.addListener(this.map, 'center_changed', function() {
            var center = Map.map.getCenter();
            callback(center.lat(), center.lng());
        });
    },
    addMarkerToAdd: function(options) {
        options['draggable'] = true;
        if ( !this.markerToAdd ) {
            this.markerToAdd = new google.maps.Marker(options);
            google.maps.event.addListener(this.markerToAdd, 'dragend', this.markerToAddDropped);
        };
        this.markerToAdd.setMap(this.map);
    },
    markerToAddDropped: function(obj) {
        SpotForm.updateLatLng( obj.latLng );
        Map.getAddressFromLatLng( obj.latLng, SpotForm.updateAddress );
    },
    getAddressFromLatLng: function(latLng, callback) {
        var geocoder = new google.maps.Geocoder()
        geocoder.geocode( 
            { 'latLng': latLng }, 
            function(result, status) {
                if (status != google.maps.GeocoderStatus.OK)
                    var address = "Ops... Address couldn't be found :(";
                else
                    var address = result[0].formatted_address;
                callback( address );
            }
        );
    },
    addAccessPoint: function(id, point) {
        var self = this;
        
        var marker = new google.maps.Marker({
             position: new google.maps.LatLng(point[0], point[1]),
             id: id
         });
         
         google.maps.event.addListener(marker, 'click', function() {
            SpotManager.getPointInformation(marker.id, marker, self.createAccessPointInfoWindow);
         });
         
         marker.setMap(this.map);
    },
    createAccessPointInfoWindow: function(data) {
        var self = this;
        
        var content = '<div id="info-window">' + data.name + '<br/>';
        content += data.address + '<br/>';
        content += '<a href="/spots/' + data.id + '/">see more</a></div>';
        
        $('#info-window a').live('click', function() {
            $('#content').load($(this).attr('href'));
            return false;
        });
        
        var infoWindow = new google.maps.InfoWindow({
            content: content
        });
        return infoWindow;
    }    
};
