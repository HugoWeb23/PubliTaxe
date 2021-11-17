import * as yup from 'yup'

export const SearchStreetCodeSchema = yup.object().shape({
    code_rue: yup.string().required('Veuillez saisir un code de rue').min(3, 'Le code de la rue doit contenir au moins 3 caractères'),
});