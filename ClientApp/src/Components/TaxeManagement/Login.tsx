import {
    Card,
    Button,
    Form
} from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { callbackify } from 'util'
import MouscronLogo from '../../Images/MouscronLogo.png'

export const Login = () => {
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
                    <Form onSubmit={() => console.log("dd")}>
                        <Form.Group controlId="mail" className="mt-3">
                            <Form.Label>Adresse e-mail</Form.Label>
                            <Form.Control type="text" placeholder="Adresse email" />
                        </Form.Group>
                        <Form.Group controlId="password" className="mt-2">
                            <Form.Label>Mot de passe</Form.Label>
                            <Form.Control type="password" placeholder="Mot de passe" />
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