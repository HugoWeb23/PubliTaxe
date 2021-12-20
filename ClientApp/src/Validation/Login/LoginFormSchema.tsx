import * as yup from 'yup'

export const LoginFormSchema = yup.object().shape({
        mail: yup.string().required('Veuillez saisir une adresse e-mail').email("L'adresse e-mail n'est pas valide"),
        pass: yup.string().required("Veuillez saisir votre mot de passe"),
})