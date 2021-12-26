import * as yup from 'yup'

export const MyAccountFormSchema = yup.object().shape({
        nom: yup.string().required('Veuillez saisir votre nom'),
        prenom: yup.string().required("Veuillez saisir votre prénom"),
        mail: yup.string().required("Veuillez saisir votre adresse e-mail").email("L'adresse e-mail n'est pas valide"),
        pass: yup.string().test('Vérifier mot de passe si longueur > 0', "Le mot de passe n'est pas assez sécurisé", (value: any) => {
            if(value.length > 0) {
                const regex = new RegExp(/(?=^.{8,}$)(?=(?:.*?\d){1})(?=.*[a-zA-Z])(?=(?:.*?[!@#$%*()_+^&}{:;?.]){1})(?!.*\s)[0-9a-zA-Z!@#$%*()_+^&]*$/)
                return regex.test(value)
            } else {
                return true
            }
        }),
        repeatpass: yup.string().test('Vérifier que les mots de passent correspondent', "Les mots de passe ne correspondent pas", (value, context) => {
            if(value !== context.parent.pass) {
                return false
            }
            return true
        })
})