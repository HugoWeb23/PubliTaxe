import { useForm } from 'react-hook-form'
import {
  Modal,
  Button,
  Form
} from 'react-bootstrap'
import { useEffect, useRef } from 'react'
import { IPrice } from '../../../Types/IPrice'
import { IExercice } from '../../../Types/IExercice'
import { yupResolver } from '@hookform/resolvers/yup';
import { PriceSchema } from '../../../Validation/Price/PriceForm'

interface FiscalYearModal {
  element: { price: IPrice, show: boolean, type: string },
  fiscalYears: IExercice[],
  fiscalYearsUsed: number[],
  handleClose: () => void,
  onSubmit: (data: any) => Promise<void>
}

export const PriceModal = ({ element, fiscalYears, fiscalYearsUsed, handleClose, onSubmit }: FiscalYearModal) => {
  const { register, handleSubmit, setValue, reset, formState: { errors } } = useForm({ resolver: yupResolver(PriceSchema) })

  useEffect(() => {
    if (Object.keys(element.price).length > 0 && element.type == 'edit') {
      for (const [key, value] of Object.entries(element.price)) {
        setValue(key, value)
      }
    } else if (element.type == 'create') {
      reset()
    }
  }, [element])

  const formSubmit = async (data: any) => {
    await onSubmit({ type: element.type, data })
  }

  return <>
    <Modal show={element.show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{element.type == "create" ? "Créer" : "Éditer"} un tarif</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit(formSubmit)}>
          <Form.Group controlId="Exercice" className="mb-1">
            <Form.Label column="sm">Exercice</Form.Label>
            <Form.Select size="sm" isInvalid={errors.exerciceId} {...register('exerciceId')}>
              {fiscalYears.map((fiscalYear: IExercice) => <option value={fiscalYear.id} disabled={fiscalYearsUsed.includes(fiscalYear.id)}>{fiscalYear.annee_exercice}</option>)}
            </Form.Select>
            <Form.Text className="text-muted">
              Les exercices déjà utilisés appraissent grisés dans la liste.
            </Form.Text>
            {errors.exerciceId && <Form.Control.Feedback type="invalid">{errors.exerciceId.message}</Form.Control.Feedback>}
          </Form.Group>
          <Form.Group controlId="ENL" className="mb-1">
            <Form.Label column="sm">P.U. enseigne non lumineuse</Form.Label>
            <Form.Control type="text" size="sm" placeholder="0.00" isInvalid={errors.prix_unitaire_enseigne_non_lumineuse} {...register('prix_unitaire_enseigne_non_lumineuse')} />
            {errors.prix_unitaire_enseigne_non_lumineuse && <Form.Control.Feedback type="invalid">{errors.prix_unitaire_enseigne_non_lumineuse.message}</Form.Control.Feedback>}
          </Form.Group>
          <Form.Group controlId="EL" className="mb-1">
            <Form.Label column="sm">P.U. enseigne lumineuse</Form.Label>
            <Form.Control type="text" size="sm" placeholder="0.00" isInvalid={errors.prix_unitaire_enseigne_lumineuse} {...register('prix_unitaire_enseigne_lumineuse')} />
            {errors.prix_unitaire_enseigne_lumineuse && <Form.Control.Feedback type="invalid">{errors.prix_unitaire_enseigne_lumineuse.message}</Form.Control.Feedback>}
          </Form.Group>
          <Form.Group controlId="EC" className="mb-1">
            <Form.Label column="sm">P.U. enseigne clignotante</Form.Label>
            <Form.Control type="text" size="sm" placeholder="0.00" isInvalid={errors.prix_unitaire_enseigne_clignotante} {...register('prix_unitaire_enseigne_clignotante')} />
            {errors.prix_unitaire_enseigne_clignotante && <Form.Control.Feedback type="invalid">{errors.prix_unitaire_enseigne_clignotante.message}</Form.Control.Feedback>}
          </Form.Group>
          <Form.Group controlId="PNN" className="mb-1">
            <Form.Label column="sm">P.U. panneau non lumineux</Form.Label>
            <Form.Control type="text" size="sm" placeholder="0.00" isInvalid={errors.prix_unitaire_panneau_non_lumineux} {...register('prix_unitaire_panneau_non_lumineux')} />
            {errors.prix_unitaire_panneau_non_lumineux && <Form.Control.Feedback type="invalid">{errors.prix_unitaire_panneau_non_lumineux.message}</Form.Control.Feedback>}
          </Form.Group>
          <Form.Group controlId="PL" className="mb-1">
            <Form.Label column="sm">P.U. panneau lumineux</Form.Label>
            <Form.Control type="text" size="sm" placeholder="0.00" isInvalid={errors.prix_unitaire_panneau_lumineux} {...register('prix_unitaire_panneau_lumineux')} />
            {errors.prix_unitaire_panneau_lumineux && <Form.Control.Feedback type="invalid">{errors.prix_unitaire_panneau_lumineux.message}</Form.Control.Feedback>}
          </Form.Group>
          <Form.Group controlId="PAD">
            <Form.Label column="sm">P.U. panneau à défilement</Form.Label>
            <Form.Control type="text" size="sm" placeholder="0.00" isInvalid={errors.prix_unitaire_panneau_a_defilement} {...register('prix_unitaire_panneau_a_defilement')} />
            {errors.prix_unitaire_panneau_a_defilement && <Form.Control.Feedback type="invalid">{errors.prix_unitaire_panneau_a_defilement.message}</Form.Control.Feedback>}
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Annuler
        </Button>
        <Button variant="success" onClick={handleSubmit(formSubmit)}>
          {element.type == "create" ? "Créer le tarif" : "Modifier le tarif"}
        </Button>
      </Modal.Footer>
    </Modal>
  </>
}