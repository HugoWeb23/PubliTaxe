import * as yup from 'yup'

export const AdvertisingFormSchema = yup.object().shape({
    rue: yup.object().shape({
        code_postal: yup.object().shape({
            cp: yup.string().required('Veuillez sélectionner une rue pour définir le code postal'),
        }),
        code_rue: yup.string().required('Veuillez sélectionner une rue pour définir le code rue'),
        nom_rue: yup.string().required('Veuillez sélectionner une rue'),
    }),
        adresse_numero: yup.string().required('Veuillez saisir un numéro'),
        type_publicite: yup.number().typeError("Le type de publicité n'est pas valide"),
        situation: yup.string(),
        quantite: yup.number().typeError("La quantité n'est pas valide").min(1, "La quantité est trop petite").max(20, "La quantité est trop grande"),
        face: yup.string().required('Veuillez sélectionner une face'),
        surface: yup.number().typeError("La surface n'est pas valide").min(10, "La surface est trop petite").max(99999, "La surface est trop grande"),
        mesure: yup.string().required('Veuillez saisir une mesure'),
        exoneration: yup.boolean().required("Erreur de type"),
})