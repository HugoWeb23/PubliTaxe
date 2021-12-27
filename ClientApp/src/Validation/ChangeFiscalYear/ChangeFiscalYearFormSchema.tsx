import * as yup from 'yup'

export const ChangeFiscalYearFormSchema = yup.object().shape({
    id: yup.string().required("Veuillez sélectionner un exercice")
});