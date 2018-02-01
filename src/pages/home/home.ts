import { Component, ViewChild, ElementRef} from '@angular/core';

import { IonicPage, NavController, NavParams, ViewController, ModalController, Loading, LoadingController } from 'ionic-angular';

import { LoginPage } from '../login/login';
import { ItemDetailPage } from '../item-detail/item-detail';
import { ProfilePage } from '../profile/profile';
import { MapPage } from '../map/map';
import { ReceiveCoinsPage } from '../receive-coins/receive-coins';

import { AuthProvider } from '../../providers/auth/auth';
import { ContextProvider} from '../../providers/context/context';

import { ImageLoaderConfig, ImageLoader } from 'ionic-image-loader';

import { BarcodeScanner } from '@ionic-native/barcode-scanner';

import { TranslateService } from '@ngx-translate/core';

import { Geolocation } from '@ionic-native/geolocation';

//import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions';

// export interface Coin {
//   amount: number;
//   coinColor: string;
//   coinName: string;
// }

declare var google;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  //Useful for HTML
  info : string;

  mapIsOn: boolean = true;
  myCoinsOnly: boolean = false;

  divMap: any;
  divList: any;
  containerMap: any;
  containerList: any;


  fidDarkGrey: string;
  fidLightGrey: string;

  allCoinsObserver: any;
  myCoinsObserver: any;

  // Map elements

  @ViewChild('map') mapElement: ElementRef;

  public loading: Loading;

  infoWindows: any = [];

  // Adresse de la Friche
  latitude: number = 48.877813901996824;
  longitude: number = 2.322369152780408;

  map: any;

  positionMarker: any;

  mapsInfoIcons: any = {};
  infoIcon: string = 'icon';
  // infoName: string = 'name';
  // infoLandscape: string = 'landscape';
  // infoCompanyName: string = 'companyName';
  // infoBrandIcon: string = 'brandIcon';
  // infoCoinColor: string = 'coinColor';


  featureType: string = 'type';
  featurePosition: string = 'position';
  featureAddress: string = 'address';

  mapDiscover: string;


  contractAddresses: any = [];
  mapMarkers: any = {};

  // End of map elements


  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public modalCtrl: ModalController,
    public authProvider: AuthProvider,
    public ctx: ContextProvider,
    private imageLoaderConfig: ImageLoaderConfig,
    public loadingCtrl: LoadingController,
    public imageLoader: ImageLoader,
    private barcodeScanner: BarcodeScanner,
    private translateService: TranslateService,
    public geolocation: Geolocation
    //private nativePageTransitions: NativePageTransitions
  ) {

      console.log('Open Homepage constructor');

      this.imageLoaderConfig.enableSpinner(true);

      // Variables for html
      this.info = this.ctx.info;

      this.fidLightGrey = this.ctx.fidLightGrey;
      this.fidDarkGrey = this.ctx.fidDarkGrey;

      this.allCoinsObserver = this.ctx.getAllCoinsObserver();
      this.allCoinsObserver.subscribe( () => {this.refreshMap();});
      this.myCoinsObserver = this.ctx.getMyCoinsObserver();
      this.myCoinsObserver.subscribe( () => {this.refreshMap();});


      this.translate();

  }

  translate() {
    this.translateService.get('MAP.DISCOVER').subscribe(mapDiscover => { this.mapDiscover = mapDiscover.toString(); });

  }

  refreshData() {
    console.log('Open refreshData');
    this.contractAddresses = this.ctx.getCoins(this.myCoinsOnly);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MapPage');
    this.divMap = document.getElementById("map");
    this.divList = document.getElementById("list");
    //this.header = document.getElementById("header");

    this.containerMap = this.divMap.parentNode;
    this.containerList = this.divList.parentNode;
    //this.navbar = this.header.parentNode;

    if(this.mapIsOn){
      this.containerList.removeChild(this.divList);
      //this.navbar.removeChild(this.header);
    }
    else{
      this.containerMap.removeChild(this.divMap);
    }


    this.initMap().then( () => {
      this.initPositionMarker().then( () => {
        this.refreshPositionMarker(this);
      });
      this.refreshMap();
    });

  }


  itemTapped(event, contractAddress) {
    console.log('itemTapped : ',contractAddress);

    this.navCtrl.push(ItemDetailPage, {
      coinContractAddress : contractAddress
    });

  }


  collectCoins() {
    let myModalCtrl = this.modalCtrl.create(ReceiveCoinsPage, {
      coinColor : this.fidDarkGrey
    });
    // myModalCtrl.onDidDismiss(data => {
    //   console.log('Dismiss receive-coins : ',data);
    // });
    myModalCtrl.present();
  }

  switchCoinMode() {
    console.log('Open switchCoinMode');
    this.refreshMap();
  }

  showProfile() {
    let myModalCtrl = this.modalCtrl.create(ProfilePage);
    myModalCtrl.onDidDismiss( (demoToggleActivated) => {
      if(demoToggleActivated){
        this.refreshMap();
      }
    });

    myModalCtrl.present();
  }

  showMap() {
    this.mapIsOn = true;

    this.containerList.removeChild(this.divList);
    this.containerMap.appendChild(this.divMap);

    google.maps.event.trigger(this.map, 'resize');

  }

  showList() {
    this.mapIsOn = false;

    this.containerMap.removeChild(this.divMap);
    this.containerList.appendChild(this.divList);

  }



  initMap(): Promise<any>{
    var self = this;
    return new Promise((resolve, reject) => {
      console.log('Open initMap');
      let latLng = new google.maps.LatLng(self.latitude, self.longitude);

      let mapOptions = {
        center: latLng,
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        zoomControl: false,
        mapTypeControl: false,
        scaleControl: false,
        streetViewControl: false,
        rotateControl: false,
        fullscreenControl: false
      }

      if(self.mapElement) {
        self.map = new google.maps.Map(self.mapElement.nativeElement, mapOptions);
      }

      // Create a div to hold the control.
      var controlDiv = document.createElement('div');

      //### Add a button on Google Maps ...
      var controlMarkerUI = document.createElement('img');
      controlMarkerUI.style.cursor = 'pointer';
      controlMarkerUI.style.height = '50px';
      controlMarkerUI.style.width = '50px';
      controlMarkerUI.style.marginRight = '20px';
      controlMarkerUI.style.marginBottom = '15px';
      controlMarkerUI.style.borderRadius = '50px';
      controlMarkerUI.setAttribute('src', 'assets/images/other/center_map.png');
      controlMarkerUI.addEventListener('click', function() {
        self.refreshPositionMarker(self);
      }, false);
      controlMarkerUI.title = 'Click to set the map to Home';
      controlDiv.appendChild(controlMarkerUI);

      if(self.map) {
        self.map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(controlDiv);
      }

      resolve();

    });

  }

  refreshMap() {
    console.log('Open refreshMap');
    this.removeAllMarkers();

    this.refreshData();

    for (let coin of this.contractAddresses) {
      this.mapMarkers[coin] = [];
    }

    this.initAllFeatures(this.contractAddresses).then( (features) => {
      this.createCoinMarkersForFeatures(features);
      this.addMarkersOnMap(this.map);
    });

  }


  initAllFeatures(coins: any): Promise<any> {
    var self = this;
    return new Promise((resolve, reject) => {
      console.log('Open initCoinMarkers');

      var features = [];

      for (let coin of coins) {
        let localFeatures = self.initFeatures(coin);
        for (let feat of localFeatures) {
            features.push(feat);
        }
      }

      resolve(features);

    });
  }

  initFeatures(coin: any): any { //returns infos{} structure + features[] array containing all locations
    var self = this;

    // Create Icon
    var icon = {
      url: self.ctx.getCoinIcon(coin),
      // This marker is 50 pixels wide by 50 pixels high.
      size: new google.maps.Size(50, 50),
      // The origin for this image is (0, 0).
      origin: new google.maps.Point(0, 0),
      // The anchor for this image is the base of the flagpole at (0, 32).
      anchor: new google.maps.Point(25, 25),
      scaledSize: new google.maps.Size(45, 45)
    };

    self.mapsInfoIcons[coin] = icon;

    var localFeatures = [];

    // Create Features
    var coinLocations = self.ctx.getCoinLocations(coin);
    for (let loc of coinLocations) {
      var feature = {};
      feature[self.featurePosition] = new google.maps.LatLng(loc.lat, loc.lng); //GPS coordinates
      feature[self.featureType] = coin;                                         //coinContractAddress
      feature[self.featureAddress] = loc.address;                               //Ex: 21 rue de Vienne, 75008 Paris
      localFeatures.push(feature);
    }

    return localFeatures;

  }

  createCoinMarkersForFeatures(features: any) {
    var self = this;
    // Create markers
    features.forEach(function(feature) {
      self.createCoinMarkerForFeature(feature);
    });

  }

  createCoinMarkerForFeature(feature: any) {
    var self = this;
    let coin = feature[self.featureType];           //CoinContractAddress
    let mapsInfoIcon = this.mapsInfoIcons[coin];    //Coin icon (google maps format)
    if(mapsInfoIcon) {

        var marker = new google.maps.Marker({
          position: feature[self.featurePosition],
          icon: mapsInfoIcon
          // map: self.map
        });

        self.addInfoWindowToMarker(
          marker,                                                     //marker to attach infoWindow
          self.createCoinMarkerContent(coin, mapsInfoIcon, feature),  //html code to create infoWindow
          feature[self.featureType]                                   //coin contract address
        );

        if( this.mapMarkers[coin] ){
          this.mapMarkers[coin].push(marker);
        }

    }
    else {
      console.log('No icon for coin : ', coin);
    }
  }

  addMarkersOnMap(map: any) {
    for (let coin of this.contractAddresses) {
      if( this.mapMarkers[coin] ) {
        for (let marker of this.mapMarkers[coin]) {
          marker.setMap(map);
        }
      }
    }
  }

  removeAllMarkers() {
    this.addMarkersOnMap(null);
  }


  // Add my positionMarker on the map
  initPositionMarker(): Promise<any> {
    var self = this;
    return new Promise((resolve, reject) => {
      self.closeAllInfoWindows();

      self.positionMarker = new google.maps.Marker({
          map: self.map,
          draggable: false,
          animation: google.maps.Animation.BOUNCE // BOUNCE vs DROP
          // position: latLong
        }
      );

      resolve();
    });

  }


  // Replace my position marker on the image (refresh)
  refreshPositionMarker(self: any) {
    this.loading = this.loadingCtrl.create({
      dismissOnPageChange: true,
    });
    self.loading.present();

    self.geolocation.getCurrentPosition().then((position) => {
      console.log('Center at latitude : ', position.coords.latitude, ' and longitude : ', position.coords.longitude);
      let locPos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
      if(self.map) {
        self.map.setCenter(locPos);
        // self.map.animateCamera({
        //     target: position,   // Sets the center of the map to Mountain View
        //     zoom: 14,           // Sets the zoom
        //     tilt: 60,           // Sets the tilt of the camera to 60 degrees
        //     bearing: 140,       // Sets the orientation of the camera to east
        //     duration: 2000
        // }, () => {});
      }

      if(self.positionMarker){
        self.positionMarker.setPosition(locPos);
        self.animatePositionMarker(self);
      }

      self.loading.dismiss();

    }, (err) => {
      console.log(err);
      self.loading.dismiss();
    });

  }



  animatePositionMarker(self: any) {
    if(self.positionMarker){
      if (self.positionMarker.getAnimation() !== null) {
        // self.positionMarker.setAnimation(null);
        self.positionMarker.setAnimation(google.maps.Animation.BOUNCE);
      } else {
        self.positionMarker.setAnimation(google.maps.Animation.BOUNCE);
      }
    }
    else{
      console.log('No positionMarker');
    }
  }



  addInfoWindowToMarker(marker: any, infoWindowContent: string, coin: string) {
    var infoWindow = new google.maps.InfoWindow({
      content: infoWindowContent
    });

    google.maps.event.addListenerOnce(infoWindow, 'domready', () => {
      document.getElementById('myid').addEventListener('click', () => {

        console.log('ItemTapped : ',coin);
        this.navCtrl.push(ItemDetailPage, {
          coinContractAddress : coin
        });

      });
    });

    marker.addListener('click', () => {
      this.closeAllInfoWindows();
      infoWindow.open(this.map, marker);
    });
    this.infoWindows.push(infoWindow);
  }

  closeAllInfoWindows() {
    for(let window of this.infoWindows) {
      window.close();
    }
  }


  createCoinMarkerContent(coin: any, mapsInfoIcon: any, feature: any): string {
    let address = feature[this.featureAddress];
    let position = feature[this.featurePosition];
    let landscape = this.ctx.getLandscape(coin);
    let brandIcon = this.ctx.getBrandIcon(coin);
    let companyName = this.ctx.getCompanyName(coin);
    let buttonColor = this.ctx.getCoinColor(coin);
    let clickableAddress = "https://www.google.com/maps/?q="+position.lat()+","+position.lng();

    console.log('Open createCoinMarkerContent : ', landscape, ', ', brandIcon, ', ', companyName, ', ', address, ', ', position, ', ', clickableAddress, ', ', buttonColor);

    return `

    <div style="
        background-color: white;
        position: relative;
        overflow: auto;
        overflow-y:hidden;
        overflow-x:hidden;">


        <img
          src="`+ landscape +`"
          style="position: relative; height: 135px; width: 270px max-height: 150px; overflow: auto !important;">
        <div style="
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 135px;
          clear: both;
          background-color: rgba(255, 255, 255, 0.75);
          color: #ffffff;">

          <ion-row>
          <ion-col col-3>
          </ion-col>
          <ion-col col-6>
            <ion-row style="height: 80px">
              <img
                style="
                margin-top: 8px;
                border-radius: 30px;
                position: absolute;
                height: 60px;
                width: 60px;
                left: 50%;
                margin-left: -30px;
                border: 1px solid #afabab;"
                src="`+ brandIcon +`">
            </ion-row>
            <ion-row style="margin-top: 5px;">
              <ion-col style="text-align: center; margin: 0 0; padding: 0 0;">
                <p style="
                  margin-top: 55px;
                  color: grey;
                  font-size: 110%;">
                  `+companyName+`</p>
              </ion-col>
            </ion-row>

            <ion-row style="margin-top: 5px;">
              <ion-col style="text-align: center; margin: 0 0; padding: 0 0;">
                <button id="myid"
                  style="
                  background-color : `+buttonColor+`;
                  position: absolute;
                  top: 50%;
                  left: 50%;
                  height: 30px;
                  width: 90%;
                  margin-top: 25px;
                  margin-left: -45%;
                  font-size: 110%;
                  color: white;
                ">
                `+this.mapDiscover+`
              </button>
              </ion-col>
            </ion-row>


          </ion-col>
          <ion-col col-3>
          </ion-col>

        </ion-row>


        </div>


    </div>




    <a style="
      href="`+clickableAddress+`";
      color: blue;
      z-index: 10;
      margin-top: 0px;
      font-size: 80%;">
      `+address+`</a>


    `;

  }


}
