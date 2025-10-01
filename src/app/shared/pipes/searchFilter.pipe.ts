import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment'

@Pipe({
  standalone: true,
  name: 'filter'
})
export class SearchFilterPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if (!args) {
      return value;
    }
    return value.filter((val: any) => {
      let rVal = (val.contactName.toLocaleUpperCase().includes(args)) || (val.email.toLocaleLowerCase().includes(args));
      return rVal;
    })

  }
}