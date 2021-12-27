import {
    Container,
    Card,
    Row,
    Col,
    Form,
    Button
} from 'react-bootstrap'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { GeneralInformationsSchema } from '../../../Validation/GeneralInformations/GeneralInformationsSchema'
import { IInformation } from '../../../Types/IInformations'
import { useEffect } from 'react'
import { apiFetch, ApiErrors } from '../../../Services/apiFetch'
import { toast } from 'react-toastify'
import { Link } from 'react-router-dom'

interface IManageGeneralInformations {
    generalInformations: IInformation,
    handleChange: (infos: IInformation) => void
}

export const ManageGeneralInformations = ({ generalInformations, handleChange }: IManageGeneralInformations) => {
    const { register, handleSubmit, setValue, formState: { errors } } = useForm<any>({ resolver: yupResolver(GeneralInformationsSchema) })

    useEffect(() => {
        for (const [key, value] of Object.entries(generalInformations)) {
            setValue(key, value)
        }
    }, [generalInformations])

    const OnEdit = async (data: any) => {
        try {
            const infos = await apiFetch('/informations/updateinformations', {
                method: 'PUT',
                body: JSON.stringify(data)
            })
            handleChange(infos)
            toast.success("Mise à jour effectuée")
        } catch (e: any) {
            if (e instanceof ApiErrors) {
                toast.error(e.singleError.error)
            }
        }

    }
    return <>
        <Container fluid="sm">
            <nav aria-label="breadcrumb" className="mt-3">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item"><Link to="/">Accueil</Link></li>
                    <li className="breadcrumb-item active" aria-current="page">Gestion des informations générales</li>
                </ol>
            </nav>
            <h2 className="mt-2 mb-3">Gestion des informations générales</h2>
            <hr className="my-3" />
            <Card body>
                <Form onSubmit={handleSubmit(OnEdit)}>
                    <Row>
                        <Col>
                            <Form.Group controlId="personne_contact">
                                <Form.Label column="sm">Personne de contact</Form.Label>
                                <Form.Control type="text" placeholder="Nom et prénom de la personne de contact" isInvalid={errors.personne_contact} size="sm" {...register('personne_contact')} />
                                {errors.personne_contact && <Form.Control.Feedback type="invalid">{errors.personne_contact.message}</Form.Control.Feedback>}
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Form.Group controlId="telephone" className="mt-3">
                                <Form.Label column="sm">Téléphone</Form.Label>
                                <Form.Control type="text" placeholder="Téléphone" isInvalid={errors.telephone_contact} size="sm" {...register('telephone_contact')} />
                                {errors.telephone_contact && <Form.Control.Feedback type="invalid">{errors.telephone_contact.message}</Form.Control.Feedback>}
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group controlId="mail" className="mt-3">
                                <Form.Label column="sm">Adresse e-mail</Form.Label>
                                <Form.Control type="text" placeholder="Adresse e-mail" isInvalid={errors.mail_contact} size="sm" {...register('mail_contact')} />
                                {errors.mail_contact && <Form.Control.Feedback type="invalid">{errors.mail_contact.message}</Form.Control.Feedback>}
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Form.Group controlId="directeur_general" className="mt-3">
                                <Form.Label column="sm">Directeur général</Form.Label>
                                <Form.Control type="text" placeholder="Nom et prénom du directeur général" isInvalid={errors.direction_generale} size="sm" {...register('direction_generale')} />
                                {errors.direction_generale && <Form.Control.Feedback type="invalid">{errors.direction_generale.message}</Form.Control.Feedback>}
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group controlId="bourgmestre" className="mt-3">
                                <Form.Label column="sm">Bourgmestre</Form.Label>
                                <Form.Control type="text" placeholder="Nom et prénom du bourgmestre" isInvalid={errors.bourgmestre} size="sm" {...register('bourgmestre')} />
                                {errors.bourgmestre && <Form.Control.Feedback type="invalid">{errors.bourgmestre.message}</Form.Control.Feedback>}
                            </Form.Group>
                        </Col>
                    </Row>
                    <Form.Group controlId="submit" className="mt-4">
                        <Button variant="success" className="mb-1" type="submit">Modifier les informations</Button>
                    </Form.Group>
                </Form>
            </Card>
        </Container>
    </>
}