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
        case "Undefined":
          return value.filter(tache => tache.statut == "Undefined");
        case "En attente":
          return value.filter(tache => tache.statut == "En attente");
        case "En cours":
          return value.filter(tache => tache.statut == "En cours");
        case "Termine":
          return value.filter(tache => tache.statut == "Termine");
        default:
          return value;
      }
    }
  }
}
