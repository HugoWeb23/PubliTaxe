import * as yup from 'yup'

export const GeneralInformationsSchema = yup.object().shape({
    personne_contact: yup.string().required("Veuillez saisir une personne de contact"),
    telephone_contact: yup.string().required("Veuillez saisir un numéro de téléphone"),
    mail_contact: yup.string().required("Veuillez saisir une personne de contact").email("L'adresse e-mail n'est pas valide"),
    direction_generale: yup.string().required("Veuillez définir un directeur général"),
    bourgmestre: yup.string().required("Veuillez définir un bourgmestre"),
});