export interface Tache {
    _id?: string;
    titre: string;
    termine: boolean;
    statut : string;
}

export interface ListeTache {
    titre: string;
    taches : Array<Tache>;
}
