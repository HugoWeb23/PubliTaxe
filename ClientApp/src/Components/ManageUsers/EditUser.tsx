import { useState, useEffect } from 'react'
import {
    Form,
    Button,
    Row,
    Col,
    Card,
    Container,
    Table,
    Modal,
    Alert
} from 'react-bootstrap'
import { useForm } from 'react-hook-form'
import { apiFetch } from '../../Services/apiFetch'
import { IUser } from '../../Types/IUser'
import { CheckCircle } from '../UI/CheckCircle'
import { ErrorCircle } from '../UI/ErrorCircle'
import { toast } from 'react-toastify';
import { Loader } from '../UI/Loader'

interface IEditUser {
    location: any,
    match: any
}

export const EditUser = ({ location = {}, match }: IEditUser) => {
    const UserID = match.params.id
    const [user, setUser] = useState<IUser | undefined>(location.state)
    const [modalInfos, setModalInfos] = useState<boolean>(false)
    const [newPasswordAlert, setNewPasswordAlert] = useState<{ show: boolean, password: string | null }>({ show: false, password: null })
    const [passwordLoading, setPasswordLoading] = useState<boolean>(false)
    const { register, handleSubmit, setValue, formState: { errors } } = useForm()

    const setInputsValues = (obj: Object) => {
        for (const [key, value] of Object.entries(obj)) {
            setValue(key, value)
        }
    }

    useEffect(() => {
        (async () => {
            if (user === undefined) {
                const user = await apiFetch(`/accounts/getbyid/${UserID}`)
                setUser(user)
                setInputsValues(user)
            } else {
                setInputsValues(user)
            }
        })()
    }, [])

    const EditUser = async (data: any) => {
        try {
            await apiFetch('/accounts/updateuser', {
                method: 'PUT',
                body: JSON.stringify(data)
            })
            toast.success("Le compte a été modifié")
        } catch (e: any) {
            toast.error("Une erreur est survenue")
        }
    }

    const handleNewPassword = async () => {
        setPasswordLoading(true)
        const NewPassword = await apiFetch(`/accounts/newpassword/${UserID}`)
        setNewPasswordAlert({ show: true, password: NewPassword.password })
        setPasswordLoading(false)
    }

    return <>
        <Container fluid="xl">
            <ModalInfos
                show={modalInfos}
                handleClose={() => setModalInfos(false)}
            />
            <h2 className="mt-3">Modifier un compte</h2>
            <hr className="my-3" />
            <Form onSubmit={handleSubmit(EditUser)}>
                <div className="d-flex justify-content-end">
                    <Button variant="success" type="submit">Modifier l'utilisateur</Button>
                </div>
                <Row>
                    <Col>
                        <Form.Group controlId="firstname">
                            <Form.Label column="sm">Prénom</Form.Label>
                            <Form.Control type="text" size="sm" {...register('prenom')} />
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group controlId="lastname">
                            <Form.Label column="sm">Nom</Form.Label>
                            <Form.Control type="text" size="sm" {...register('nom')} />
                        </Form.Group>
                    </Col>
                </Row>
                <Form.Group controlId="mail" className="mt-3">
                    <Form.Label column="sm">Adresse e-mail</Form.Label>
                    <Form.Control type="text" size="sm" {...register('mail')} />
                </Form.Group>
                <Row className="mt-3">
                    <Col>
                        <Form.Group controlId="role">
                            <Form.Label column="sm">Rôle</Form.Label>
                            <Form.Select size="sm" {...register('role')}>
                                <option value="1">Lecture seule</option>
                                <option value="2">Éditeur</option>
                                <option value="3">Administrateur</option>
                            </Form.Select>
                            <div className="link" onClick={() => setModalInfos(true)}>Informations sur les rôles</div>
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group controlId="status">
                            <Form.Label column="sm">État du compte</Form.Label>
                            <Form.Select size="sm" {...register('actif')}>
                                <option value={0}>Inactif</option>
                                <option value={1}>Actif</option>
                            </Form.Select>
                        </Form.Group>
                    </Col>
                </Row>

            </Form>
            <Card border="danger" className="mt-4">
                <Card.Header as="h6">Changement du mot de passe</Card.Header>
                <Card.Body>
                <p className="fst-normal">Le mot de passe de sera changé immédiatement. Lors de sa prochaine connexion, l'utilisateur sera dans l'obligation de modifier son mot de passe.</p>
                    {passwordLoading && <>
                        <div className="mb-3">
                            <Loader variant="danger" />
                        </div>
                    </>}
                    {(newPasswordAlert.show && !passwordLoading) && <Alert variant="success">Nouveau mot de passe à communiquer à l'utilisateur : <span className="fw-bold">{newPasswordAlert.password}</span></Alert>}
                    <Button variant="outline-danger" as="div" onClick={handleNewPassword} disabled={passwordLoading}>Demander un nouveau mot de passe</Button>
                </Card.Body>
            </Card>
        </Container>
    </>
}

interface IModalInfos {
    show: boolean,
    handleClose: () => void
}

const ModalInfos = ({ show, handleClose }: IModalInfos) => {
    return <Modal show={show} onHide={handleClose} size="lg">
        <Modal.Header closeButton>
            <Modal.Title>Permissions des rôles</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Table className="table-borderless">
                <thead>
                    <tr>
                        <th>Actions</th>
                        <th>Rôle lecture seule</th>
                        <th>Rôle éditeur</th>
                        <th>Rôle administrateur</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Voir les entreprises</td>
                        <td><CheckCircle /></td>
                        <td><CheckCircle /></td>
                        <td><CheckCircle /></td>
                    </tr>
                    <tr>
                        <td>Éditer les entreprises</td>
                        <td><ErrorCircle /></td>
                        <td><CheckCircle /></td>
                        <td><CheckCircle /></td>
                    </tr>
                    <tr>
                        <td>Impression individuelle</td>
                        <td><CheckCircle /></td>
                        <td><CheckCircle /></td>
                        <td><CheckCircle /></td>
                    </tr>
                    <tr>
                        <td>Imprimer toutes les déclarations</td>
                        <td><CheckCircle /></td>
                        <td><CheckCircle /></td>
                        <td><CheckCircle /></td>
                    </tr>
                    <tr>
                        <td>Imprimer tous les procès-verbaux</td>
                        <td><CheckCircle /></td>
                        <td><CheckCircle /></td>
                        <td><CheckCircle /></td>
                    </tr>
                    <tr>
                        <td>Gestion des informations générales</td>
                        <td><ErrorCircle /></td>
                        <td><ErrorCircle /></td>
                        <td><CheckCircle /></td>
                    </tr>
                    <tr>
                        <td>Gestion des tarifs</td>
                        <td><ErrorCircle /></td>
                        <td><ErrorCircle /></td>
                        <td><CheckCircle /></td>
                    </tr>
                    <tr>
                        <td>Gestion des exercices</td>
                        <td><ErrorCircle /></td>
                        <td><ErrorCircle /></td>
                        <td><CheckCircle /></td>
                    </tr>
                    <tr>
                        <td>Changement d'exercice</td>
                        <td><ErrorCircle /></td>
                        <td><ErrorCircle /></td>
                        <td><CheckCircle /></td>
                    </tr>
                </tbody>
            </Table>
        </Modal.Body>
        <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
                Fermer
            </Button>
        </Modal.Footer>
    </Modal>
}
