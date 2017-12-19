import { FormControl } from '@angular/forms';

export class PhoneValidator {

  static isValid(control: FormControl){
    const re = /^(?!\s*$)[0-9]{10}$/.test(control.value); //Phone number pattern
    //const re = /^(?!\s*$)[-a-zA-Z0-9_:,.' ']{1,100}$/.test(control.value);

    if (re){
      return null;
    }

    return {
      "invalidPhone": true
    };

  }

}
