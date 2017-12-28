import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Storage } from '@ionic/storage';
import 'rxjs/add/operator/map';


import { EthapiProvider } from '../../providers/ethapi/ethapi';
import { FirestoreProvider} from '../../providers/firestore/firestore';
import { AlertProvider} from '../../providers/alert/alert';

/*
  Generated class for the ContextProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class ContextProvider {

  c: any = {};

  storageKey : string = 'storageKey';

  contractAddresses : string = 'coinsAddresses';
  names: string = 'coinNames';
  colors: string = 'coinColors';
  amounts: string = 'coinAmounts';
  icons: string = 'coinIcons';
  companyNames: string = 'companyName';
  landscapes: string = 'landscapePictures';
  brandIcons: string = 'brandIcons';
  offers: string = 'coinOffers';
    offerID = 'id';
    offerName = 'name';
    offerPrice = 'price';
  offerImages = 'coinOfferImages';
  info: string = 'accountInfo';
    infoAddress: string = 'ethAddress';
    infoPrivateKey: string = 'ethPrivateKey';
    infoEmail: string = 'email';

  ethAccount: {
      address: string,
      privateKey: string
  };

  myCoinCollectionPath: string;

  coinGlobalSubscribtion: any;

  coinDetailSubscribtions: any = {};
  coinDetailObservers: any = {};

  coinAmountSubscribtions: any = {};
  coinAmountObservers: any = {};

  coinOffersSubscribtions: any = {};
  coinOffersObservers: any = {};

  globalCoinCollectionPath: string = 'tokens/';
  defaultCoinImage: string = '';
  defaultLandscapeImage: string = '';
  defaultBrandIcon: string = '';
  fidOrange: string = '#fe9400';

  constructor(
    public http: Http,
    private storage: Storage,
    public ethapiProvider: EthapiProvider,
    public firestoreProvider: FirestoreProvider,
    public alertProvider: AlertProvider
  ) {
    console.log('Hello ContextProvider Provider');
  }

/***************SETTERS*********************/

  setAddress(address : string) {
    this.c[this.info][this.infoAddress] = address;
  }

  setPrivateKey(privateKey : string) {
    this.c[this.info][this.infoPrivateKey] = privateKey;
  }

  setEmail(email : string) {
    this.c[this.info][this.infoEmail] = email;
  }


