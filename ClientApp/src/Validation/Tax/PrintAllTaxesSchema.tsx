import * as yup from 'yup'

export let PrintAllTaxesSchema = yup.object().shape({
    date_echeance: yup.string().transform(value => {
        const date = new Date(value)
        return value.length > 0 ? date.toLocaleDateString('fr-FR') : value
    }).required("Veuillez saisir une date d'échéance").typeError("Veuillez saisir une date valide"),
    date_impression: yup.string().transform(value => {
        const date = new Date(value)
        return value.length > 0 ? date.toLocaleDateString('fr-FR') : value
    }).required("Veuillez saisir une date d'impression").typeError("Veuillez saisir une date valide"),
    personne_contact: yup.string().required("Veuillez définir une personne de contact"),
    telephone_contact: yup.string().required("Veuillez saisir un numéro de téléphone"),
    mail_contact: yup.string().required("Veuillez saisir une adresse email").email("L'adresse email n'est pas valide")
})
