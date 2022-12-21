import { Pipe, PipeTransform } from '@angular/core';
import { Tache } from '../model/tache';

@Pipe({
  name: 'filtreTache'
})
export class FiltreTachePipe implements PipeTransform {

  transform(value: Array<Tache>, filter: string): Array<Tache> {
    if (!value) {
      return value;
    }
    else {
      switch (filter) {
        case "Tous":
          return value;
        case "Actif":
          return value.filter(tache => !tache.termine);
        case "Termine":
          return value.filter(tache => tache.termine);;
        default:
          return value;
      }
    }
  }
}