/****************GETTERS*********************/

  getAddress(): string {
    return this.c[this.info][this.infoAddress];
  }
  getPrivateKey(): string {
    return this.c[this.info][this.infoPrivateKey];
  }
  getEmail(): string {
    return this.c[this.info][this.infoEmail];;
  }

  getCoinName(coinID : string): string {
    return this.c[this.names][coinID];
  }
  getCoinColor(coinID : string): string {
    return this.c[this.colors][coinID];
  }
  getCoinAmount(coinID : string): string {
    return this.c[this.amounts][coinID];
  }
  getCoinIcon(coinID : string): string {
    return this.c[this.icons][coinID];
  }
  getLandscape(coinID : string): string {
    return this.c[this.landscapes][coinID];
  }
  getBrandIcon(coinID : string): string {
    return this.c[this.brandIcons][coinID];
  }
  getCompanyName(coinID : string): string {
    return this.c[this.companyNames][coinID];
  }
  getOffers(coinID : string): any[] {
    return this.c[this.offers][coinID];
  }
  getOfferImages(coinID : string): any {
    return this.c[this.offerImages][coinID];
  }

  init() {
    console.log('Open init');
    this.initContext();
    this.recoverContext().then( (address) => {
      console.log('Context recovery success : ',address);
      this.recoverEthereumAccount(address);
    }, (contextError) => {
      console.log('Context recovery error : ',contextError);
    });
    console.log('Close init');
  }

  initContext() {
    console.log('Open initContext');
    if(!this.c[this.contractAddresses]){this.c[this.contractAddresses] = []}
    if(!this.c[this.names]){this.c[this.names] = {}}
    if(!this.c[this.colors]){this.c[this.colors] = {}}
    if(!this.c[this.amounts]){this.c[this.amounts] = {}}
    if(!this.c[this.icons]){this.c[this.icons] = {}}
    if(!this.c[this.landscapes]){this.c[this.landscapes] = {}}
    if(!this.c[this.brandIcons]){this.c[this.brandIcons] = {}}
    if(!this.c[this.companyNames]){this.c[this.companyNames] = {}}
    if(!this.c[this.offers]){this.c[this.offers] = {}}
    if(!this.c[this.offerImages]){this.c[this.offerImages] = {}}
    if(!this.c[this.info]){this.c[this.info] = {}}
    console.log('Close initContext');
  }

  recoverContext(): Promise<any> {
    console.log('Open recoverContext');
    var self = this;
    return new Promise(
      function(resolve, reject) {
        self.recoverDataAtKey(self.storageKey, self.c, self.contractAddresses);
        self.recoverDataAtKey(self.storageKey, self.c, self.names);
        self.recoverDataAtKey(self.storageKey, self.c, self.colors);
        self.recoverDataAtKey(self.storageKey, self.c, self.amounts);
        self.recoverDataAtKey(self.storageKey, self.c, self.icons);
        self.recoverDataAtKey(self.storageKey, self.c, self.landscapes);
        self.recoverDataAtKey(self.storageKey, self.c, self.brandIcons);
        self.recoverDataAtKey(self.storageKey, self.c, self.companyNames);
        self.recoverDataAtKey(self.storageKey, self.c, self.offers);
        self.recoverDataAtKey(self.storageKey, self.c, self.offerImages);
        self.recoverDataAtKey(self.storageKey, self.c, self.info).then( (account) => {
          //console.log('Account info recovery success : ',self.c[self.infoPrivateKey]);
          resolve(account[self.infoAddress]);
        }, (accountError) => {
          console.log('Account recovery error : ', accountError);
          reject();
        });
      });
  }

  recoverDataAtKey(key : string, receiver : any, field : string): Promise<any> {
    console.log('Open recoverDataAtKey : ',field);
    var self = this;
    return new Promise(
      function(resolve, reject) {
        self.storage.get(key).then(
          function(result : string){
            if(result != null){
              console.log('Get receiver[field] : ',field);
              if(receiver){
                if(JSON.parse(result)[field]){
                  receiver[field] = JSON.parse(result)[field];
                  console.log('Your data at field : ', field,' from storage is: ',receiver);
                  resolve(receiver[field]);
                }else{console.log('Storage error : no field in result : ',result); reject()}
              }
              else{console.log('Storage error : no receiver'); reject();}
            }
            else{
              console.log('Null storage at field');reject();
            }
          },
          function(error : any){
            console.log('Storage error for key :'.concat(key, ' with message : ', error.message)); reject();
          }
        );
      }
    );

  }

  save(): Promise<any> {
    console.log('Open saveCoins');
    var self = this;
    return new Promise(
      function(resolve, reject) {
        self.storeDataAtKey(self.storageKey, self.c).then(
          () => {
            console.log('Close SaveCoins : ', self.c);
            resolve();
          },
          (error) => {
            console.log('ERROR SaveCoins');
            reject();
          }
        );
      }
    );
  }

  clear(){
    console.log('Open clear');

    /*************DELETE-START***************/
    if(this.c[this.info]) {
      var prov_address = this.c[this.info][this.infoAddress];
      var prov_privateKey = this.c[this.info][this.infoPrivateKey];
    }
    /*************DELETE-END*****************/

    this.storage.remove(this.storageKey);
    this.c = {};
    this.coinDetailObservers = null;
    this.coinAmountObservers = null;
    this.initContext();

    /*************DELETE-START***************/
    this.c[this.info][this.infoAddress] = prov_address;
    this.c[this.info][this.infoPrivateKey] = prov_privateKey;
    /*************DELETE-END*****************/

    this.save();
    console.log('Close clear');
  }

  storeDataAtKey(key : string, data : any): Promise<any> {
    console.log('Open storeDataAtKey');
    var self = this;
    return new Promise(
      function(resolve, reject) {
        self.storage.set(key, JSON.stringify(data)).then(
          () => {
            console.log('Close storeDataAtKey');
            resolve();
          },
          (error) => {
            console.log('ERROR : storeDataAtKey');
          });
      }
    );

  }

/******************************************************************************/
/******************************************************************************/
/******************************************************************************/
/******************************************************************************/
/******************************************************************************/
/******************************************************************************/




