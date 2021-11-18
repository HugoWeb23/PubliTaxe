import { ICode_postal } from "./ICode_postal";

export interface ENames {
    matricule_ciger: number,
    nom: string
}

export interface Entreprise {
        matricule_ciger: number,
        numero_localite: number,
        nom: string,
        code_rue: number,
        adresse_rue: string,
        adresse_numero: string,
        adresse_boite: number,
        adresse_index: string,
        numero_telephone: string,
        numero_fax: string,
        numero_tva: string,
        recu: number,
        province: number,
        personne_contact: string,
        telephone_contact: string,
        mail_contact: string,
        pourcentage_majoration: number,
        motif_majoration: number,
        code_rue_taxation: number,
        adresse_taxation: string,
        adresse_numero_taxation: number,
        adresse_boite_taxation: number,
        adresse_index_taxation: string,
        adresse_code_postal_taxation: number,
        adresse_localite_taxation: string,
        commentaire_taxation: string,
        role_linguistique: number
        code_postal: ICode_postal
}