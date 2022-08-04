import * as yup from 'yup'

export const TaxeFormSchema = yup.object().shape({
    matricule_ciger: yup.number().typeError("Le matricule doit être composé exclusivement de chiffres"),
    nom: yup.string().required('Veuillez saisir un nom').min(3, "Le nom est trop court").max(50, "Le nom est trop long"),
    desactive: yup.boolean().typeError('Valeur invalide'),
    proces_verbal: yup.boolean().typeError('Valeur invalide'),
    province: yup.boolean().typeError('Valeur invalide'),
    recu: yup.boolean().typeError('Valeur invalide'),
    adresse_rue: yup.string().required('Veuillez saisir une adresse').min(3, "La rue est trop courte").max(50, "La rue est trop longue"),
    adresse_numero: yup.string().required('Veuillez saisir un numéro').max(10, "Le numéro est trop long"),
    adresse_boite: yup.string().max(9, 'Le numéro de boite est trop long'),
    adresse_index: yup.string().max(9, "L'index est trop longue"),
    code_postal: yup.object().shape({
        cp: yup.string().required('Veuillez saisir un code postal'),
        localite: yup.string().required('Veuillez saisir une localité')
    }),
    numero_telephone: yup.string().required('Veuillez saisir un numéro de téléphone').min(3, "Le numéro est trop court").max(25, "Le numéro est trop long"),
    personne_contact: yup.string().required('Veuillez définir une personne de contact').min(2, "La valeur est trop courte").max(50, "La valeur est trop longue"),
    telephone_contact: yup.string().required('Veuillez saisir un numéro de téléphone').min(5, "Le numéro est trop court").max(50, "Le numéro est trop long"),
    mail_contact: yup.string().required('Veuillez saisir une adresse email').email("L'adresse email n'est pas valide"),
    numero_tva: yup.string().required('Veuillez saisir un numéro de TVA').min(5, "Le numéro est trop court").max(50, "Le numéro est trop long"),
    pourcentage_majoration: yup.string().typeError("Le pourcentage de majoration n'est pas correct"),
    motif_majorationId: yup.mixed().when('pourcentage_majoration', {
        is: (value: string) => value != "0" && value != undefined,
        then: yup.string().nullable().required('Vous avez sélectionné un % de majoration, veuillez saisir un motif')
    }),
    code_rue_taxation: yup.string().max(5, "Le code rue est trop long"),
    adresse_taxation: yup.string().max(50, "La rue est trop longue"),
    adresse_numero_taxation: yup.string().max(10, "Le numéro est trop long"),
    adresse_index_taxation: yup.string().max(9, "L'index est trop longue"),
    adresse_boite_taxation: yup.string().max(9, 'Le numéro de boite est trop long'),
    adresse_code_postal_taxation: yup.string().max(15, "Le code postal est trop long"),
    adresse_localite_taxation: yup.string().max(35, "La localité est trop longue"),
    commentaire_taxation: yup.string().typeError("Le format du commentaire n'est pas valide")
});