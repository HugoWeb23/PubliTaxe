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
import { IndividualPrintSchema } from '../../Validation/Tax/IndividualPrintSchema';
import { IPrintData } from '../../Types/IPrintData';
import { Printer } from './PDF/Printer'

export const IndividualPrint = ({ show, handleClose, tax, tarifs, currentFiscalYear, informations, motifs }: any) => {
  const date = new Date()
  const initialValues = ({
    ...informations,
    date_echeance: currentFiscalYear.date_echeance,
    date_impression: `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`,
    options: {
      print_letter: false,
      print_declaration: false,
      print_form: false,
      print_minutes: true
    }
  })

  const { register, handleSubmit, watch, formState: { errors } } = useForm({ resolver: yupResolver(IndividualPrintSchema), defaultValues: initialValues })

  const onClose = () => {
    handleClose()
  }

  const onSubmit = async (data: any) => {
    await generatePdfDocument(data as IPrintData)
  }

  const generatePdfDocument = async (printData: IPrintData) => {
    const blob = await pdf((
      <Printer entreprises={[tax]} tarifs={tarifs} currentFiscalYear={currentFiscalYear} printData={printData} motifsMajoration={motifs} />
    )).toBlob();
    saveAs(blob, `${tax.nom.split(' ').join('_')}.pdf`);
  }

  const print_minutes = watch('options.print_minutes')

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
                <Form.Label column="sm">Date d'échéance</Form.Label>
                <Form.Control type="date" placeholder="dd-mm-yyyy" isInvalid={errors.date_echeance} size="sm" {...register('date_echeance')} />
                {errors.date_echeance && <Form.Control.Feedback type="invalid">{errors.date_echeance.message}</Form.Control.Feedback>}
              </Form.Group>
            </Col>
            <Col>
              <Form.Group controlId="date">
                <Form.Label column="sm">Date d'impression</Form.Label>
                <Form.Control type="date" placeholder="Date d'impression" isInvalid={errors.date_impression} size="sm" {...register('date_impression')} />
                {errors.date_impression && <Form.Control.Feedback type="invalid">{errors.date_impression.message}</Form.Control.Feedback>}
              </Form.Group>
            </Col>
          </Row>
          <Form.Group controlId="contact" className="mb-3">
            <Form.Label column="sm">Personne de contact</Form.Label>
            <Form.Control type="text" placeholder="Personne de contact" isInvalid={errors.personne_contact} size="sm" {...register('personne_contact')} />
            {errors.personne_contact && <Form.Control.Feedback type="invalid">{errors.personne_contact.message}</Form.Control.Feedback>}
          </Form.Group>
          <Row>
            <Col>
              <Form.Group controlId="telephone" className="mb-3">
                <Form.Label column="sm">Téléphone</Form.Label>
                <Form.Control type="text" placeholder="Téléphone" isInvalid={errors.telephone_contact} size="sm" {...register('telephone_contact')} />
                {errors.telephone_contact && <Form.Control.Feedback type="invalid">{errors.telephone_contact.message}</Form.Control.Feedback>}
              </Form.Group>
            </Col>
            <Col>
              <Form.Group controlId="mail" className="mb-3">
                <Form.Label column="sm">Adresse e-mail</Form.Label>
                <Form.Control type="text" placeholder="Adresse e-mail" isInvalid={errors.mail_contact} size="sm" {...register('mail_contact')} />
                {errors.mail_contact && <Form.Control.Feedback type="invalid">{errors.mail_contact.message}</Form.Control.Feedback>}
              </Form.Group>
            </Col>
          </Row>
          {print_minutes && <Form.Group controlId="send_date_minutes" className="mb-3">
            <Form.Label column="sm">Date d'envoi procès-verbal</Form.Label>
            <Form.Control type="date" placeholder="dd-mm-yyyy" isInvalid={errors.date_proces_verbal} size="sm" {...register('date_proces_verbal')} />
            {errors.date_proces_verbal && <Form.Control.Feedback type="invalid">{errors.date_proces_verbal.message}</Form.Control.Feedback>}
          </Form.Group>}
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
              <Form.Group controlId="minutes">
                <Form.Check type="checkbox" label="Imprimer le procès verbal" isInvalid={errors.options} {...register('options.print_minutes')} />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group controlId="form">
                <Form.Check type="checkbox" label="Imprimer la fiche d'entreprise" isInvalid={errors.options} {...register('options.print_form')} />
              </Form.Group>
            </Col>
            {errors.options && <Form.Text className="text-danger">
              {errors.options.message}
            </Form.Text>}
            <Form.Group controlId="submit" className="mt-5">
              <div className="d-grid gap-2">
                <Button variant="outline-dark" className="mb-1" type="submit">Générer les documents</Button>
              </div>
            </Form.Group>
          </Row>
          <Form.Text className="text-muted">
            La génération des documents peut durer plusieurs secondes.
          </Form.Text>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Fermer
        </Button>
      </Modal.Footer>
    </Modal>
  </>
}