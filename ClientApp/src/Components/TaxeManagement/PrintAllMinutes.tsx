import {
    Container,
    Card,
    Row,
    Col,
    Form,
    Button
} from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { apiFetch } from '../../Services/apiFetch'
import { Printer } from './PDF/Printer'
import { saveAs } from 'file-saver'
import { pdf } from '@react-pdf/renderer'
import { IExercice } from "../../Types/IExercice"
import { IInformation } from "../../Types/IInformations"
import { IMotif_majoration } from "../../Types/IMotif_majoration"
import { IPrice } from '../../Types/IPrice'
import { PrintAllMinutesSchema } from '../../Validation/Tax/PrintAllMinutesSchema'

interface IPrintAllMinutes {
    tarifs: IPrice[],
    motifsMajoration: IMotif_majoration[],
    currentFiscalYear: IExercice,
    informations: IInformation
}

export const PrintAllMinutes = ({ tarifs, motifsMajoration, currentFiscalYear, informations }: IPrintAllMinutes) => {

    const Today = () => {
        const date = new Date()
        const month = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1
        const day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
        return `${date.getFullYear()}-${month}-${day}`

    }
    
    const initialValues = ({ ...informations, date_echeance: currentFiscalYear.date_echeance, date_impression: Today() })

    const { register, handleSubmit, formState: { errors } } = useForm<any>({ resolver: yupResolver(PrintAllMinutesSchema), defaultValues: initialValues })

    const launchPrint = async (data: any) => {
        const entreprises = await apiFetch(`/entreprises/printallminutes`)
        data.options = { print_declaration: true, print_minutes: true }
        console.log(currentFiscalYear, data, tarifs, motifsMajoration)
        const blob = await pdf((
            <Printer entreprises={entreprises} printData={data} tarifs={tarifs} motifsMajoration={motifsMajoration} currentFiscalYear={currentFiscalYear} />
        )).toBlob();
        saveAs(blob, 'document.pdf');
    }

    return <>
        <Container fluid="sm">
            <nav aria-label="breadcrumb" className="mt-3">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item"><Link to="/">Accueil</Link></li>
                    <li className="breadcrumb-item active" aria-current="page">Imprimer tous les procès-verbaux</li>
                </ol>
            </nav>
            <h2 className="mt-2 mb-3">Imprimer tous les procès-verbaux et recommandés</h2>
            <hr className="my-3" />
            <Card body>
                <Form onSubmit={handleSubmit(launchPrint)}>
                    <Row>
                        <Col>
                            <Form.Group controlId="date">
                                <Form.Label column="sm">Date d'impression</Form.Label>
                                <Form.Control type="date" placeholder="Date d'impression" isInvalid={errors.date_impression} size="sm" {...register('date_impression')} />
                                {errors.date_impression && <Form.Control.Feedback type="invalid">{errors.date_impression.message}</Form.Control.Feedback>}
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group controlId="contact">
                                <Form.Label column="sm">Personne de contact</Form.Label>
                                <Form.Control type="text" placeholder="Personne de contact" isInvalid={errors.personne_contact} size="sm" {...register('personne_contact')} />
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
                    <Form.Group controlId="date_envoi" className="mt-3">
                        <Form.Label column="sm">Date d'envoi procès-verbaux</Form.Label>
                        <Form.Control type="date" placeholder="Date d'envoi procès-verbal" isInvalid={errors.date_proces_verbal} size="sm" {...register('date_proces_verbal')} />
                        {errors.date_proces_verbal && <Form.Control.Feedback type="invalid">{errors.date_proces_verbal.message}</Form.Control.Feedback>}
                    </Form.Group>
                    <Form.Group controlId="submit" className="mt-4">
                        <div className="d-grid gap-2">
                            <Button variant="outline-dark" className="mb-1" type="submit">Générer les documents</Button>
                        </div>
                    </Form.Group>
                    <Form.Text className="text-muted fw-bold">
                        La génération des documents peut durer plusieurs minutes.
                    </Form.Text>
                </Form>
            </Card>
        </Container>
    </>
}