import * as yup from 'yup'

export const EncodeNotReceivedSchema = yup.object().shape({
        pourcentage_majoration: yup.number().typeError('Veuillez saisir un pourcentage de majoration'),
        motif_majorationId: yup.number().typeError('Veuillez saisir un motif de majoration')
})