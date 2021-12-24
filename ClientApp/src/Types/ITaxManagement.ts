import { IApercu_entreprise } from "./IApercu_entreprise";

export interface ITaxManagement {
    entreprises: IApercu_entreprise[],
    totalPages: number,
    pageCourante: number,
    totalRecus: number,
    totalEntreprises: number,
    totalElements: number,
    elementsParPage: number
}