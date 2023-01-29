import { Entreprise } from "./IEntreprise";
import { IPayment } from "./IPayment";

export interface IPaymentDetails {
    entreprise: Entreprise,
    taxe: number,
    montant_majoration: number,
    taxe_totale: number,
    paiements: IPayment[]
}