recoverEthereumAccount(address : string) {
  console.log('Open recoverEthereumAccount : ', address);

  if(address != null){
    this.initCoinCollectionPath(address);

    this.getCoinList();
  }
  else {
    console.log('NO ETHEREUM ACCOUNT');
    //--------------------------------------------
    //-------RECLAMER LA CLE A L API--------------
    //--------------------------------------------
  }

  console.log('Close recoverEthereumAccount');
}

initCoinCollectionPath(ethAccountAddress : string) {
  if(ethAccountAddress){
    this.myCoinCollectionPath = 'wallets/'.concat(ethAccountAddress,'/tokens');
    console.log('myCoinCollectionPath : '.concat(this.myCoinCollectionPath));
  }
  else{
    console.log('myCoinCollectionPath : None');
  }
}

getCoinList() {
  console.log('Open getCoinList');

  if(this.myCoinCollectionPath){
    console.log('Launch firestoreProvider');
    //Subscribtion security
    if(this.coinGlobalSubscribtion){this.coinGlobalSubscribtion.unsubscribe();console.log('UNSUBSCRIBE GLOBAL');}

    var self = this;
    this.coinGlobalSubscribtion = this.firestoreProvider
      .getCollection(this.myCoinCollectionPath)
      .subscribe( dbCoins => {

        console.log('DBCoins : ', dbCoins);

      if(dbCoins != null){
        var myContracts = [];

        for(let cc of dbCoins) {
          myContracts.push(cc.contract);
        }
        //Add new coins
        for(let cc of myContracts) {
          if(self.c[self.contractAddresses].indexOf(cc)<0){
            console.log('Add coin : ',cc);
            self.c[self.contractAddresses].push(cc);
          }
        }
        //Delete old coins
        for(let cc of self.c[self.contractAddresses]) {
          if(myContracts.indexOf(cc)<0){
            console.log('Remove coin : ',cc);
            self.c[self.contractAddresses].splice(self.c[self.contractAddresses].indexOf(cc),1);
            self.cleanCoin(self, cc);
          }
        }
        console.log('Coins obtained : '.concat(JSON.stringify(self.c[self.contractAddresses])) );

        self.initCoinList(self);
        console.log('Coins initialized : '.concat(JSON.stringify(self.c[self.contractAddresses])) );

        self.downloadAllInfo();
        console.log('Coins complete');

        this.save();

      }
      else{
        console.log('Null dbCoins list');
      }

    });

  }

  console.log('Close getCoinList');
}

cleanCoin(self : any, cc : string) {
  console.log('Open cleanCoin');
  var delta : number = parseInt(self.c[self.amounts][cc]);
  if(delta > 0){
    self.alertProvider.sendAlert(delta, self.getCoinName(cc));
  }
  else if (delta < 0){
    console.log('ERROR : Negative amount of coins')
  }
  self.c[self.names][cc] = undefined;
  self.c[self.colors][cc] = undefined;
  self.c[self.amounts][cc] = 0;
  self.c[self.icons][cc] = undefined;
  self.c[self.landscapes][cc] = undefined;
  self.c[self.brandIcons][cc] = undefined;
  self.c[self.companyNames][cc] = undefined;
  self.c[self.offers][cc] = undefined;
  self.c[self.offerImages][cc] = undefined;
  self.coinDetailSubscribtions[cc] = undefined;
  self.coinDetailObservers[cc] = undefined;
  self.coinAmountSubscribtions[cc] = undefined;
  self.coinAmountObservers[cc] = undefined;
  console.log('Close cleanCoin');
}

