import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';

/*
  Generated class for the FidapiProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/

@Injectable()
export class FidapiProvider {

  proxyURL: string = '';
  apiURL: string;

  idToken: string;

  authenticateURL : string = 'auth';
  createWalletURL : string = 'wallet';
  transferURL : string = 'transfer';
  requestAnswer: Observable<any>;

  constructor(
    public http: Http
  ) {
    console.log('Hello FidapiProvider Provider');

  }

  setProxyUrl(proxyUrl: string) {
    this.proxyURL = proxyUrl;
  }

  setApiUrl(apiUrl: string) {
    this.apiURL = apiUrl;
  }


  authenticate(uid: string) : Promise<any> {
    console.log('Open FidApi - authenticate : ', uid);
    var self = this;
    return new Promise((resolve, reject) => {
      var postContent = JSON.stringify({
        'uid' : uid
      });
      var postHeaders = new Headers({
        'Content-Type': 'application/json'
      });
      var postOptions = new RequestOptions({ headers: postHeaders });
      self.requestAnswer = self.http.post(
        // self.apiURL.concat(self.authenticateURL),
        self.proxyURL.concat(self.apiURL, self.authenticateURL),
        postContent,
        postOptions
      );
      self.requestAnswer
        .map(res => res.json())
        .subscribe(data => {
          console.log('FidAPI authenticated: ', JSON.stringify(data) );
          self.idToken = data['token'];
          resolve(data);
        },
        err => {
          console.log('FidAPI failed authenticating',err);
          reject(err);
        });
    });
  }

  createWallet(uid: string, myAddress : string) : Promise<any> {
    console.log('Open FidApi - createWallet : ', uid);
    var self = this;
    return new Promise((resolve, reject) => {
      if(self.idToken) {
        self.createWallet_real(myAddress).then((res) => {resolve(res);}).catch((err)=>{reject(err);});
      }
      else {
        self.authenticate(uid).then((res) => {
          self.createWallet_real(myAddress).then((res) => {resolve(res);}).catch((err)=>{reject(err);});
        }).catch((err)=>{reject(err);});
      }
    });
  }

  createWallet_real(myAddress : string) : Promise<any> {
    console.log('Open FidApi - createWallet_real : ', myAddress, 'with idToken: ', this.idToken);
    var self = this;
    return new Promise((resolve, reject) => {
      var postContent = JSON.stringify({
        'address' : myAddress
      });
      var postHeaders = new Headers({
        'Access-Control-Allow-Origin': 'http://localhost:8100/',
        'Content-Type': 'application/json',
        'x-token': self.idToken
      });
      console.log('Headers : ', postHeaders);
      var postOptions = new RequestOptions({ headers: postHeaders });
      self.requestAnswer = self.http.post(
        self.proxyURL.concat(self.apiURL, self.createWalletURL),
        postContent,
        postOptions
      );
      self.requestAnswer
        .map(res => res.json())
        .subscribe(data => {
          console.log('FidAPI created wallet: ', JSON.stringify(data) );
          resolve(data);
        },
        err => {
          console.log('FidAPI failed creating wallet',err);
          reject(err);
        });
    });
  }

  transferCoins(
    uid: string,
    coinContractAddress : string,
    fromAddress : string,
    toAddress : string,
    amount : number,
    transaction : any
  ): Promise<any> {
    console.log('Open FidApi - transferCoins : ', uid);
    var self = this;
    return new Promise((resolve, reject) => {
      if(self.idToken) {
        self.transferCoins_real(
          coinContractAddress,
          fromAddress,
          toAddress,
          amount,
          transaction
        ).then((res) => {resolve(res);}).catch((err)=>{reject(err);});
      }
      else {
        self.authenticate(uid).then((res) => {
          self.transferCoins_real(
            coinContractAddress,
            fromAddress,
            toAddress,
            amount,
            transaction
          ).then((res) => {resolve(res);}).catch((err)=>{reject(err);});
        }).catch((err)=>{reject(err);});
      }
    });
  }

  transferCoins_real(
    coinContractAddress : string,
    fromAddress : string,
    toAddress : string,
    amount : number,
    transaction : any
  ): Promise<any> {

    console.log('Open FidApi - transferCoins_real with idToken: ', this.idToken);
    var self = this;
    return new Promise((resolve, reject) => {
      var postContent = {
        'token' : coinContractAddress,
        'from' : fromAddress,
        'to' : toAddress,
        'amount' : parseInt(amount.toString()),
        'transaction' : transaction
      };
      var postHeaders = new Headers({
        'Content-Type': 'application/json',
        'x-token': self.idToken
      });
      var postOptions = new RequestOptions({ headers: postHeaders });
      console.log('TransferCoins on fidAPI with postContent : ', postContent, ' and postHeaders : ', postHeaders, ' and postOptions : ',postOptions);
      self.requestAnswer = self.http.post(
        self.proxyURL.concat(self.apiURL, self.transferURL),
        postContent,
        postOptions
      );
      self.requestAnswer
        .map(res => res.json())
        .subscribe(data => {
          console.log('FidAPI transferred coins: ', JSON.stringify(data) );
          console.log('Close transferCoins');
          resolve(data);
        },
        err => {
          console.log('FidAPI failed transfering coins',err);
          console.log('Close transferCoins');
          reject(err);
        });
    });
  }

}
