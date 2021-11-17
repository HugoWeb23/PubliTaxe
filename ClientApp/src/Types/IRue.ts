import { ICode_postal } from "./ICode_postal";

export interface IRue {
    rueId?: number,
    code_postalId?: number,
    code_rue: string,
    langue: string,
    nom_rue: string,
    code_postal: ICode_postal
}