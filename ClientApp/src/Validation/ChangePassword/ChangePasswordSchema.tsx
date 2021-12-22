import * as yup from 'yup'

export const ChangePasswordSchema = yup.object().shape({
    currentpassword: yup.string().required("Veuillez saisir votre mot de passe actuel"),
    newpassword: yup.string().required("Veuillez saisir un nouveau mot de passe"),
    repeatpassword: yup.string().test('Vérifier que les mots de passent correspondent', "Les mots de passe ne correspondent pas", (value, context) => {
        if(value !== context.parent.newpassword) {
            return false
        }
        return true
    })
});