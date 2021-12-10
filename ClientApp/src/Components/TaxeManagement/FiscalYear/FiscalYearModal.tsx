import { useForm } from 'react-hook-form'
import {
  Modal,
  Button,
  Form
} from 'react-bootstrap'
import { useEffect, useState } from 'react'
import { IExercice } from '../../../Types/IExercice'

interface FiscalYearModal {
  fiscalYear: { fiscalYear: IExercice, show: boolean, type: string },
  handleClose: () => void,
  onSubmit: (data: any) => void
}

export const FiscalYearModal = ({ fiscalYear, handleClose, onSubmit }: FiscalYearModal) => {
  const { register, handleSubmit, setValue, reset } = useForm()

  useEffect(() => {
    if (Object.keys(fiscalYear.fiscalYear).length > 0 && fiscalYear.type == 'edit') {
      setValue('annee_exercice', fiscalYear.fiscalYear.annee_exercice)
      setValue('date_echeance', fiscalYear.fiscalYear.date_echeance)
      setValue('date_reglement_taxe', fiscalYear.fiscalYear.date_reglement_taxe)
    } else if(fiscalYear.type == 'create') {
      reset()
    }
  }, [fiscalYear])

  const formSubmit = (data: any) => {
    onSubmit({type: fiscalYear.type, data: data})
    handleClose()
  }

  const generateDate = (): number[] => {
    const years: number[] = []
    for (let i = 0; i < 4; i++) {
      years.push(new Date().getFullYear() + i)
    }
    return years
  }


  return <>
    <Modal show={fiscalYear.show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{fiscalYear.type == "create" ? "Créer" : "Éditer"} un exercice</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit(formSubmit)}>
          <Form.Group controlId="exercice">
            <Form.Label column="sm">Année de l'exercice</Form.Label>
            <Form.Select size="sm" {...register('annee_exercice')}>
              {generateDate().map((value: number, index: number) => <option value={value}>{value}</option>)}
            </Form.Select>
          </Form.Group>
          <Form.Group controlId="echeance">
            <Form.Label column="sm">Date d'échéance</Form.Label>
            <Form.Control type="date" size="sm" {...register('date_echeance')} />
          </Form.Group>
          <Form.Group controlId="reglement_taxe">
            <Form.Label column="sm">Date limite règlement taxe</Form.Label>
            <Form.Control type="date" size="sm" {...register('date_reglement_taxe')} />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Annuler
        </Button>
        <Button variant="primary" onClick={handleSubmit(formSubmit)}>
          {fiscalYear.type == "create" ? "Créer" : "Modifier"}
        </Button>
      </Modal.Footer>
    </Modal>
  </>
}