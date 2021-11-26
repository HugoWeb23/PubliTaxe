import * as yup from 'yup'

export const AdvertisingFormSchema = yup.object().shape({
    rue: yup.object().shape({
        code_postal: yup.object().shape({
            cp: yup.string().required('Veuillez sélectionner une rue pour définir le code postal'),
        }),
        code_rue: yup.string().required('Veuillez sélectionner une rue pour définir le code rue'),
        nom_rue: yup.string().required('Veuillez sélectionner une rue'),
        adresse_numero: yup.string().required('Veuillez saisir un numéro'),
        type_publicite: yup.string().required('Veuillez sélectionner un type de panneau'),
        situation: yup.string().required('Veuillez saisir une situation'),
        quantite: yup.string().required('Veuillez saisir une quantité'),
        face: yup.string().required('Veuillez sélectionner une face'),
        surface: yup.string().required('Veuillez saisir une surface unitaire'),
        mesure: yup.string().required('Veuillez saisir une mesure'),
        surface_totale: yup.string().required("La surface totale n'a pas été calculée"),
        exoneration: yup.boolean().required("Erreur de type"),
        taxe_totale: yup.string().required("La taxe totale n'a pas été calculée")
    }),
})