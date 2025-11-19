import { inject, Injectable } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

import { Builder, Form } from './builder';
import { ConfigOnSubmit } from './model';

type FnFormStructure<T> = {
  [K in keyof T]: T[K] extends object 
    ? { [M in keyof T[K]]: Form<any> }
    : Form<any> 
}

type FormStructure<T> = {
  [K in keyof T]: T[K] extends object 
    ? { [M in keyof T[K]]: AbstractControl<any, any, any> }
    : AbstractControl<any, any, any>
}
/**
 * Forms
 */
@Injectable({
  providedIn: 'root',
})
export abstract class Forms {

  /**
   * builder
   */
  protected readonly builder = inject(Builder);

  /**
   * route
   */
  protected readonly router = inject(Router);

  /**
   * forms
   */
  //abstract readonly forms: { [key: string] : AbstractControl<any, any, any> }

  /**
   * create
   */
  public createFn<T>(
    fn: (builder: Builder) => FnFormStructure<T>
  ): FormStructure<T> {

    const group = fn(this.builder);
    const newGroup: FormStructure<T> = {} as FormStructure<T>;

    for (const key in group) {
      if (group.hasOwnProperty(key)) { 
        for (const key2 in group[key]) {
          if (group[key].hasOwnProperty(key2) && group[key][key2] instanceof Form) {
            //newGroup[key][key2] = group[key][key2].form();
          } else if (group[key].hasOwnProperty(key2) && group[key][key2] instanceof AbstractControl){
            //newGroup[key][key2] = group[key][key2];
          }
        }
        //newGroup[key] = this.builder.group(newGroup[key]);
      }
    }

    return newGroup
  }


  constructor() {
  }

  /**
   * reset
   */
  protected reset() {
    /*for (const key in this.forms) {
      if (this.forms.hasOwnProperty(key)) {
        this.forms[key].markAsUntouched();
        this.forms[key].reset();
      }
    }*/
  }

  /**
   * complete
   */
  protected complete(route?: string) {
    this.reset();
    if (route) {
      this.router.navigate([route]);
    }
  }

  /**
   * 
   */
  //abstract onSubmit(config: ConfigOnSubmit): void;

}
