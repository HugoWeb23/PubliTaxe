import * as yup from 'yup'

export const EncodePaymentFormSchema = yup.object().shape({
        remarque: yup.string().typeError("Le format n'est pas valide"),
        montant: yup.number().min(1, "Le montant doit être supérieur à 1€"),
        date: yup.string().required("Veuillez saisir une date de paiement")
})