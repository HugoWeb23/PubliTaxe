import { useContext } from 'react'
import {
    Card,
    Button,
    Form
} from 'react-bootstrap'
import { useForm } from 'react-hook-form'
import { UserContext } from '../Contexts/UserContext'
import { yupResolver } from '@hookform/resolvers/yup'
import { ChangePasswordSchema } from '../../Validation/ChangePassword/ChangePasswordSchema'
import { ApiErrors, apiFetch } from '../../Services/apiFetch'
import { toast } from 'react-toastify'

export const PasswordChange = () => {
    const value = useContext(UserContext);
    const { register, handleSubmit, formState: { errors } } = useForm({ resolver: yupResolver(ChangePasswordSchema) })

    const OnSubmit = async (data: any) => {
        try {
            if (value.user !== null) {
                await apiFetch(`/user/changepassword/${value.user?.id}`, {
                    method: 'PUT',
                    body: JSON.stringify(data)
                })
                value.toggleUser({ ...value.user, changement_pass: 0 })
            }
        } catch (e: any) {
            if (e instanceof ApiErrors) {
                toast.error(e.singleError.error)
            }
        }
    }
    return <>
        <div className="container-sm">
            <Card border="danger" className="mt-4">
                <Card.Header as="h5">Changement de mot de passe</Card.Header>
                <Card.Body>
                    <p className="fst-normal">Votre mot de passe a récemment été réinitalisé. Nous vons invitons à redéfinir un mot de passe <span className="fw-bold">sécurisé</span> (minimum 8 caractères, au moins 1 chiffre et 1 caractère spécial) pour récupérer l'accès à votre compte.</p>
                    <Form onSubmit={handleSubmit(OnSubmit)}>
                        <Form.Group controlId="oldpassword">
                            <Form.Label>Mot de passe actuel</Form.Label>
                            <Form.Control type="password" isInvalid={errors.oldpassword} {...register('currentpassword')} />
                            {errors.oldpassword && <Form.Control.Feedback type="invalid">{errors.oldpassword.message}</Form.Control.Feedback>}
                        </Form.Group>
                        <Form.Group controlId="newpassword" className="mt-3">
                            <Form.Label>Nouveau mot de passe</Form.Label>
                            <Form.Control type="password" isInvalid={errors.newpassword} {...register('newpassword')} />
                            {errors.newpassword && <Form.Control.Feedback type="invalid">{errors.newpassword.message}</Form.Control.Feedback>}
                        </Form.Group>
                        <Form.Group controlId="repeatpassword" className="mt-3">
                            <Form.Label>Répétez le mot de passe</Form.Label>
                            <Form.Control type="password" isInvalid={errors.repeatpassword} {...register('repeatpassword')} />
                            {errors.repeatpassword && <Form.Control.Feedback type="invalid">{errors.repeatpassword.message}</Form.Control.Feedback>}
                        </Form.Group>
                        <Form.Group controlId="submit" className="mt-3">
                            <Button type="submit" variant="success">Modifier mon mot de passe</Button>
                        </Form.Group>
                    </Form>
                </Card.Body>
            </Card>
        </div>
    </>
}