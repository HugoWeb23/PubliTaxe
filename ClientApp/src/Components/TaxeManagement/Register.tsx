import {
    Card,
    Button,
    Form,
    Col,
    Row,
    Alert
} from 'react-bootstrap'
import { Link } from 'react-router-dom'
import MouscronLogo from '../../Images/MouscronLogo.png'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup';
import { RegisterFormSchema } from '../../Validation/Register/RegisterFormSchema'
import { ApiErrors, apiFetch } from '../../Services/apiFetch'
import { useState } from 'react';

export const Register = () => {
    const { register, handleSubmit, reset, formState: { errors } } = useForm({ resolver: yupResolver(RegisterFormSchema) })
    const [alert, setAlert] = useState<{ type: string, message: string } | null>(null)
    const OnSubmit = async (data: any) => {
        try {
            setAlert(null)
            const CreateAccount = await apiFetch('/user/newaccount', {
                method: 'POST',
                body: JSON.stringify(data)
            })
            reset()
            setAlert({ type: 'success', message: "Votre compte a été créé, il est en attente d'activation." })
        } catch (e: any) {
            if (e instanceof ApiErrors) {
                setAlert({ type: 'danger', message: e.singleError.error })
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
                    {alert != null && <Alert variant={alert.type}>{alert.message}</Alert>}
                    <div className="d-flex justify-content-between align-items-center">
                        <Card.Title>Inscription</Card.Title>
                        <Link to="/login" className="link">Se connecter</Link>
                    </div>
                    <Form onSubmit={handleSubmit(OnSubmit)}>
                        <Row>
                            <Col>
                                <Form.Group controlId="firstname" className="mt-3">
                                    <Form.Label>Prénom</Form.Label>
                                    <Form.Control type="text" placeholder="Prénom" isInvalid={errors.prenom} {...register('prenom')} />
                                    {errors.prenom && <Form.Control.Feedback type="invalid">{errors.prenom.message}</Form.Control.Feedback>}
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group controlId="mail" className="mt-3">
                                    <Form.Label>Nom</Form.Label>
                                    <Form.Control type="text" placeholder="Nom" isInvalid={errors.nom} {...register('nom')} />
                                    {errors.nom && <Form.Control.Feedback type="invalid">{errors.nom.message}</Form.Control.Feedback>}
                                </Form.Group>
                            </Col>
                        </Row>
                        <Form.Group controlId="mail" className="mt-3">
                            <Form.Label>Adresse e-mail</Form.Label>
                            <Form.Control type="text" placeholder="Adresse e-mail" isInvalid={errors.mail} {...register('mail')} />
                            {errors.mail && <Form.Control.Feedback type="invalid">{errors.mail.message}</Form.Control.Feedback>}
                        </Form.Group>
                        <Row>
                            <Col>
                                <Form.Group controlId="password" className="mt-2">
                                    <Form.Label>Mot de passe</Form.Label>
                                    <Form.Control type="password" placeholder="Mot de passe" isInvalid={errors.pass} {...register('pass')} />
                                    {errors.pass && <Form.Control.Feedback type="invalid">{errors.pass.message}</Form.Control.Feedback>}
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group controlId="repeatpassword" className="mt-2">
                                    <Form.Label>Répétez le mot de passe</Form.Label>
                                    <Form.Control type="password" placeholder="Répétez le mot de passe" isInvalid={errors.repeatpass} {...register('repeatpass')} />
                                    {errors.repeatpass && <Form.Control.Feedback type="invalid">{errors.repeatpass.message}</Form.Control.Feedback>}
                                </Form.Group>
                            </Col>
                        </Row>
                        <Form.Group className="mt-3">
                            <Button variant="primary" type="submit">S'inscrire</Button>
                        </Form.Group>
                    </Form>
                </Card.Body>
            </Card>
        </div>
    </>

}