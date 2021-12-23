import * as yup from 'yup'

export const ChangePasswordSchema = yup.object().shape({
    currentpassword: yup.string().required("Veuillez saisir votre mot de passe actuel"),
    newpassword: yup.string().matches(/(?=^.{8,}$)(?=(?:.*?\d){1})(?=.*[a-zA-Z])(?=(?:.*?[!@#$%*()_+^&}{:;?.]){1})(?!.*\s)[0-9a-zA-Z!@#$%*()_+^&]*$/, { message : "Le mot de passe n'est pas assez sécurisé"}),
    repeatpassword: yup.string().test('Vérifier que les mots de passent correspondent', "Les mots de passe ne correspondent pas", (value, context) => {
        if(value !== context.parent.newpassword) {
            return false
        }
        return true
    })
});