initCoinList(self : any) {
  console.log('Open initCoinList');

  for(let cc of self.c[self.contractAddresses]) {
    if(!self.c[self.names][cc]) {
      console.log('No name');
      self.c[self.names][cc] = '';
    }
    else { console.log('Already a name : ',self.c[self.names][cc]) }

    if(!self.c[self.colors][cc]) {
      console.log('No color');
      self.c[self.colors][cc] = self.fidOrange;
    }
    else{console.log('Already a color : ',self.c[self.colors][cc])}

    if(!self.c[self.amounts][cc]) {
      console.log('No amount');
      self.c[self.amounts][cc] = 0;
    }
    else{console.log('Already an amount : ',self.c[self.amounts][cc])}

    if(!self.c[self.icons][cc]) {
      console.log('No icon');
      self.c[self.icons][cc] = self.defaultCoinImage;
    }
    else {console.log('Already an icon');}

    if(!self.c[self.landscapes][cc]) {
      console.log('No landscape');
      self.c[self.landscapes][cc] = self.defaultLandscapeImage;
    }
    else {console.log('Already a landscape');}

    if(!self.c[self.brandIcons][cc]) {
      console.log('No brandIcon');
      self.c[self.brandIcons][cc] = self.defaultBrandIcon;
    }
    else {console.log('Already a brandIcon');}

    if(!self.c[self.companyNames][cc]) {
      console.log('No company name');
      self.c[self.companyNames][cc] = '';
    }
    else { console.log('Already a company name : ',self.c[self.companyNames][cc]) }

    if(!self.c[self.offers][cc]) {
      console.log('No offers');
      self.c[self.offers][cc] = {};
    }
    else {console.log('Already offers');}

    if(!self.c[self.offerImages][cc]) {
      console.log('No offerImages');
      self.c[self.offerImages][cc] = {};
    }
    else {console.log('Already offerImages');}

  }

  console.log('Close initCoinList');
}

downloadAllInfo() {
  console.log('Open downloadAllInfo');
  if(!this.coinDetailObservers) {
    this.coinDetailObservers = {};
  }
  if(!this.coinAmountObservers) {
    this.coinAmountObservers = {};
  }

  for(let cc of this.c[this.contractAddresses]) {
    this.downloadAllInfoForCoin(cc);
  }
  console.log('Close downloadAllInfo');
}

downloadAllInfoForCoin(cc: string) {
  //Get coin details
  this.downloadCoinDetails(cc);

  // Download coin amounts
  this.downloadCoinAmounts(cc);

  // Download coin icons
  this.downloadCoinIcons(cc);

  // Download landscape images
  this.downloadLandscapeImages(cc);

  // Download brand icons
  this.downloadBrandIcons(cc);

  // Download offers list
  this.downloadOffers(cc);

}

downloadCoinDetails(cc: string) {
  //Get coin details
  var self = this;
  if(!self.coinDetailObservers[cc]) {
    console.log('CreateCoinDetailObserver');
    //Unsubscribtion security
    if(self.coinDetailSubscribtions[cc]){self.coinDetailSubscribtions[cc].unsubscribe();console.log('UNSUBSCRIBE DETAIL');}

    self.coinDetailObservers[cc] = self.firestoreProvider.getDocument(self.globalCoinCollectionPath.concat(cc));
    self.coinDetailSubscribtions[cc] = self.coinDetailObservers[cc]
      .subscribe((coinDetails) => {
        self.c[self.names][cc] = coinDetails['name'];
        self.c[self.colors][cc] = coinDetails['color'];
        self.c[self.companyNames][cc] = coinDetails['company'];
        console.log('CoinDetails for ', self.c[self.names][cc], ' : ', coinDetails);
        self.save();
    });
  }
  else{
    console.log('CoinDetailObserver already exists : ', self.c[self.names][cc], ', ', self.c[self.colors][cc]);
  }
}

downloadCoinAmounts(cc: string) {
  //Get amounts
  var self = this;
  if(!self.coinAmountObservers[cc]) {
    console.log('CreateCoinAmountObserver');
    //Unsubscribtion security
    if(self.coinAmountSubscribtions[cc]){self.coinAmountSubscribtions[cc].unsubscribe();console.log('UNSUBSCRIBE AMOUNT');}

    self.coinAmountObservers[cc] = self.firestoreProvider.getDocument(self.myCoinCollectionPath.concat('/',cc));
    self.coinAmountSubscribtions[cc] = self.coinAmountObservers[cc]
      .subscribe((coin_a) => {
        //Show alert
        var delta : number = parseInt(coin_a['balance']) - parseInt(self.c[self.amounts][cc]);
        if(delta > 0){
          self.alertProvider.receiveAlert(delta, self.c[self.names][cc]);
        }
        else if (delta < 0){
          //self.alertProvider.sendAlert(-delta, self.c[self.names][cc]);
        }
        //Update amount
        self.c[self.amounts][cc] = coin_a['balance'];
        console.log('CoinAmount 2 : ',self.c[self.amounts][cc]);
        self.save();
    });
  }
  else{
    console.log('CoinAmountObserver already exists :');
  }
}

