import { IPhoto } from "./IPhoto";
import { IRue } from "./IRue";

export interface IPublicite {
    numero_panneau : number,
    matricule_ciger : number,
    id_rue?: number,
    rue: IRue
    exercice_courant: number,
    type_publicite: number
    adresse_numero: string,
    situation: string,
    quantite: number,
    face: number,
    mesure: string,
    surface: number,
    surface_totale?: number
    taxe_totale?: number,
    code_recu: number
    exoneration: number,
    pv: number,
    photos: IPhoto[]

}

export interface IPubliciteImage {
    id: number,
    numero_panneau: number,
    photo: string
}