export interface IUser {
    id: number,
    nom: string,
    prenom: string,
    mail: string,
    actif: boolean,
    changement_pass: boolean,
    token: string
}