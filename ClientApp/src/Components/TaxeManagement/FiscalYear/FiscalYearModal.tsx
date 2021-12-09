import {useForm} from 'react-hook-form'
import {
    Modal,
    Button,
    Form
} from 'react-bootstrap'

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

    return <>
    <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{type == "create" ? "Créer" : "Éditer"} un exercice</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form onSubmit={handleSubmit(formSubmit)}>
                <Form.Group controlId="exercice">
                    <Form.Label column="sm">Année de l'exercice</Form.Label>
                    <Form.Control size="sm" {...register('annee_exercice')}/>
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
          <Button variant="primary" onClick={handleClose}>
            {type == "create" ? "Créer" : "Modifier"}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
}