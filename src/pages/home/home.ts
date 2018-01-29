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
  myContractAddresses : string;


  mapIsOn: boolean = true;
  myCoinsIsOn: boolean = false;

  divMap: any;
  divList: any;
  containerMap: any;
  containerList: any;
  // header: any;
  // navbar: any;

  localDemoMode: boolean;

  fidDarkGrey: string;
  fidLightGrey: string;

  // Map elements

  @ViewChild('map') mapElement: ElementRef;

  public loading: Loading;

  infoWindows: any = [];

  // Adresse de la Friche
  latitude: number = 48.877813901996824;
  longitude: number = 2.322369152780408;

  map: any;

  positionMarker: any;

  contractAddresses: any;


  infoIcon: string = 'icon';
  infoName: string = 'name';
  infoLandscape: string = 'landscape';
  infoCompanyName: string = 'companyName';
  infoBrandIcon: string = 'brandIcon';
  infoCoinColor: string = 'coinColor';


  featureType: string = 'type';
  featurePosition: string = 'position';
  featureAddress: string = 'address';

  mapDiscover: string;

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
      this.myContractAddresses = this.ctx.myContractAddresses;

      this.fidLightGrey = this.ctx.fidLightGrey;
      this.fidDarkGrey = this.ctx.fidDarkGrey;
      console.log('COLOR : ',this.fidDarkGrey);

      this.translate();

      this.localDemoMode = this.ctx.getDemoMode();


  }

  translate() {
    this.translateService.get('MAP.DISCOVER').subscribe(mapDiscover => { this.mapDiscover = mapDiscover.toString(); });

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


    this.loadMap();

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
    if(this.myCoinsIsOn) {
      this.myCoinsIsOn = false;
    }
    else {
      this.myCoinsIsOn = true;
    }
    this.loadMap();
  }

  showProfile() {
    let myModalCtrl = this.modalCtrl.create(ProfilePage);
    myModalCtrl.onDidDismiss( () => {
      let globalDemoMode = this.ctx.getDemoMode();
      console.log('Dismiss profile with demoMode : ', globalDemoMode);
      if(this.localDemoMode != globalDemoMode) {
        this.loadMap();
        this.localDemoMode = globalDemoMode;
      }
    });

    myModalCtrl.present();
  }

  showMap() {
    this.mapIsOn = true;

    this.containerList.removeChild(this.divList);
    //this.navbar.removeChild(this.header);
    this.containerMap.appendChild(this.divMap);

    // if(this.containerMap.parent) {
    //   this.containerMap.BringToFront(this.containerMap);
    // }

    // this.reattachMap(this.map,div);
    // let myModalCtrl = this.modalCtrl.create(MapPage);
    // myModalCtrl.onDidDismiss(data => {
    //   console.log('Dismiss map : ',data);
    // });
    // myModalCtrl.present();
    // divMap.addEventListener('DOMNodeRemoved', function() {
    //   this.map.setDiv(null);
    //   divMap = null;
    // });

  }

  showList() {
    this.mapIsOn = false;

    //let bar = this.navbar.parentNode;
    //bar.removeChild(this.navbar);


    this.containerMap.removeChild(this.divMap);


    //bar.appendChild(this.navbar);
    this.containerList.appendChild(this.divList);
    //this.navbar.appendChild(this.header);

    // if(this.containerList.parent) {
    //   this.containerList.BringToFront(this.containerList);
    // }


  }



  loadMap(){
    console.log('Open loadMap');

    // xxxxxxxx
    this.contractAddresses = this.ctx.getCoins(this.myCoinsIsOn);

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

    if(this.mapElement) {
      this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
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
      controlMarkerUI.setAttribute('src', 'assets/images/other/center_map.png')
      var self = this;
      controlMarkerUI.addEventListener('click', function() {
        self.placeMyPositionMarker(self);
      }, false);
      controlMarkerUI.title = 'Click to set the map to Home';
      controlDiv.appendChild(controlMarkerUI);

      if(this.map) {
        this.map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(controlDiv);
      }

      this.initCoinMarkers();

      this.addMyPosition();


  }



  initCoinMarkers() {

    console.log('Open initCoinMarkers');

    var infos = {};
    var features = [];

    for (let coin of this.contractAddresses) {

      //console.log('Coin : ', coin);

      var icon = {
        url: this.ctx.getCoinIcon(coin),
        // This marker is 50 pixels wide by 50 pixels high.
        size: new google.maps.Size(50, 50),
        // The origin for this image is (0, 0).
        origin: new google.maps.Point(0, 0),
        // The anchor for this image is the base of the flagpole at (0, 32).
        anchor: new google.maps.Point(25, 25),
        scaledSize: new google.maps.Size(45, 45)
      };

      // Create Info
      var info = {};
      info[this.infoIcon] = icon;
      info[this.infoName] = this.ctx.getCoinName(coin);
      info[this.infoLandscape] = this.ctx.getLandscape(coin);
      info[this.infoCompanyName] = this.ctx.getCompanyName(coin);
      info[this.infoBrandIcon] = this.ctx.getBrandIcon(coin);
      info[this.infoCoinColor] = this.ctx.getCoinColor(coin);
      infos[coin] = info;
      console.log('Info --> ', info);

      // Create Feature
      var coinLocations = this.ctx.getCoinLocations(coin);
      for (let loc of coinLocations) {
        var feature = {};
        feature[this.featurePosition] = new google.maps.LatLng(loc.lat, loc.lng);
        feature[this.featureType] = coin;
        feature[this.featureAddress] = loc.address;
        features.push(feature);
      }
    }
    console.log('Infos : ', infos);
    console.log('Features : ', features);


    // Create markers
    var self = this;
    features.forEach(function(feature) {
      //console.log('Feature : ', feature);
      let localInfos = infos[feature[self.featureType]];
      if(localInfos) {

          // console.log('LLL : ', localInfos[self.infoIcon]);

          var marker = new google.maps.Marker({
            position: feature[self.featurePosition],
            icon: localInfos[self.infoIcon],
            // icon: localIcon,
            map: self.map
          });

          self.addInfoWindowToMarker(
            marker,
            self.createCoinMarkerContent(localInfos, feature[self.featureAddress], feature[self.featurePosition]),
            feature[self.featureType]
          );


      }
      else {
        console.log('No infos : ', feature[self.featureType]);
      }

    });


    console.log('Close initCoinMarkers');

  }


  // Add my positionMarker on the map
  addMyPosition() {

    this.closeAllInfoWindows();

    this.positionMarker = new google.maps.Marker({
        map: this.map,
        draggable: false,
        animation: google.maps.Animation.BOUNCE // BOUNCE vs DROP
        // position: latLong
      }
    );

    this.placeMyPositionMarker(this);

  }


  // Replace my position marker on the image (refresh)
  placeMyPositionMarker(self: any) {
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

      self.positionMarker.setPosition(locPos);

      if(self.positionMarker){
        self.animateMyPositionMarker(self);
      }

      self.loading.dismiss();

    }, (err) => {
      console.log(err);
      self.loading.dismiss();
    });

  }



  animateMyPositionMarker(self: any) {
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



  addInfoWindowToMarker(marker: any, infoWindowContent: string, coinContractAddress: string) {
    var infoWindow = new google.maps.InfoWindow({
      content: infoWindowContent
    });

    google.maps.event.addListenerOnce(infoWindow, 'domready', () => {
      document.getElementById('myid').addEventListener('click', () => {

        console.log('ItemTapped : ',coinContractAddress);
        this.navCtrl.push(ItemDetailPage, {
          coinContractAddress : coinContractAddress
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


  createCoinMarkerContent(coinInfo: any, address: string, position: any): string {
    let landscape = coinInfo[this.infoLandscape];
    let brandIcon = coinInfo[this.infoBrandIcon];
    let companyName = coinInfo[this.infoCompanyName];
    let clickableAddress = "https://www.google.com/maps/?q="+position.lat()+","+position.lng();
    let buttonColor = coinInfo[this.infoCoinColor];
    console.log('Open createCoinMarkerContent : ', landscape, ', ', brandIcon, ', ', companyName, ', ', address, ', ', position, ', ', clickableAddress, ', ', buttonColor);

    if (!landscape) {landscape = "assets/images/default_images/defaultLandscape.png";}
    if (!brandIcon) {brandIcon = "assets/images/default_images/defaultBrandIcon.png";}

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
