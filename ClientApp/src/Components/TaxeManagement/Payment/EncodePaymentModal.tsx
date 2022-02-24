import {
    Modal,
    Button,
    InputGroup,
    Form,
    Card
} from 'react-bootstrap'
import { IPayment } from '../../../Types/IPayment'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm, useWatch } from 'react-hook-form'

interface IEncodePaymentModal {
    show: boolean,
    type: 'create' | 'edit',
    total_tax: number,
    payment?: IPayment,
    handleClose: () => void
}

export const EncodePaymentModal = ({ show, type, total_tax, payment, handleClose }: IEncodePaymentModal) => {

    const { register, handleSubmit, control, setValue, formState: { errors } } = useForm<any>()

    const paymentType = useWatch({
        control,
        name: "type_paiement",
        defaultValue: 1
    })

    const paymentMode = useWatch({
        control,
        name: "mode_paiement",
        defaultValue: 1
    })

    const montant = useWatch({
        control,
        name: "montant",
        defaultValue: 0
    })

    const onSubmit = (data: any) => {
        console.log(data)
    }

    return <>
        <Modal show={show} onHide={handleClose} size="xl" animation={false}>
            <Modal.Header closeButton>
                <Modal.Title>{type === 'create' ? 'Créer' : 'Éditer'} un paiement</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit(onSubmit)}>
                    <Form.Group controlId="type_paiement" className="mt-3">
                        <Form.Label column="sm">Type de paiement</Form.Label>
                        <Form.Select size="sm" {...register('type_paiement')}>
                            <option value={1}>Paiement complet</option>
                            <option value={2}>Paiement incomplet</option>
                        </Form.Select>
                    </Form.Group>
                    <Form.Group controlId="mode_paiement" className="mt-3">
                        <Form.Label column="sm">Mode de paiement</Form.Label>
                        <Form.Select size="sm" {...register('mode_paiement')}>
                            <option value={1}>Virement bancaire</option>
                            <option value={2}>Carte bancaire</option>
                            <option value={3}>Espèces</option>
                        </Form.Select>
                    </Form.Group>
                    {paymentMode == 2 && <Form.Group controlId="type_carte" className="mt-3">
                        <Form.Label column="sm">Type de carte bancaire</Form.Label>
                        <Form.Select size="sm" {...register('type_carte')}>
                            <option value={1}>Maestro/Bancontact</option>
                            <option value={2}>Visa</option>
                            <option value={3}>MasterCard</option>
                        </Form.Select>
                    </Form.Group>}
                    <Form.Group controlId="remarque" className="mt-3">
                        <Form.Label column="sm">Remarque</Form.Label>
                        <Form.Control type="text" as="textarea" {...register('remarque')} />
                    </Form.Group>
                    <Form.Group controlId="montant" className="mt-3">
                        <Form.Label column="sm">Montant payé</Form.Label>
                        <InputGroup size="sm">
                            <Form.Control type="number" size="sm" {...register('montant')} />
                            <InputGroup.Text>€</InputGroup.Text>
                        </InputGroup>
                    </Form.Group>
                    {(paymentMode == 3 && paymentType == 1) &&
                        <Card className="mt-3">
                            <Card.Body>
                                Montant à rendre : {parseFloat(montant) > total_tax ? (montant - total_tax).toFixed(2) + " €" : "0 €"}
                            </Card.Body>
                        </Card>}
                    <Form.Group controlId="date_paiement" className="mt-3">
                        <Form.Label column="sm">Date du paiement</Form.Label>
                        <Form.Control type="date" size="sm" {...register('date')} />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Annuler
                </Button>
                <Button variant="success" onClick={handleSubmit(onSubmit)}>
                    {type === 'create' ? 'Créer' : 'Éditer'} le paiement
                </Button>
            </Modal.Footer>
        </Modal>
    </>
}