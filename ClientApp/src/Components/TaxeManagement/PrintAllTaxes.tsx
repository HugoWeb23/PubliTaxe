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
import { PrintAllTaxesSchema } from '../../Validation/Tax/PrintAllTaxesSchema'
import { apiFetch } from '../../Services/apiFetch'
import { Printer } from './PDF/Printer'
import { IPrintData } from '../../Types/IPrintData'
import { saveAs } from 'file-saver'
import { pdf } from '@react-pdf/renderer'

export const PrintAllTaxes = ({tarifs}: any) => {

    const initialValues: any = {
        deadline: '2021-12-21',
        print_date: '2021-12-06',
        contact_person: 'Mme MARTEN',
        phone: '056/86.02.80',
        mail: 'sylvie.maerten@mouscron.be'
    }

    const { register, handleSubmit, formState: { errors } } = useForm({ resolver: yupResolver(PrintAllTaxesSchema), defaultValues: initialValues })
    
    const launchPrint = async(data: any) => {
        const entreprises = await apiFetch(`/entreprises/printallbycity/${data.type}`)
        if(data.type == 1) {
            data.options = { print_declaration: true, print_letter: false, print_form: false}
        } else if(data.type == 2) {
            data.options = { print_declaration: true, print_letter: true, print_form: false}
        }
        const blob = await pdf((
            <Printer entreprises={entreprises} printData={data} tarifs={tarifs} />
          )).toBlob();
          saveAs(blob, 'document.pdf');
    }

    return <>
        <Container fluid="sm">
            <h2 className="mt-2 mb-3">Imprimer toutes les déclarations</h2>
            <Card body>
                <Form onSubmit={handleSubmit(launchPrint)}>
                    <Form.Group controlId="type">
                        <Form.Label column="sm">Type d'impression</Form.Label>
                        <Form.Select size="sm" {...register('type')}>
                            <option value="1">Mouscronnois (déclaration)</option>
                            <option value="2">Hors Mouscron (lettre et déclaration)</option>
                        </Form.Select>
                    </Form.Group>
                    <Row className="mt-3">
                        <Col>
                            <Form.Group controlId="echeance">
                                <Form.Label column="sm">Date d'échéance</Form.Label>
                                <Form.Control type="date" placeholder="Date d'échéance" isInvalid={errors.deadline} size="sm" {...register('deadline')} />
                                {errors.deadline && <Form.Control.Feedback type="invalid">{errors.deadline.message}</Form.Control.Feedback>}
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group controlId="date">
                                <Form.Label column="sm">Date d'impression</Form.Label>
                                <Form.Control type="date" placeholder="Date d'impression" isInvalid={errors.print_date} size="sm" {...register('print_date')} />
                                {errors.print_date && <Form.Control.Feedback type="invalid">{errors.print_date.message}</Form.Control.Feedback>}
                            </Form.Group>
                        </Col>
                    </Row>
                    <Form.Group controlId="contact" className="mt-3">
                        <Form.Label column="sm">Personne de contact</Form.Label>
                        <Form.Control type="text" placeholder="Personne de contact" isInvalid={errors.contact_person} size="sm" {...register('contact_person')} />
                        {errors.contact_person && <Form.Control.Feedback type="invalid">{errors.contact_person.message}</Form.Control.Feedback>}
                    </Form.Group>
                    <Row>
                        <Col>
                            <Form.Group controlId="telephone" className="mt-3">
                                <Form.Label column="sm">Téléphone</Form.Label>
                                <Form.Control type="text" placeholder="Téléphone" isInvalid={errors.phone} size="sm" {...register('phone')} />
                                {errors.phone && <Form.Control.Feedback type="invalid">{errors.phone.message}</Form.Control.Feedback>}
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group controlId="mail" className="mt-3">
                                <Form.Label column="sm">Adresse e-mail</Form.Label>
                                <Form.Control type="text" placeholder="Adresse e-mail" isInvalid={errors.mail} size="sm" {...register('mail')} />
                                {errors.mail && <Form.Control.Feedback type="invalid">{errors.mail.message}</Form.Control.Feedback>}
                            </Form.Group>
                        </Col>
                    </Row>
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