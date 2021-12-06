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
  const initialValues: IPrintData = {
    deadline: '2021-12-21',
    print_date: '2021-12-06',
    contact_person: 'Mme MARTEN',
    phone: '056/86.02.80',
    mail: 'sylvie.maerten@mouscron.be',
    print_letter: true,
    print_declaration: false,
    print_form: false
  }
  const [printData, setPrintData] = useState<IPrintData | null>(null)
  const { register, handleSubmit } = useForm({ resolver: yupResolver(IndividualPrintSchema), defaultValues: initialValues })

  const onClose = () => {
    setPrintData(null)
    handleClose()
  }

  const onSubmit = (data: any) => {
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
        <Alert variant="warning">Enregistrez les changements avant de générer un document.</Alert>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Row className="mb-3">
            <Col>
              <Form.Group controlId="echeance" className="mb-3">
                <Form.Label>Date d'échéance</Form.Label>
                <Form.Control type="date" placeholder="Date d'échéance" size="sm" {...register('deadline')} />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group controlId="date">
                <Form.Label>Date d'impression</Form.Label>
                <Form.Control type="date" placeholder="Date d'impression" size="sm" {...register('print_date')} />
              </Form.Group>
            </Col>
          </Row>
          <Form.Group controlId="contact" className="mb-3">
            <Form.Label>Personne de contact</Form.Label>
            <Form.Control type="text" placeholder="Personne de contact" size="sm" {...register('contact_person')} />
          </Form.Group>
          <Row>
            <Col>
              <Form.Group controlId="telephone" className="mb-3">
                <Form.Label>Téléphone</Form.Label>
                <Form.Control type="text" placeholder="Téléphone" size="sm" {...register('phone')} />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group controlId="mail" className="mb-3">
                <Form.Label>Adresse e-mail</Form.Label>
                <Form.Control type="text" placeholder="Adresse e-mail" size="sm" {...register('mail')} />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Group controlId="lettre">
                <Form.Check type="checkbox" label="Imprimer la lettre" {...register('print_letter')} />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group controlId="declaration">
                <Form.Check type="checkbox" label="Imprimer la déclaration" {...register('print_declaration')} />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group controlId="form">
                <Form.Check type="checkbox" label="Imprimer la fiche d'entreprise" {...register('print_form')} />
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