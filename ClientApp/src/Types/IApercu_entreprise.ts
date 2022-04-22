export interface IApercu_entreprise {
    id_entreprise: number,
    matricule_ciger: number,
    nom: string,
    nombre_panneaux: number,
    recu: boolean,
    proces_verbal: boolean,
    statut_paiement: number,
    suppression: boolean
}