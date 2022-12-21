import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Tache } from 'src/app/model/tache';
import { TachesService } from 'src/app/service/taches.service';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-taches',
  templateUrl: './taches.component.html',
  styleUrls: ['./taches.component.css']
})

export class TachesComponent implements OnInit {
  tachesUndefined: Array<Tache> = [];
  tachesEnAttente: Array<Tache> = [];
  tachesEnCours: Array<Tache> = [];
  tachesTermine: Array<Tache> = [];

  newTacheUndefined: Tache = {
    titre: '',
    termine: false,
    statut: "Undefined"
  };
  newTacheEnAttente: Tache = {
    titre: '',
    termine: false,
    statut: "En attente"
  };
  newTacheEnCours: Tache = {
    titre: '',
    termine: false,
    statut: "En cours"
  };
  newTacheTermine: Tache = {
    titre: '',
    termine: false,
    statut: "Termine"
  };


  constructor(private tacheService: TachesService, private router: Router, private userService: UserService) { }

  ngOnInit() {
    this.tacheService.getTaches().subscribe({
      next: (data: Array<Tache>) => {
        data.forEach(tache => {
          switch (tache.statut) {
            case "Undefined":
              this.tachesUndefined.push(tache);
              break;
            case "En attente":
              this.tachesEnAttente.push(tache);
              break;
            case "En cours":
              this.tachesEnCours.push(tache);
              break;
            case "Termine":
              this.tachesTermine.push(tache);
              break;
            default:
              console.log("Problème switch case taches.components");
              break;
          }
        });
      }
    });
  }
  ajouterUndefined() {
    this.tacheService.ajoutTaches(this.newTacheUndefined).subscribe({
      next: (data) => {
        this.tachesUndefined.push(data);
      }
    });
  }
  ajouterEnAttente() {
    this.tacheService.ajoutTaches(this.newTacheEnAttente).subscribe({
      next: (data) => {
        this.tachesEnAttente.push(data);
      }
    });
  }
  ajouterEnCours() {
    this.tacheService.ajoutTaches(this.newTacheEnCours).subscribe({
      next: (data) => {
        this.tachesEnCours.push(data);
      }
    });
  }
  ajouterTermine() {
    this.tacheService.ajoutTaches(this.newTacheTermine).subscribe({
      next: (data) => {
        this.tachesTermine.push(data);
      }
    });
  }
  supprimer(tache: Tache) {
    this.tacheService.removeTaches(tache).subscribe({
      next: (data) => {
        this.tachesUndefined = this.tachesUndefined.filter(e => tache._id != e._id);
        this.tachesEnAttente = this.tachesEnAttente.filter(e => tache._id != e._id);
        this.tachesEnCours = this.tachesEnCours.filter(e => tache._id != e._id);
        this.tachesTermine = this.tachesTermine.filter(e => tache._id != e._id);
      }
    });
  }
  modifier(tache: Tache) {
    tache.termine = !tache.termine;
    this.tacheService.updateTaches(tache);
  }
  loggout() {
    this.userService.logout().subscribe(() => {
      this.router.navigate(['']);
    })
  }

}

