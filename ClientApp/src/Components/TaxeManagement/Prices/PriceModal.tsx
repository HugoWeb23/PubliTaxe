import { useForm } from 'react-hook-form'
import {
  Modal,
  Button,
  Form,
  Row,
  Col
} from 'react-bootstrap'
import { useEffect } from 'react'
import { IPrice } from '../../../Types/IPrice'
import { IExercice } from '../../../Types/IExercice'
import { yupResolver } from '@hookform/resolvers/yup';
import { PriceSchema } from '../../../Validation/Price/PriceForm'

interface FiscalYearModal {
  element: { price: IPrice, show: boolean, type: string },
  fiscalYears: IExercice[],
  currentFiscalYear: IExercice,
  handleClose: () => void,
  onSubmit: (data: any) => Promise<void>
}

export const PriceModal = ({ element, fiscalYears, currentFiscalYear, handleClose, onSubmit }: FiscalYearModal) => {
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

  const ShowFiscalYears = (): IExercice[] => {
    const years: IExercice[] = []
    if(element.type === 'create') {
     fiscalYears.forEach((y: IExercice) => y.annee_exercice >= currentFiscalYear.annee_exercice ? years.push(y) : null)
    } else {
      years.push(...fiscalYears)
    }
    return years;
  }
  return <>
    <Modal show={element.show} onHide={handleClose} animation={false}>
      <Modal.Header closeButton>
        <Modal.Title as="h5">{element.type == "create" ? "Créer" : "Éditer"} un tarif</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit(formSubmit)}>
          <Form.Group controlId="Exercice" className="mb-1">
            <Form.Label column="sm">Exercice</Form.Label>
            <Form.Select size="sm" isInvalid={errors.exerciceId} {...register('exerciceId')}>
              {ShowFiscalYears().map((fiscalYear: IExercice) => <option value={fiscalYear.id}>{fiscalYear.annee_exercice}</option>)}
            </Form.Select>
            {errors.exerciceId && <Form.Control.Feedback type="invalid">{errors.exerciceId.message}</Form.Control.Feedback>}
          </Form.Group>
          <Row>
          <Col>
          <Form.Group controlId="ENL" className="mb-1">
            <Form.Label column="sm">ENL</Form.Label>
            <Form.Control type="text" size="sm" placeholder="0.00" isInvalid={errors.prix_unitaire_enseigne_non_lumineuse} {...register('prix_unitaire_enseigne_non_lumineuse')} />
            {errors.prix_unitaire_enseigne_non_lumineuse && <Form.Control.Feedback type="invalid">{errors.prix_unitaire_enseigne_non_lumineuse.message}</Form.Control.Feedback>}
          </Form.Group>
          <Form.Group controlId="EL" className="mb-1">
            <Form.Label column="sm">EL</Form.Label>
            <Form.Control type="text" size="sm" placeholder="0.00" isInvalid={errors.prix_unitaire_enseigne_lumineuse} {...register('prix_unitaire_enseigne_lumineuse')} />
            {errors.prix_unitaire_enseigne_lumineuse && <Form.Control.Feedback type="invalid">{errors.prix_unitaire_enseigne_lumineuse.message}</Form.Control.Feedback>}
          </Form.Group>
          </Col>
          <Col>
          <Form.Group controlId="EC" className="mb-1">
            <Form.Label column="sm">EC</Form.Label>
            <Form.Control type="text" size="sm" placeholder="0.00" isInvalid={errors.prix_unitaire_enseigne_clignotante} {...register('prix_unitaire_enseigne_clignotante')} />
            {errors.prix_unitaire_enseigne_clignotante && <Form.Control.Feedback type="invalid">{errors.prix_unitaire_enseigne_clignotante.message}</Form.Control.Feedback>}
          </Form.Group>
          <Form.Group controlId="PNN" className="mb-1">
            <Form.Label column="sm">PNL</Form.Label>
            <Form.Control type="text" size="sm" placeholder="0.00" isInvalid={errors.prix_unitaire_panneau_non_lumineux} {...register('prix_unitaire_panneau_non_lumineux')} />
            {errors.prix_unitaire_panneau_non_lumineux && <Form.Control.Feedback type="invalid">{errors.prix_unitaire_panneau_non_lumineux.message}</Form.Control.Feedback>}
          </Form.Group>
          </Col>
          <Col>
          <Form.Group controlId="PL" className="mb-1">
            <Form.Label column="sm">PL</Form.Label>
            <Form.Control type="text" size="sm" placeholder="0.00" isInvalid={errors.prix_unitaire_panneau_lumineux} {...register('prix_unitaire_panneau_lumineux')} />
            {errors.prix_unitaire_panneau_lumineux && <Form.Control.Feedback type="invalid">{errors.prix_unitaire_panneau_lumineux.message}</Form.Control.Feedback>}
          </Form.Group>
          <Form.Group controlId="PAD">
            <Form.Label column="sm">PAD</Form.Label>
            <Form.Control type="text" size="sm" placeholder="0.00" isInvalid={errors.prix_unitaire_panneau_a_defilement} {...register('prix_unitaire_panneau_a_defilement')} />
            {errors.prix_unitaire_panneau_a_defilement && <Form.Control.Feedback type="invalid">{errors.prix_unitaire_panneau_a_defilement.message}</Form.Control.Feedback>}
          </Form.Group>
          </Col>
          </Row>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" size="sm" onClick={handleClose}>
          Annuler
        </Button>
        <Button variant="success" size="sm" onClick={handleSubmit(formSubmit)}>
          {element.type == "create" ? "Créer le tarif" : "Modifier le tarif"}
        </Button>
      </Modal.Footer>
    </Modal>
  </>
}