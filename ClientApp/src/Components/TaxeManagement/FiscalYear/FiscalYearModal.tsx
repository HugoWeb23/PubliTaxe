import {useForm} from 'react-hook-form'
import {
    Modal,
    Button,
    Form
} from 'react-bootstrap'
import { useEffect, useState } from 'react'

interface FiscalYearModal {
    type: 'create' | 'edit',
    show: boolean,
    handleClose: () => void,
    onSubmit: (data: any) => void
}

export const FiscalYearModal = ({type, show, handleClose, onSubmit}: FiscalYearModal) => {
    const {register, handleSubmit} = useForm()

    const formSubmit = (data: any) => {
        onSubmit(data)
        handleClose()
    }

    const generateDate = (): number[] => {
      const years: number[] = []
      for(let i = 0; i < 2; i++) {
        years.push(new Date().getFullYear() + i)
      }
      return years
    }


    return <>
    <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{type == "create" ? "Créer" : "Éditer"} un exercice</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form onSubmit={handleSubmit(formSubmit)}>
                <Form.Group controlId="exercice">
                    <Form.Label column="sm">Année de l'exercice</Form.Label>
                   <Form.Select {...register('annee_exercice')}>
                    {generateDate().map((value: number, index: number) => <option value={value}>{value}</option>)}
                    </Form.Select>
                </Form.Group>
                <Form.Group controlId="echeance">
                    <Form.Label column="sm">Date d'échéance</Form.Label>
                    <Form.Control type="date" size="sm" {...register('date_echeance')}/>
                </Form.Group>
                <Form.Group controlId="reglement_taxe">
                    <Form.Label column="sm">Date limite règlement taxe</Form.Label>
                    <Form.Control type="date" size="sm" {...register('date_reglement_taxe')}/>
                </Form.Group>
            </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Annuler
          </Button>
          <Button variant="primary" onClick={handleSubmit(formSubmit)}>
            {type == "create" ? "Créer" : "Modifier"}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
}