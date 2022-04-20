import {
    Card,
    Button,
    Form,
    Alert
} from 'react-bootstrap'
import { Link } from 'react-router-dom'
import MouscronLogo from '../../Images/MouscronLogo.png'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup';
import { LoginFormSchema } from '../../Validation/Login/LoginFormSchema'
import { ApiErrors, apiFetch } from '../../Services/apiFetch'
import { IUser } from '../../Types/IUser'
import { useState } from 'react';

interface ILogin {
    handleLogin: (user: IUser) => void
}

export const Login = ({ handleLogin }: ILogin) => {
    const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({ resolver: yupResolver(LoginFormSchema) })
    const [loginError, setLoginError] = useState<any>(null)

    const OnSubmit = async (data: any) => {
        try {
            setLoginError(null)
            const user: IUser = await apiFetch('/user/login', {
                method: 'POST',
                body: JSON.stringify(data)
            })
            localStorage.setItem('token', user.token)
            handleLogin(user)
        } catch (e: any) {
            if (e instanceof ApiErrors) {
                setLoginError(e.singleError)
                reset({pass: ''})
            }
        }
    }

    return <>
        <div className="d-flex justify-content-center align-items-center flex-column login-container">
            <div className="login-image">
                <img src={MouscronLogo} />
                <div className="login-title">PubliTaxe</div>
            </div>
            <Card style={{ width: '40rem' }}>
                <Card.Body>
                    <div className="d-flex justify-content-between align-items-center">
                        <Card.Title>Connexion</Card.Title>
                        <Link to="/register" className="link">S'inscrire</Link>
                    </div>
                    {loginError && <Alert className="mt-3" variant="danger">{loginError.error}</Alert>}
                    <Form onSubmit={handleSubmit(OnSubmit)}>
                        <Form.Group controlId="mail" className="mt-3">
                            <Form.Label column="sm">Adresse e-mail</Form.Label>
                            <Form.Control type="text" placeholder="Adresse email" isInvalid={errors.mail} size="sm" {...register('mail')} />
                            {errors.mail && <Form.Control.Feedback type="invalid">{errors.mail.message}</Form.Control.Feedback>}
                        </Form.Group>
                        <Form.Group controlId="password" className="mt-2">
                            <Form.Label column="sm">Mot de passe</Form.Label>
                            <Form.Control type="password" placeholder="Mot de passe" isInvalid={errors.pass} size="sm" {...register('pass')} />
                            {errors.pass && <Form.Control.Feedback type="invalid">{errors.pass.message}</Form.Control.Feedback>}
                        </Form.Group>
                        <Button variant="primary" size="sm" type="submit" className="mt-3" disabled={isSubmitting}>{isSubmitting ? 'Chargement...' : 'Se connecter'}</Button>
                    </Form>
                </Card.Body>
            </Card>
        </div>
    </>
}