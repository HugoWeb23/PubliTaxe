import { IRue } from "./IRue";

export interface IPubliciteSimulation {
    id : number,
    id_rue?: number,
    rue: IRue
    type_publicite: number
    adresse_numero: string,
    situation: string,
    quantite: number,
    face: number,
    mesure: string,
    surface: number,
    surface_totale?: number
    exoneration: boolean,
    pv: number,
    uuid: string
}