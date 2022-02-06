import { ICode_postal } from "./ICode_postal";
import { IPubliciteSimulation } from "./IPubliciteSimulation";

export interface ISimulation {
        numero_localite: number,
        nom: string,
        code_rue: number,
        adresse_rue: string,
        adresse_numero: string,
        adresse_boite: number,
        adresse_index: string,
        numero_telephone: string,
        numero_tva: string,
        mail_contact: string,
        commentaire_taxation: string,
        role_linguistique: number
        code_postal: ICode_postal,
        publicites: IPubliciteSimulation[]
}