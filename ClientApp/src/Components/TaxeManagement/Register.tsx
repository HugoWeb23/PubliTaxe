import {
    Card,
    Button,
    Form,
    Col,
    Row
} from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { callbackify } from 'util'
import MouscronLogo from '../../Images/MouscronLogo.png'

export const Register = () => {

    return <>
        <div className="d-flex justify-content-center align-items-center flex-column login-container">
            <div className="login-image">
                <img src={MouscronLogo} />
                <div className="login-title">PubliTaxe</div>
            </div>
            <Card style={{ width: '40rem' }}>
                <Card.Body>
                    <div className="d-flex justify-content-between align-items-center">
                        <Card.Title>Inscription</Card.Title>
                        <Link to="/login" className="link">Se connecter</Link>
                    </div>
                    <Form onSubmit={() => console.log("dd")}>
                        <Row>
                            <Col>
                                <Form.Group controlId="firstname" className="mt-3">
                                    <Form.Label>Prénom</Form.Label>
                                    <Form.Control type="text" placeholder="Prénom" />
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group controlId="mail" className="mt-3">
                                    <Form.Label>Nom</Form.Label>
                                    <Form.Control type="text" placeholder="Nom" />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Form.Group controlId="mail" className="mt-3">
                            <Form.Label>Adresse e-mail</Form.Label>
                            <Form.Control type="text" placeholder="Adresse email" />
                        </Form.Group>
                        <Row>
                            <Col>
                                <Form.Group controlId="password" className="mt-2">
                                    <Form.Label>Mot de passe</Form.Label>
                                    <Form.Control type="password" placeholder="Mot de passe" />
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group controlId="password" className="mt-2">
                                    <Form.Label>Répétez le mot de passe</Form.Label>
                                    <Form.Control type="password" placeholder="Répétez le mot de passe" />
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