import * as yup from 'yup'

export const SimulationFormSchema = yup.object().shape({
    nom: yup.string().required('Veuillez saisir un nom').min(3, "Le nom est trop court").max(50, "Le nom est trop long"),
    numero_tva: yup.string().required('Veuillez saisir un numéro de TVA').min(5, "Le numéro est trop court").max(50, "Le numéro est trop long"),
    adresse_rue: yup.string().required('Veuillez saisir une adresse').min(3, "La rue est trop courte").max(50, "La rue est trop longue"),
    adresse_numero: yup.string().required('Veuillez saisir un numéro').max(10, "Le numéro est trop long"),
    adresse_boite: yup.string().max(9, 'Le numéro de boite est trop long'),
    adresse_index: yup.string().max(9, "L'index est trop longue"),
    code_postal: yup.object().shape({
        cp: yup.string().required('Veuillez saisir un code postal'),
        localite: yup.string().required('Veuillez saisir une localité')
    }),
    numero_telephone: yup.string().required('Veuillez saisir un numéro de téléphone').min(3, "Le numéro est trop court").max(25, "Le numéro est trop long"),
    mail_contact: yup.string().required('Veuillez saisir une adresse email').email("L'adresse email n'est pas valide"),
    commentaire_taxation: yup.string().typeError("Le format du commentaire n'est pas valide")
});