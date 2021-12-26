import * as yup from 'yup'

export const EditUserFormSchema = yup.object().shape({
        nom: yup.string().required('Veuillez saisir un nom'),
        prenom: yup.string().required("Veuillez saisir un prénom"),
        mail: yup.string().required("Veuillez saisir une adresse e-mail").email("L'adresse e-mail n'est pas valide"),
        role: yup.string().required("Veuillez sélectionner un rôle"),
        actif: yup.string().required("Veuillez définir l'état du compte")
})