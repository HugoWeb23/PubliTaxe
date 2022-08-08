import { useForm } from 'react-hook-form'
import {
  Modal,
  Button,
  Form
} from 'react-bootstrap'
import { useEffect, useState } from 'react'
import { IExercice } from '../../../Types/IExercice'
import { yupResolver } from '@hookform/resolvers/yup';
import { FiscalYearFormSchema } from '../../../Validation/FiscalYear/FiscalYearFormSchema';

interface FiscalYearModal {
  fiscalYears: IExercice[],
  fiscalYear: { fiscalYear: IExercice, show: boolean, type: string },
  handleClose: () => void,
  onSubmit: (data: any) => void
}

export const FiscalYearModal = ({ fiscalYears, fiscalYear, handleClose, onSubmit }: FiscalYearModal) => {
  const { register, handleSubmit, setValue, reset, formState: { errors } } = useForm({ resolver: yupResolver(FiscalYearFormSchema) })

  useEffect(() => {
    if (Object.keys(fiscalYear.fiscalYear).length > 0 && fiscalYear.type == 'edit') {
      setValue('id', fiscalYear.fiscalYear.id)
      setValue('annee_exercice', fiscalYear.fiscalYear.annee_exercice)
      setValue('date_echeance', fiscalYear.fiscalYear.date_echeance)
      setValue('date_reglement_taxe', fiscalYear.fiscalYear.date_reglement_taxe)
    } else if (fiscalYear.type == 'create') {
      reset()
    }
  }, [fiscalYear])

  const formSubmit = (data: any) => {
    console.log(data)
    onSubmit({ type: fiscalYear.type, data: data })
    handleClose()
  }

  const generateDate = (): number[] => {
    const years: number[] = []
    if (fiscalYear.type === 'edit') {
      fiscalYears.forEach((fisc: IExercice) => years.push(fisc.annee_exercice))
    }
    for (let i = 0; i <= 2; i++) {
      const year = new Date().getFullYear() + i
      if (years.includes(year) === false) {
        years.push(year)
      }
    }
    return years
  }


  return <>
    <Modal show={fiscalYear.show} onHide={handleClose} animation={false}>
      <Modal.Header closeButton>
        <Modal.Title as="h5">{fiscalYear.type == "create" ? "Créer" : "Éditer"} un exercice</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit(formSubmit)}>
          <Form.Group controlId="exercice">
            <Form.Label column="sm">Année de l'exercice</Form.Label>
            <Form.Select size="sm" isInvalid={errors.annee_exercice} {...register('annee_exercice')}>
              {generateDate().map((value: number) => <option value={value}>{value}</option>)}
              {errors.annee_exercice && <Form.Control.Feedback type="invalid">{errors.annee_exercice.message}</Form.Control.Feedback>}
            </Form.Select>
          </Form.Group>
          <Form.Group controlId="echeance">
            <Form.Label column="sm">Date d'échéance</Form.Label>
            <Form.Control type="date" size="sm" isInvalid={errors.date_echeance} {...register('date_echeance')} />
            {errors.date_echeance && <Form.Control.Feedback type="invalid">{errors.date_echeance.message}</Form.Control.Feedback>}
          </Form.Group>
          <Form.Group controlId="reglement_taxe">
            <Form.Label column="sm">Date règlement taxe</Form.Label>
            <Form.Control type="date" size="sm" isInvalid={errors.date_reglement_taxe} {...register('date_reglement_taxe')} />
            {errors.date_reglement_taxe && <Form.Control.Feedback type="invalid">{errors.date_reglement_taxe.message}</Form.Control.Feedback>}
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" size="sm" onClick={handleClose}>
          Annuler
        </Button>
        <Button variant="success" size="sm" onClick={handleSubmit(formSubmit)}>
          {fiscalYear.type == "create" ? "Créer l'exercice" : "Modifier l'exercice"}
        </Button>
      </Modal.Footer>
    </Modal>
  </>
}