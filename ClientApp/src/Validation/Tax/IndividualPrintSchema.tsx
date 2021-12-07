import * as yup from 'yup'

export let IndividualPrintSchema = yup.object().shape({
        deadline: yup.string().required("Veuillez saisir une date d'échéance").typeError("Veuillez saisir une date valide"),
        print_date: yup.string().required("Veuillez saisir une date d'impression").typeError("Veuillez saisir une date valide"),
        contact_person: yup.string().required("Veuillez définir une personne de contact"),
        phone: yup.string().required("Veuillez saisir un numéro de téléphone"),
        mail: yup.string().required("Veuillez saisir une adresse email").email("L'adresse email n'est pas valide"),
        //print_letter: yup.boolean(),
        //print_declaration: yup.boolean(),
        //print_form: yup.boolean()
        options: yup.object().test("Au moins un type d'impression sélectionné", "Veuillez sélectionner au moins un document à imprimer", (value) => {
            if(value.print_letter || value.print_declaration || value.print_form) {
                return true
            }
            return false
        })
})