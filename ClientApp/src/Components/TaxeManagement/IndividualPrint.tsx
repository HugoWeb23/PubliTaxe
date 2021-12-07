import { useEffect, useState } from 'react'
import { saveAs } from 'file-saver';
import { pdf, PDFViewer } from '@react-pdf/renderer';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Button,
  Modal,
  Form,
  Row,
  Col,
  Alert
} from 'react-bootstrap'
import { useForm } from 'react-hook-form'
import { TaxPrinter } from './PDF/TaxPrinter';
import { IndividualPrintSchema } from '../../Validation/Tax/IndividualPrintSchema';
import { IPrintData } from '../../Types/IPrintData';
import { Printer } from './PDF/Printer'

export const IndividualPrint = ({ show, handleClose, tax, tarifs }: any) => {
  const initialValues: any = {
    deadline: '2021-12-21',
    print_date: '2021-12-06',
    contact_person: 'Mme MARTEN',
    phone: '056/86.02.80',
    mail: 'sylvie.maerten@mouscron.be',
    options: {
      print_letter: true,
      print_declaration: false,
      print_form: false
    }
  }
  const [printData, setPrintData] = useState<IPrintData | null>(null)
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: yupResolver(IndividualPrintSchema), defaultValues: initialValues })

  const onClose = () => {
    setPrintData(null)
    handleClose()
  }

  const onSubmit = (data: any) => {
    console.log(data)
    setPrintData(data)
  }

  const generatePdfDocument = async () => {
    const blob = await pdf((
      <TaxPrinter entreprise={tax} />
    )).toBlob();
    saveAs(blob, "test.pdf");
  }

  return <>
    <Modal show={show} onHide={onClose} size="xl">
      <Modal.Header closeButton>
        <Modal.Title>Impression individuelle</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Alert variant="secondary" >Veillez à bien sauvegarder les changements avant de générer un document.</Alert>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Row className="mb-3">
            <Col>
              <Form.Group controlId="echeance" className="mb-3">
                <Form.Label>Date d'échéance</Form.Label>
                <Form.Control type="date" placeholder="Date d'échéance" isInvalid={errors.deadline} size="sm" {...register('deadline')} />
                {errors.deadline && <Form.Control.Feedback type="invalid">{errors.deadline.message}</Form.Control.Feedback>}
              </Form.Group>
            </Col>
            <Col>
              <Form.Group controlId="date">
                <Form.Label>Date d'impression</Form.Label>
                <Form.Control type="date" placeholder="Date d'impression" isInvalid={errors.print_date} size="sm" {...register('print_date')} />
                {errors.print_date && <Form.Control.Feedback type="invalid">{errors.print_date.message}</Form.Control.Feedback>}
              </Form.Group>
            </Col>
          </Row>
          <Form.Group controlId="contact" className="mb-3">
            <Form.Label>Personne de contact</Form.Label>
            <Form.Control type="text" placeholder="Personne de contact" isInvalid={errors.contact_person} size="sm" {...register('contact_person')} />
            {errors.contact_person && <Form.Control.Feedback type="invalid">{errors.contact_person.message}</Form.Control.Feedback>}
          </Form.Group>
          <Row>
            <Col>
              <Form.Group controlId="telephone" className="mb-3">
                <Form.Label>Téléphone</Form.Label>
                <Form.Control type="text" placeholder="Téléphone" isInvalid={errors.phone} size="sm" {...register('phone')} />
                {errors.phone && <Form.Control.Feedback type="invalid">{errors.phone.message}</Form.Control.Feedback>}
              </Form.Group>
            </Col>
            <Col>
              <Form.Group controlId="mail" className="mb-3">
                <Form.Label>Adresse e-mail</Form.Label>
                <Form.Control type="text" placeholder="Adresse e-mail" isInvalid={errors.mail} size="sm" {...register('mail')} />
                {errors.mail && <Form.Control.Feedback type="invalid">{errors.mail.message}</Form.Control.Feedback>}
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Group controlId="lettre">
                <Form.Check type="checkbox" label="Imprimer la lettre" isInvalid={errors.options} {...register('options.print_letter')} />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group controlId="declaration">
                <Form.Check type="checkbox" label="Imprimer la déclaration" isInvalid={errors.options} {...register('options.print_declaration')} />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group controlId="form">
                <Form.Check type="checkbox" label="Imprimer la fiche d'entreprise" isInvalid={errors.options} {...register('options.print_form')} />
              </Form.Group>
            </Col>
            <Form.Group controlId="submit" className="mt-3">
              <Button variant="danger" className="mb-1" type="submit">Générer le document</Button>
            </Form.Group>
          </Row>
          <Form.Text className="text-muted">
            La génération du document peut durer plusieurs secondes.
          </Form.Text>
        </Form>
        {printData != null && <PDFViewer width="100%" height="700px" style={{ marginTop: '10px' }}>
          <Printer entreprises={[tax]} printData={printData} tarifs={tarifs} />
        </PDFViewer>}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Fermer
        </Button>
      </Modal.Footer>
    </Modal>
  </>
}