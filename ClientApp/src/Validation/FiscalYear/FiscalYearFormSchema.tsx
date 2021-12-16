import * as yup from 'yup'

export const FiscalYearFormSchema = yup.object().shape({
    annee_exercice: yup.string().required("Veuillez sélectionner une année d'exercice"),
    date_echeance: yup.string().required("Veuillez définir une date d'échéance").test("La date d'échéance se trouve dans l'année d'exercice", "L'année de la date d'échéance doit être la même que l'année d'exercice", (value: any, context: any) => {
        const annee_exercice = new Date(context.options.parent.annee_exercice).getFullYear()
        const currentYear = new Date(value).getFullYear()
        if (currentYear != annee_exercice) {
            return false
        }
        return true
    }
    ).test("La date d'échéance n'est pas inférieure à la date du jour", "La date d'échéance ne peut pas être inférieur à la date du jour", (value: any) => {
        const today = new Date().getDate()
        const date_echeance = new Date(value).getDate()
        if (date_echeance < today) {
            return false
        }
        return true
    }),
    date_reglement_taxe: yup.string().required("Veuillez saisir une date limite de règlement")
});