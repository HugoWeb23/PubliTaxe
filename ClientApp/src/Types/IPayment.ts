export interface IPayment {
    id_paiement: number,
    id_entreprise: number,
    exerciceId: number,
    montant: number,
    mode_paiement: number,
    remarque: string,
    date: string
}