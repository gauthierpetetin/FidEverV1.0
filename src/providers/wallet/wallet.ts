import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

import { ContextProvider} from '../../providers/context/context';

import { FidapiProvider } from '../../providers/fidapi/fidapi';
import { EthapiProvider } from '../../providers/ethapi/ethapi';

/*
  Generated class for the WalletProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class WalletProvider {

  constructor(
    public http: Http,
    public ctx: ContextProvider,
    public fidapiProvider: FidapiProvider,
    public ethapiProvider: EthapiProvider
  ) {
    console.log('Hello WalletProvider Provider');
  }


  createGlobalEthWallet(uid: string, passPhrase: string):Promise <any> {
    console.log('Open createGlobalEthWallet');
    var self = this;
    return new Promise((resolve,reject) => {

      self.ctx.init(uid, false, false, false).then( () => {
        console.log('Init config success');

        //Ethereum account creation
        self.createLocalEthWallet(passPhrase).then( (nAddress) => {
          console.log('Local wallet creation success : ', nAddress);
          self.fidapiProvider.createWallet(uid, nAddress).then( () => {
            console.log('FidApi signup success');
            resolve();
          }, (fidApiSignupError) => {
            console.log('Signup error on Firestore database : ', fidApiSignupError);
            reject(fidApiSignupError);
          }
          );
        }, (ethAPIError) => {
          console.log('Wallet creation error : ', ethAPIError);
          reject(ethAPIError);
          });
        //End of Ethereum account creation

      }).catch( (err) => {
        console.log('createGlobalEthWallet init error: ', err.text);
        reject(err);
      });

    });

  }

  createLocalEthWallet(passPhrase: string):Promise <any> {
    console.log('Open createLocalEthWallet');
    var ethAccount: {
      address: string,
      privateKey : string
    };

    var self = this;
    return new Promise((resolve,reject) => {
      // create Ethereum address + private key couple
      ethAccount = self.ethapiProvider.createAccount(passPhrase);
      console.log('Ethereum IDs created: '.concat(JSON.stringify(ethAccount)));

      self.ctx.setAddress(ethAccount.address);
      self.ctx.setPrivateKey(ethAccount.privateKey);

      // set the Ethereum IDs in the device
      self.ctx.save().then( () => {
        console.log('Ethereum IDs stored in storage');
        resolve(ethAccount.address);
      }, (ctxSaveError) => {
          console.log('Error saving EthAccount in storage');
          reject(ctxSaveError);
        }
      );

    });

  }

}
