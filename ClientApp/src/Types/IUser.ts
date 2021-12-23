export interface IUser {
    id: number,
    nom: string,
    prenom: string,
    mail: string,
    actif: number,
    role: number,
    changement_pass: number,
    token: string
}