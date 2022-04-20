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
import { Loader } from 'react-bootstrap-typeahead'
import { EncodePaymentFormSchema } from '../../../Validation/Payment/EncodePaymentFormSchema'
import { useEffect } from 'react'

interface IEncodePaymentModal {
    show: boolean,
    type: 'create' | 'edit',
    total_tax: number,
    payment?: IPayment,
    onSubmit: (data: IPayment, type: 'edit' | 'create') => Promise<void>,
    handleClose: () => void
}

export const EncodePaymentModal = ({ show, type, total_tax, payment, onSubmit, handleClose }: IEncodePaymentModal) => {

    const Today = () => {
        const date = new Date()
        const month = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1
        const day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
        return `${date.getFullYear()}-${month}-${day}`
    }

    const { register, handleSubmit, control, setValue, setError, reset, formState: { errors, isSubmitting } } = useForm<any>({ defaultValues: { type_paiement: "1", mode_paiement: "1", montant: 0, date: Today() }, resolver: yupResolver(EncodePaymentFormSchema) })

    useEffect(() => {
        if(type === 'edit' && payment != undefined) {
            for(const [key, value] of Object.entries(payment)) {
                setValue(key, value)
            }
        } else {
            reset()
        }
    }, [payment])

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

    const Submit = async (data: any) => {
        if (parseInt(paymentType) == 1 && parseFloat(montant) < total_tax) {
            setError("montant", {
                type: "manual",
                message: "S'agissant d'un paiement complet, le montant ne peut pas être inférieur au montant restant dû"
            })
        } else {
            await onSubmit(data, type)
            reset()
        }
    }

    return <>
        <Modal show={show} onHide={handleClose} size="xl" animation={false}>
            <Modal.Header closeButton>
                <Modal.Title as="h5">{type === 'create' ? 'Créer' : 'Éditer'} un paiement</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit(Submit)}>
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
                        <Form.Control type="text" as="textarea" isInvalid={errors.remarque} {...register('remarque')} />
                        {errors.remarque && <Form.Control.Feedback type="invalid">{errors.remarque.message}</Form.Control.Feedback>}
                    </Form.Group>
                    <Form.Group controlId="montant" className="mt-3">
                        <Form.Label column="sm">Montant payé</Form.Label>
                        <InputGroup size="sm">
                            <Form.Control type="number" size="sm" isInvalid={errors.montant} {...register('montant')} />
                            <InputGroup.Text>€</InputGroup.Text>
                            {errors.montant && <Form.Control.Feedback type="invalid">{errors.montant.message}</Form.Control.Feedback>}
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
                        <Form.Control type="date" size="sm" isInvalid={errors.date} {...register('date')} />
                        {errors.date && <Form.Control.Feedback type="invalid">{errors.date.message}</Form.Control.Feedback>}
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" size="sm" onClick={handleClose}>
                    Annuler
                </Button>
                <Button variant="success" size="sm" onClick={handleSubmit(Submit)} disabled={isSubmitting}>
                    {isSubmitting && <Loader />} {type === 'create' ? 'Créer' : 'Éditer'} le paiement
                </Button>
            </Modal.Footer>
        </Modal>
    </>
}