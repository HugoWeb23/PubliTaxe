import { useContext } from 'react';
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import {
    Container,
    Form,
    Button,
    Row,
    Col,
    Card
} from 'react-bootstrap'
import { yupResolver } from '@hookform/resolvers/yup';
import { MyAccountFormSchema } from '../../Validation/MyAccount/MyAccountFormSchema';
import { ApiErrors, apiFetch } from '../../Services/apiFetch';
import { toast } from 'react-toastify';
import { UserContext } from '../Contexts/UserContext';

export const ManageAccount = () => {
    const value = useContext(UserContext)
    const { register, setValue, handleSubmit, formState: { errors } } = useForm<any>({defaultValues: value.user, resolver: yupResolver(MyAccountFormSchema)})

    const EditAccount = async (data: any) => {
        try {
            const user = await apiFetch('/user/myaccount', {
                method: 'PUT',
                body: JSON.stringify(data)
            })
            value.toggleUser(user)
            setValue('pass', '')
            setValue('repeatpass', '')
            toast.success("Votre compte a été mis à jour")
        } catch(e: any) {
            if(e instanceof ApiErrors) {
                toast.error(e.singleError.error)
            }
        }
    }

    return <>
        <Container fluid="sm">
            <nav aria-label="breadcrumb" className="mt-3">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item"><Link to="/">Accueil</Link></li>
                    <li className="breadcrumb-item active" aria-current="page">Gérer mon compte</li>
                </ol>
            </nav>
            <h2 className="mt-2">Gérer mon compte</h2>
            <hr className="my-3" />
            <Card body>
                <Form onSubmit={handleSubmit(EditAccount)}>
                    <Row>
                        <Col>
                            <Form.Group controlId="nom">
                                <Form.Label column="sm">Nom</Form.Label>
                                <Form.Control type="text" size="sm" isInvalid={errors.nom} {...register('nom')} />
                                {errors.nom && <Form.Control.Feedback type="invalid">{errors.nom.message}</Form.Control.Feedback>}
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group controlId="prenom">
                                <Form.Label column="sm">Prénom</Form.Label>
                                <Form.Control type="text" size="sm" isInvalid={errors.prenom} {...register('prenom')} />
                                {errors.prenom && <Form.Control.Feedback type="invalid">{errors.prenom.message}</Form.Control.Feedback>}
                            </Form.Group>
                        </Col>
                    </Row>
                    <Form.Group controlId="mail" className="mt-3">
                        <Form.Label column="sm">Adresse e-mail</Form.Label>
                        <Form.Control type="text" size="sm" isInvalid={errors.mail} {...register('mail')} />
                        {errors.mail && <Form.Control.Feedback type="invalid">{errors.mail.message}</Form.Control.Feedback>}
                    </Form.Group>
                    <Row className="mt-3">
                        <Col>
                            <Form.Group controlId="pass">
                                <Form.Label column="sm">Mot de passe (laisser vide pour ne pas modifier)</Form.Label>
                                <Form.Control type="password" size="sm" isInvalid={errors.pass} {...register('pass')} />
                                {errors.pass && <Form.Control.Feedback type="invalid">{errors.pass.message}</Form.Control.Feedback>}
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group controlId="repass">
                                <Form.Label column="sm">Répétez le mot de passe</Form.Label>
                                <Form.Control type="password" size="sm" isInvalid={errors.repeatpass} {...register('repeatpass')} />
                                {errors.repeatpass && <Form.Control.Feedback type="invalid">{errors.repeatpass.message}</Form.Control.Feedback>}
                            </Form.Group>
                        </Col>
                    </Row>
                    <Form.Group controlId="submit" className="mt-3">
                        <Button variant="success" size="sm" type="submit">Valider</Button>
                    </Form.Group>
                </Form>
            </Card>
        </Container>
    </>
}