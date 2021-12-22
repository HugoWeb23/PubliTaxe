import {
    Card,
    Button,
    Form
} from 'react-bootstrap'
import { Link } from 'react-router-dom'
import MouscronLogo from '../../Images/MouscronLogo.png'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup';
import { LoginFormSchema } from '../../Validation/Login/LoginFormSchema'
import { apiFetch } from '../../Services/apiFetch'
import { IUser } from '../../Types/IUser'

interface ILogin {
    handleLogin: (user: IUser) => void
}

export const Login = ({handleLogin}: ILogin) => {
    const { register, handleSubmit, reset, formState: { errors, isSubmitSuccessful } } = useForm({resolver: yupResolver(LoginFormSchema)})
    
    const OnSubmit = async(data: any) => {
        const user: IUser = await apiFetch('/user/login', {
            method: 'POST',
            body: JSON.stringify(data)
        })
        localStorage.setItem('token', user.token)
        handleLogin(user)
    }
    
    return <>
        <div className="d-flex justify-content-center align-items-center flex-column login-container">
            <div className="login-image">
            <img src={MouscronLogo}/>
            <div className="login-title">PubliTaxe</div>
            </div>
            <Card style={{ width: '40rem' }}>
                <Card.Body>
                    <div className="d-flex justify-content-between align-items-center">
                        <Card.Title>Connexion</Card.Title>
                        <Link to="/register" className="link">S'inscrire</Link>
                    </div>
                    <Form onSubmit={handleSubmit(OnSubmit)}>
                        <Form.Group controlId="mail" className="mt-3">
                            <Form.Label>Adresse e-mail</Form.Label>
                            <Form.Control type="text" placeholder="Adresse email" {...register('mail')} />
                        </Form.Group>
                        <Form.Group controlId="password" className="mt-2">
                            <Form.Label>Mot de passe</Form.Label>
                            <Form.Control type="password" placeholder="Mot de passe" {...register('pass')} />
                        </Form.Group>
                        <div className="d-flex justify-content-between align-items-center mt-3">
                            <Button variant="primary" type="submit">Se connecter</Button>
                            <a className="link">Mot de passe oublié ?</a>
                        </div>
                    </Form>
                </Card.Body>
            </Card>
        </div>
    </>
}