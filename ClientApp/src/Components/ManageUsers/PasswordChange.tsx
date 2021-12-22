import {
    Card,
    Button,
    Form
} from 'react-bootstrap'

export const PasswordChange = () => {
    return <>
        <div className="container-sm">
            <Card border="danger" className="mt-4">
                <Card.Header as="h5">Changement de mot de passe</Card.Header>
                <Card.Body>
                    <p className="fst-normal">Votre mot de passe a récemment été réinitalisé. Nous vons invitons à redéfinir un mot de passe <span className="fw-bold">sécurisé</span> (8 caractères minimum, chiffres et caractères spéciaux) pour récupérer l'accès à votre compte.</p>
                    <Form>
                        <Form.Group controlId="oldpassword">
                            <Form.Label>Mot de passe actuel</Form.Label>
                            <Form.Control type="password" />
                        </Form.Group>
                        <Form.Group controlId="newpassword" className="mt-3">
                            <Form.Label>Nouveau mot de passe</Form.Label>
                            <Form.Control type="password" />
                        </Form.Group>
                        <Form.Group controlId="repeatpassword" className="mt-3">
                            <Form.Label>Répétez le mot de passe</Form.Label>
                            <Form.Control type="password" />
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