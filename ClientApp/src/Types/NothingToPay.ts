export interface NothingToPay {
    id_entreprise: number,
    matricule_ciger: number,
    nom: string,
    recu: boolean,
    nombre_panneaux: number,
    publicites: [{
        numero_panneau: number,
        exoneration: boolean,
        taxe_totale: number
    }]
}