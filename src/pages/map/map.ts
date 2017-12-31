import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

// import {
//  GoogleMaps,
//  GoogleMap,
//  GoogleMapsEvent,
//  GoogleMapOptions,
//  CameraPosition,
//  MarkerOptions,
//  Marker
// } from '@ionic-native/google-maps';

import { ContextProvider} from '../../providers/context/context';

import { Geolocation } from '@ionic-native/geolocation';

/**
 * Generated class for the MapPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

declare var google;


@IonicPage()
@Component({
  selector: 'page-map',
  templateUrl: 'map.html',
})
export class MapPage {

  @ViewChild('map') mapElement: ElementRef;


  latitude: number = 48.877813901996824;
  longitude: number = 2.322369152780408;

  map: any;
  //coinLocations: any;
  //coinIcons: any;

  contractAddresses: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public geolocation: Geolocation,
    public ctx: ContextProvider
    //private googleMaps: GoogleMaps
  ) {
    //this.coinLocations = this.ctx.getLocations();
    console.log('Open map')

    this.contractAddresses = this.ctx.getCoinAddresses();

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MapPage');
    this.loadMap();
  }

  loadMap(){


    console.log()

    let latLng = new google.maps.LatLng(this.latitude, this.longitude);

    let mapOptions = {
      center: latLng,
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      // zoomControl: true, // Set to false for production
      zoomControl: false,
      mapTypeControl: false,
      scaleControl: false,
      streetViewControl: false,
      rotateControl: false,
      fullscreenControl: false
    }

    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

    this.initCoinMarkers();

  }

  initCoinMarkers() {

    var infos = {};
    var features = [];

    for (let coin of this.contractAddresses) {

      var icon = {
        url: this.ctx.getCoinIcon(coin),
        // This marker is 50 pixels wide by 50 pixels high.
        size: new google.maps.Size(50, 50),
        // The origin for this image is (0, 0).
        origin: new google.maps.Point(0, 0),
        // The anchor for this image is the base of the flagpole at (0, 32).
        anchor: new google.maps.Point(25, 25),
        scaledSize: new google.maps.Size(35, 35)
      };

      // Create Info
      var info = {};
      info['icon'] = icon;
      info['name'] = this.ctx.getCoinName(coin);
      infos[coin] = info;

      // Create Feature
      var coinLocations = this.ctx.getCoinLocations(coin);
      for (let loc of coinLocations) {
        var feature = {};
        feature['position'] = new google.maps.LatLng(loc.lat, loc.lon);
        feature['type'] = coin;
        features.push(feature);
      }
    }
    console.log('Infos : ', infos);
    console.log('Features : ', features);


    // Create markers
    var self = this;
    features.forEach(function(feature) {
      var infowindow = new google.maps.InfoWindow({
        content: infos[feature.type].name
      });
      var marker = new google.maps.Marker({
        position: feature.position,
        icon: infos[feature.type].icon,
        //icon: image2,
        map: self.map
      });
      marker.addListener('click', function() {
        infowindow.open(self.map, marker);
      });
    });


  }



  center() {

    this.geolocation.getCurrentPosition().then((position) => {

      /****************/

    }, (err) => {
      console.log(err);
    });

  }


  addMarker() {
    console.log('Add Marker ; ', JSON.stringify(this.map.getCenter()) );
    let marker = new google.maps.Marker({
        map: this.map,
        animation: google.maps.Animation.DROP,
        position: this.map.getCenter()
      });

      let content = "<h4>Information!</h4>";

      this.addInfoWindow(marker, content);
  }

  addInfoWindow(marker, content){

    let infoWindow = new google.maps.InfoWindow({
      content: content
    });

    google.maps.event.addListener(marker, 'click', () => {
      infoWindow.open(this.map, marker);
    });

}


  // loadMap2() {
  //
  //   let mapOptions: GoogleMapOptions = {
  //     camera: {
  //       target: {
  //         lat: 43.0741904,
  //         lng: -89.3809802
  //       },
  //       zoom: 18,
  //       tilt: 30
  //     }
  //   };
  //
  //   this.map = GoogleMaps.create('map_canvas', mapOptions);
  //
  //   // Wait the MAP_READY before using any methods.
  //   this.map.one(GoogleMapsEvent.MAP_READY)
  //     .then(() => {
  //       console.log('Map is ready!');
  //
  //       // Now you can use all methods safely.
  //       this.map.addMarker({
  //           title: 'Ionic',
  //           icon: 'blue',
  //           animation: 'DROP',
  //           position: {
  //             lat: 43.0741904,
  //             lng: -89.3809802
  //           }
  //         })
  //         .then(marker => {
  //           marker.on(GoogleMapsEvent.MARKER_CLICK)
  //             .subscribe(() => {
  //               alert('clicked');
  //             });
  //         });
  //
  //     });
  // }

  goBack() {
    //let data = { 'disconnect': 'no'};
    this.viewCtrl.dismiss();
  }

  getStyledMap() {
    return new google.maps.StyledMapType(

      //Début Json

    [
  {
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#f5f5f5"
      }
    ]
  },
  {
    "elementType": "labels.icon",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#616161"
      }
    ]
  },
  {
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#f5f5f5"
      }
    ]
  },
  {
    "featureType": "administrative.land_parcel",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#bdbdbd"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#eeeeee"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#757575"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#e5e5e5"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#9e9e9e"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#ffffff"
      }
    ]
  },
  {
    "featureType": "road.arterial",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#757575"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#dadada"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#616161"
      }
    ]
  },
  {
    "featureType": "road.local",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#9e9e9e"
      }
    ]
  },
  {
    "featureType": "transit.line",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#e5e5e5"
      }
    ]
  },
  {
    "featureType": "transit.station",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#eeeeee"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#c9c9c9"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#9e9e9e"
      }
    ]
  }
]
// Fin Json


)
  }

}
