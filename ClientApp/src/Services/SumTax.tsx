import { IPricesByTypes } from "../Types/IPricesByTypes"

export const pricesByTypes: IPricesByTypes[] = [
    { type: 1, value: "prix_unitaire_enseigne_non_lumineuse" },
    { type: 2, value: "prix_unitaire_enseigne_lumineuse" },
    { type: 3, value: "prix_unitaire_enseigne_clignotante" },
    { type: 4, value: "prix_unitaire_panneau_non_lumineux" },
    { type: 5, value: "prix_unitaire_panneau_lumineux" },
    { type: 6, value: "prix_unitaire_panneau_a_defilement" }
]

export const SumTax = (exercice: number, quantite: number, surface: number, face: number, typePub: number, tarifs: any) => {
    const data = pricesByTypes.find((element: IPricesByTypes) => element.type == typePub)?.value
    if (data != undefined) {
        if (exercice == null)
            return 0
        const price = (surface * tarifs.find((tarif: any) => tarif.exerciceId == exercice)[data]) * quantite * face
        return !isNaN(price) ? price.toFixed(2) : 0
    } else {
        return 0
    }
}

export const GetPricesByYear = (allprices: any, yearId: number) => {
    const prices = allprices.find((price: any) => price.exerciceId == yearId)

    let aa: any = {}
    if (prices != undefined) {
        for (const [key, value] of Object.entries(prices)) {
            const type = pricesByTypes.find((type: IPricesByTypes) => type.value == key)?.type
            if (type != undefined) {
                aa[type] = value
            }
        }
        return aa
    } else {
        return {}
    }
}