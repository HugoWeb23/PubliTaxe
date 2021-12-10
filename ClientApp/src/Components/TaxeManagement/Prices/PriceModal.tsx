import { useForm } from 'react-hook-form'
import {
  Modal,
  Button,
  Form
} from 'react-bootstrap'
import { useEffect, useState } from 'react'
import { IPrice } from '../../../Types/IPrice'

interface FiscalYearModal {
  element: { price: IPrice, show: boolean, type: string },
  handleClose: () => void,
  onSubmit: (data: any) => void
}

export const PriceModal = ({ element, handleClose, onSubmit }: FiscalYearModal) => {
  const { register, handleSubmit, setValue, reset } = useForm()

  useEffect(() => {
    if (Object.keys(element.price).length > 0 && element.type == 'edit') {
        for(const [key, value] of Object.entries(element.price)) {
            setValue(key, value)
        }
    } else if(element.type == 'create') {
      reset()
    }
  }, [element])

  const formSubmit = (data: any) => {
    console.log(data)
    onSubmit({type: element.type, data: data})
    handleClose()
  }

  return <>
    <Modal show={element.show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{element.type == "create" ? "Créer" : "Éditer"} un tarif</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit(formSubmit)}>
          <Form.Group controlId="ENL">
            <Form.Label column="sm">P.U. enseigne non lumineuse</Form.Label>
            <Form.Control type="text" size="sm" {...register('prix_unitaire_enseigne_non_lumineuse')} />
          </Form.Group>
          <Form.Group controlId="EL">
            <Form.Label column="sm">P.U. enseigne lumineuse</Form.Label>
            <Form.Control type="text" size="sm" {...register('prix_unitaire_enseigne_lumineuse')} />
          </Form.Group>
          <Form.Group controlId="EC">
            <Form.Label column="sm">P.U. enseigne clignotante</Form.Label>
            <Form.Control type="text" size="sm" {...register('prix_unitaire_enseigne_clignotante')} />
          </Form.Group>
          <Form.Group controlId="PNN">
            <Form.Label column="sm">P.U. panneau non lumineux</Form.Label>
            <Form.Control type="text" size="sm" {...register('prix_unitaire_panneau_non_lumineux')} />
          </Form.Group>
          <Form.Group controlId="PL">
            <Form.Label column="sm">P.U. panneau lumineux</Form.Label>
            <Form.Control type="text" size="sm" {...register('prix_unitaire_panneau_lumineux')} />
          </Form.Group>
          <Form.Group controlId="PAD">
            <Form.Label column="sm">P.U. panneau à défilement</Form.Label>
            <Form.Control type="text" size="sm" {...register('prix_unitaire_panneau_a_defilement')} />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Annuler
        </Button>
        <Button variant="primary" onClick={handleSubmit(formSubmit)}>
          {element.type == "create" ? "Créer" : "Modifier"}
        </Button>
      </Modal.Footer>
    </Modal>
  </>
}