import * as yup from 'yup'

export const PriceSchema = yup.object().shape({
    exerciceId: yup.number().required('Veuillez sélectionner un exercice').min(1, "L'exercice n'est pas valide"),
    prix_unitaire_enseigne_non_lumineuse: yup.number().min(0.01, "Le prix doit être au-dessus de 0.01 €").max(20, "Le prix est trop grand").typeError("Veuillez saisir un nombre valide"),
    prix_unitaire_enseigne_lumineuse: yup.number().min(0.01, "Le prix doit être au-dessus de 0.01 €").max(20, "Le prix est trop grand").typeError("Veuillez saisir un nombre valide"),
    prix_unitaire_enseigne_clignotante: yup.number().min(0.01, "Le prix doit être au-dessus de 0.01 €").max(20, "Le prix est trop grand").typeError("Veuillez saisir un nombre valide"),
    prix_unitaire_panneau_non_lumineux: yup.number().min(0.01, "Le prix doit être au-dessus de 0.01 €").max(20, "Le prix est trop grand").typeError("Veuillez saisir un nombre valide"),
    prix_unitaire_panneau_lumineux: yup.number().min(0.01, "Le prix doit être au-dessus de 0.01 €").max(20, "Le prix est trop grand").typeError("Veuillez saisir un nombre valide"),
    prix_unitaire_panneau_a_defilement: yup.number().min(0.01, "Le prix doit être au-dessus de 0.01 €").max(20, "Le prix est trop grand").typeError("Veuillez saisir un nombre valide")
});