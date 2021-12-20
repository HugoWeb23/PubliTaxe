import * as yup from 'yup'

export const RegisterFormSchema = yup.object().shape({
        nom: yup.string().required('Veuillez saisir votre nom'),
        prenom: yup.string().required("Veuillez saisir votre prénom"),
        mail: yup.string().required("Veuillez saisir votre adresse e-mail").email("L'adresse e-mail n'est pas valide"),
        pass: yup.string().required("Veuillez saisir un mot de passe").min(5, "Le mot de passe est trop court"),
        repeatpass: yup.string().test('Vérifier que les mots de passent correspondent', "Les mots de passe ne correspondent pas", (value, context) => {
            if(value !== context.parent.pass) {
                return false
            }
            return true
        })
})