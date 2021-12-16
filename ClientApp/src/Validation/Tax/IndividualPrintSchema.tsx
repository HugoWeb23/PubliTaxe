import * as yup from 'yup'

export let IndividualPrintSchema = yup.object().shape({
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
    mail_contact: yup.string().required("Veuillez saisir une adresse email").email("L'adresse email n'est pas valide"),
    date_proces_verbal: yup.string().transform(value => {
        const date = new Date(value)
        return value.length > 0 ? date.toLocaleDateString('fr-FR') : value
    }).when('options.print_minutes', {
        is: true,
        then: yup.string().required("Veuillez saisir une date d'envoi")
    }),
    options: yup.object().test("Au moins un type d'impression sélectionné", "Veuillez sélectionner au moins un document à imprimer", (value) => {
        if (value.print_letter || value.print_declaration || value.print_form || value.print_minutes) {
            return true
        }
        return false
    })
})