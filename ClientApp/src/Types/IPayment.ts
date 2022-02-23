export interface IPayment {
    id_paiement: number,
    matricule_ciger: number,
    exerciceId: number,
    montant: number,
    mode_paiement: number,
    remarque: string,
    date: string
}