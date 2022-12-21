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
  taches: Array<Tache> = [];

  newTache: Tache = {
    titre: '',
    termine: false,
    statut: "Undefined"
  };
  
  filter: string = "Undefined";

  constructor(private tacheService: TachesService, private router: Router, private userService: UserService) { }

  ngOnInit() {
    this.tacheService.getTaches().subscribe({
      next: (data: Array<Tache>) => { this.taches = data; }
    });
  }
  ajouter(value : string) {
    this.newTache.statut = value;
    this.tacheService.ajoutTaches(this.newTache).subscribe({
      next: (data) => {    
        this.taches.push(data);
      }
    });
  }
  supprimer(tache: Tache) {
    this.tacheService.removeTaches(tache).subscribe({
      next: (data) => {
        this.taches = this.taches.filter(e => tache._id != e._id);
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

