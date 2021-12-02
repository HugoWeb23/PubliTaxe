import { useEffect, useState } from 'react'
import { saveAs } from 'file-saver';
import { pdf } from '@react-pdf/renderer';
import {
  Button,
  Modal,
  Form,
  Row,
  Col
} from 'react-bootstrap'
import { useForm } from 'react-hook-form'
import { PrintTaxButton } from './PDF/PrintTaxButton'
import { TaxPrinter } from './PDF/TaxPrinter';

export const IndividualPrint = ({ show, handleClose, tax }: any) => {
  const [startPrint, setStartPrint] = useState<boolean>(false)

  const generatePdfDocument = async () => {
    const blob = await pdf((
      <TaxPrinter entreprise={tax} />
    )).toBlob();
    saveAs(blob, "test.pdf");
  }

  return <>
    <Modal show={show} onHide={handleClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Impression individuelle</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Row className="mb-3">
            <Col>
              <Form.Group controlId="lettre">
                <Form.Check type="checkbox" label="Imprimer la lettre" />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group controlId="date">
                <Form.Control type="date" placeholder="Date d'impression" size="sm" />
              </Form.Group>
            </Col>
          </Row>
          <Form.Group controlId="contact" className="mb-3">
            <Form.Control type="text" placeholder="Personne de contact" size="sm" />
          </Form.Group>
          <Form.Group controlId="telephone" className="mb-3">
            <Form.Control type="text" placeholder="Téléphone" size="sm" />
          </Form.Group>
          <Form.Group controlId="echeance" className="mb-3">
            <Form.Control type="date" placeholder="Date d'échéance" size="sm" />
          </Form.Group>
          <Form.Group controlId="declaration">
            <Form.Check type="checkbox" label="Imprimer la déclaration" />
          </Form.Group>
          <Form.Group controlId="submit" className="mt-3">
            <Button variant="danger" onClick={() => generatePdfDocument()}>Générer le document</Button>
          </Form.Group>
          <Form.Text className="text-muted">
              La génération du document peut durer plusieurs secondes.
            </Form.Text>
        </Form>
        {startPrint && <PrintTaxButton entreprise={tax} />}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Fermer
        </Button>
      </Modal.Footer>
    </Modal>
  </>
}