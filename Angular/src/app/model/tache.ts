export interface Tache {
    _id?: string;
    titre: string;
    termine: boolean;
    statut : string;
}

export interface ListeTaches {
    titreListe: string;
    titreTache: string;
    taches : Array<Tache>;
}
