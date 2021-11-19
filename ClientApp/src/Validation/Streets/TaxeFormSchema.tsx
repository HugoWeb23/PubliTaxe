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
});