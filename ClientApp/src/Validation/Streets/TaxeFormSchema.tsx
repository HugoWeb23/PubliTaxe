import * as yup from 'yup'

export const TaxeFormSchema = yup.object().shape({
    matricule_ciger: yup.string().required('Veuillez saisir un matricule'),
    nom: yup.string().required('Veuillez saisir un nom'),
    adresse_rue: yup.string().required('Veuillez saisir une adresse'),
    adresse_numero: yup.string().required('Veuillez saisir un numéro'),
    adresse_boite: yup.string().required('Veuillez saisir une boite'),
    adresse_index: yup.string().required('Veuillez saisir un index'),
    code_postal: yup.object().shape({
        cp: yup.string().required('Veuillez saisir un code postal'),
        localite: yup.string().required('Veuillez saisir une localité')
    }),
    numero_telephone: yup.string().required('Veuillez saisir un numéro de téléphone'),
    numero_fax: yup.string().required('Veuillez saisir un numéro de fax'),
    personne_contact: yup.string().required('Veuillez définir une personne de contact'),
    telephone_contact: yup.string().required('Veuillez saisir un numéro de téléphone'),
    mail_contact: yup.string().required('Veuillez saisir une adresse email').email("L'adresse email n'est pas valide"),
    numero_tva: yup.string().required('Veuillez saisir un numéro de TVA'),
    pourcentage_majoration: yup.string().typeError("Le pourcentage de majoration n'est pas correct"),
    motif_majoration: yup.string().when('Une value est saisie', {
        is: true,
        then: yup.string().min(3, "Le motif doit contenir au moins 3 caractères")
    }),
    code_rue_taxation: yup.string().required("Veuillez saisir un code de rue"),
    adresse_taxation: yup.string().required('Veuillez saisir une adresse de taxation'),
    adresse_numero_taxation: yup.string().required('Veuillez saisir un numéro de rue'),
    adresse_index_taxation: yup.string().required('Veuillez saisir un index'),
    adresse_boite_taxation: yup.string().required('Veuillez saisir une boite'),
    adresse_code_postal_taxation: yup.string().required('Veuillez saisir un code postal'),
    adresse_localite_taxation: yup.string().required('Veuillez saisir une localité'),
    commentaire_taxation: yup.string().typeError("Le format du commentaire n'est pas valide")
});