import { IPays } from "./IPays";

export interface ICode_postal {
    code_postalId?: number,
    numero_localite: number,
    paysId: number,
    cp: string,
    localite: string,
    pays: IPays
}