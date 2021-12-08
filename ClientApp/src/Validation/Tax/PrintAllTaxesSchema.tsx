import * as yup from 'yup'

export let PrintAllTaxesSchema = yup.object().shape({
    deadline: yup.string().required("Veuillez saisir une date d'échéance").typeError("Veuillez saisir une date valide"),
    print_date: yup.string().required("Veuillez saisir une date d'impression").typeError("Veuillez saisir une date valide"),
    contact_person: yup.string().required("Veuillez définir une personne de contact"),
    phone: yup.string().required("Veuillez saisir un numéro de téléphone"),
    mail: yup.string().required("Veuillez saisir une adresse email").email("L'adresse email n'est pas valide")
})
