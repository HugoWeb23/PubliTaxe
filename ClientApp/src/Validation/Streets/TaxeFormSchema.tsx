import * as yup from 'yup'

export const TaxeFormSchema = yup.object().shape({
    matricule_ciger: yup.string().required('Veuillez saisir un matricule'),
    nom: yup.string().required('Veuillez saisir un nom'),
    adresse_rue: yup.string().required('Veuillez saisir une adresse'),
    adresse_numero: yup.string().required('Veuillez saisir un numéro'),
    adresse_boite: yup.string().required('Veuillez saisir une boite'),
    adresse_index: yup.string().required('Veuillez saisir un index')
});