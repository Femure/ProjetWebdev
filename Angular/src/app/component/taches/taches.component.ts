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

  baseStatuts: Array<string> = [];

  baseListeTaches: Array<ListeTaches> = [];


  constructor(private tacheService: TachesService, private router: Router, private userService: UserService) { }

  ngOnInit() {
    this.tacheService.getTaches().subscribe({ // on récupère les différents statuts dans la bd "taches" 
      next: (listeTaches) => {
        listeTaches.forEach((tache, index) => {
          if (index == 0) {
            this.baseStatuts.push(tache.statut);
          }
          else {
            let cpt = 0;
            this.baseStatuts.forEach(statut => { //on regarde pour chaque tache dans la base des statuts si le statut existe déjà ou non
              if (tache.statut == statut) {
                cpt++;
              }
            });
            if (cpt == 0) {
              this.baseStatuts.push(tache.statut);
            }
          }
        });

        
        this.baseStatuts.forEach(statut => {//pour chaque statut on va récupérer les taches ayant ce statut
          console.log("OK");
          let newListeListeTaches: ListeTaches = { //on creer une nouvelle liste de taches à chaque fois
            titreListe: statut,
            titreTache: "",
            taches: []
          }

          this.tacheService.getTaches().subscribe({
            next: (listeTaches) => {
              let listeTachesFiltred = listeTaches.filter(tache => tache.statut == statut);
              newListeListeTaches.taches = listeTachesFiltred;
              this.baseListeTaches.push(newListeListeTaches);
            }
          });
        });
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
          let listeTachesFiltred = listeTaches.filter(tache => tache.statut == this.titreListe);
          newListeListeTaches.taches = listeTachesFiltred;
          newListeListeTaches.titreListe = this.titreListe;
          if (listeTachesFiltred.length == 0) { //le statut n'exite pas dans la liste
            this.baseListeTaches.push(newListeListeTaches);
          }
        }
      });
    }

  }

  ajouterTache(listeTaches: ListeTaches) {
    let newTache: Tache = { //on créer une nouvelle tache dès qu'on l'ajoute
      titre: listeTaches.titreTache,
      termine: false,
      statut: listeTaches.titreListe
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

  drop(event: CdkDragDrop<ListeTaches>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data.taches, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data.taches,
        event.container.data.taches,
        event.previousIndex,
        event.currentIndex,
      );
    }
    event.item.data.statut = event.container.data.titreListe;
    
    this.tacheService.updateTaches(event.item.data).subscribe({});
  }
}