downloadCoinIcons(cc: string) {
  // Download coin icons
  var self = this;
  self.firestoreProvider.downloadImageAtPath('coinIcons/'.concat(cc,'.png')).then(
    function(result : string){
      self.c[self.icons][cc] = result;
      console.log(cc.concat(' image added to coinIcons: ',''/*JSON.stringify(self.c[self.icons])*/));
    },
    function(error : any){
      console.log(cc.concat(' image not added to coinIcons. Error: ',error.message));
    }
  );
}

downloadLandscapeImages(cc: string) {
  // Download landscape image
  var self = this;
  self.firestoreProvider.downloadImageAtPath('landscapes/'.concat(cc,'.png')).then(
    function(result : string){
      self.c[self.landscapes][cc] = result;
      console.log(cc.concat(' image added to landscapePictures : ',self.c[self.landscapes][cc] ));
    },
    function(error : any){
      console.log(cc.concat(' image not added to landscapePictures. Error: ',error.message));
    }
  );
}

downloadBrandIcons(cc: string) {
  // Download brand icons
  var self = this;
  self.firestoreProvider.downloadImageAtPath('brandIcons/'.concat(cc,'.png')).then(
    function(result : string){
      self.c[self.brandIcons][cc] = result;
      console.log(cc.concat(' image added to brandIcons : ',self.c[self.brandIcons][cc] ));
    },
    function(error : any){
      console.log(cc.concat(' image not added to brandIcons. Error: ',error.message));
    }
  );
}

downloadOffers(cc: string) {

  var offersCollectionPath: string = this.offersCollectionPathForCoin(cc);
  console.log('Open downloadOffersList : ', offersCollectionPath);

  if(offersCollectionPath){
    //Get coin offers
    var self = this;
    if(!self.coinOffersObservers[cc]) {
      console.log('CreateCoinOffersObserver');
      //Unsubscribtion security
      if(self.coinOffersSubscribtions[cc]){self.coinOffersSubscribtions[cc].unsubscribe();console.log('UNSUBSCRIBE OFFERS');}

      self.coinOffersObservers[cc] = self.firestoreProvider.getCollection(offersCollectionPath);
      self.coinOffersSubscribtions[cc] = self.coinOffersObservers[cc]
        .subscribe((coinOffers) => {
          var localOffersList: any [] = [];
          for(let off of coinOffers) {
            if(off) {
              console.log('OFI : ', off);
              localOffersList.push(off);
              self.downloadOfferImage(off[self.offerID], cc);
            }
          }
          self.c[self.offers][cc] = localOffersList;
          console.log('CoinOffers for ', self.c[self.names][cc], ' : ', coinOffers);
          self.save();
      });
    }
    else{
      console.log('CoinOffersObserver already exists : ', self.c[self.names][cc]);
    }
  }
}

downloadOfferImage(offerID: any, coinID: string) {
  var self = this;
  this.firestoreProvider.downloadImageAtPath('offers/'.concat(coinID,'/',offerID,'.png')).then(
    function(result : string){
      self.c[self.offerImages][coinID][offerID] = result;
      console.log(coinID.concat('image added to offerImages : ',self.c[self.offerImages][coinID] ));
    },
    function(error : any){
      console.log(coinID.concat('image not added to offers. Error: ',error.message));
    }
  );
}

offersCollectionPathForCoin(coinID: string): string {
  return ''.concat('tokens/', coinID, '/offers');
}

addCoin() {
  var newCoin = {
      balance : 0,
      address : 'Coin',
      coinColor : this.fidOrange,
      coinName : ''
  };

  console.log('Open addCoin');
  if(this.myCoinCollectionPath){
    this.firestoreProvider.setDocInCollection(newCoin,this.myCoinCollectionPath).subscribe(
      (res) => {
        console.log('Coin added successfully');
      },
      (err) => {
        console.log('addCoin error : ',err);
      }
    );
    //addObserver.unsubscribe();
  }

  console.log('Close addCoin');
}

  removeCoin(coinId : string) {
    console.log('Open removeCoin');
    this.firestoreProvider.deleteDocFromCollection(coinId, this.myCoinCollectionPath);
    console.log('Close removeCoin');
  }


  updateContent() {
    // this.firestoreProvider.updateDocFromCollectionWithContent('IVC2N9q8ux2SeMcNYhAW','CoinTypes',{
    //   amount : 11
    // });
  }


}
