export interface Tache {
    _id?: string;
    titre: string;
    termine: boolean;
    statut : string;
}

export interface ListeListeTaches {
    titre: string;
    taches : Array<Tache>;
}
