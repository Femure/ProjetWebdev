import { Component, OnInit } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Router } from '@angular/router';
import { Tache, ListeTaches } from 'src/app/model/tache';
import { TachesService } from 'src/app/service/taches.service';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-taches',
  templateUrl: './taches.component.html',
  styleUrls: ['./taches.component.css']
})

export class TachesComponent implements OnInit {

  titreListe: string = "";

  baseListeTaches: Array<ListeTaches> = []


  constructor(private tacheService: TachesService, private router: Router, private userService: UserService) { }

  ngOnInit() {
    this.tacheService.getTaches().subscribe({
      next: (listeTaches) => {

      }
    });
  }

  ajouterListeTaches() {
    let newListeListeTaches: ListeTaches = { //on creer une nouvelle liste de taches à chaque fois
      titreListe: "",
      titreTache: "",
      taches: []
    }

    let listeExisteDeja = this.baseListeTaches.filter(liste => liste.titreListe == this.titreListe);
    if (listeExisteDeja.length == 0) { //on regarde si la liste qu'on veut créer n'existe pas déjà 
      this.tacheService.getTaches().subscribe({
        next: (listeTaches) => {
          let listeTachesFiltred = listeTaches.filter(tache =>
            tache.statut == this.titreListe)
          newListeListeTaches.taches = listeTachesFiltred;
          newListeListeTaches.titreListe = this.titreListe;
          if (listeTachesFiltred.length == 0) { //le statut n'exite pas dans la liste
            this.baseListeTaches.push(newListeListeTaches);
          }
        }
      });
    }

  }

  ajouterTache(listeTaches : ListeTaches) {
    let newTache: Tache = { //on créer une nouvelle tache dès qu'on l'ajoute
      titre: listeTaches.titreTache,
      termine: false,
      statut: ""
    };
    this.tacheService.ajoutTaches(newTache).subscribe({
      next: (data) => {
        this.baseListeTaches.forEach(liste => {
          if (liste.titreListe == listeTaches.titreListe) {
            liste.taches.push(data);
          }
        })
      }
    });
  }

  supprimerListeTache(listeTaches: ListeTaches) {
    listeTaches.taches.forEach(tache => {
      this.tacheService.removeTaches(tache).subscribe({});
    });
    this.baseListeTaches = this.baseListeTaches.filter(liste => liste.titreListe != listeTaches.titreListe);
  }

  supprimerTache(listeTaches: ListeTaches, tache: Tache) {
    this.tacheService.removeTaches(tache).subscribe({
      next: () => {
        listeTaches.taches = listeTaches.taches.filter(e => tache._id != e._id);
      }
    });
  }

  modifier(tache: Tache) {
    tache.termine = !tache.termine;
    this.tacheService.updateTaches(tache).subscribe({});
  }
  loggout() {
    this.userService.logout().subscribe(() => {
      this.router.navigate(['']);
    })
  }

  drop(event: CdkDragDrop<Array<Tache>>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }
    event.item.data.statut = event.container.data[0].statut;
    this.tacheService.updateTaches(event.item.data).subscribe({});
  }
}
