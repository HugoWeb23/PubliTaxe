import {
    Modal,
    Button,
    Form,
    Col,
    Row,
    InputGroup
} from 'react-bootstrap'
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, Controller, useWatch } from "react-hook-form"
import { AdvertisingFormSchema } from '../../../Validation/Tax/AdvertisingFormSchema';
import { AsyncTypeahead, Menu, MenuItem } from 'react-bootstrap-typeahead'
import { ApiErrors, apiFetch } from "../../../Services/apiFetch";
import { useState } from 'react';
import { IRue } from '../../../Types/IRue';
import { toast } from 'react-toastify';
import { v1 as uuidv1 } from 'uuid'


interface IAdvertisingSimulationModal {
    type: 'create' | 'edit',
    show: boolean,
    publicite: any,
    handleClose: () => void,
    onValidate: (daya: any, type: 'create' | 'edit') => void
}

export const AdvertisingModalSimulation = ({ type, show, publicite, handleClose, onValidate }: IAdvertisingSimulationModal) => {
    const [streets, setStreets] = useState<IRue[]>(publicite?.rue ? [publicite.rue] : [])
    const [streetId, setStreetId] = useState<number>()
    const [loadingStreets, setLoadingStreets] = useState<boolean>(false)
    const { register, control, reset, handleSubmit, watch, getValues, setValue, setError, clearErrors, formState: { errors, isSubmitting } } = useForm({ resolver: yupResolver(AdvertisingFormSchema), defaultValues: publicite ? publicite : { type_publicite: 1, face: 1, exoneration: false, quantite: "1" } });

    const quantite = useWatch({
        control,
        name: "quantite"
    })

    const surface = useWatch({
        control,
        name: "surface"
    })

    const StreetSearch = async (query: string) => {
        setLoadingStreets(true)
        try {
            const streets = await apiFetch(`/rues/getbyname`, {
                method: 'POST',
                body: JSON.stringify({ nom_rue: query })
            })
            setStreets(streets)
        } catch (e: any) {
            if (e instanceof ApiErrors) {
                toast.error(e.singleError.error)
            }
        }
        setLoadingStreets(false)
    }

    const SetValueOnChange = (data: any) => {
        const rue: IRue = { ...data[0] }
        const inputvalue = { ...data }
        if (Object.keys(rue).length > 0) {
            setStreetId(rue.rueId)
            setValue('rue', rue)
            clearErrors(['rue.nom_rue', 'rue.code_rue', 'rue.code_postal.cp'])
        } else {
            setValue('rue.nom_rue', inputvalue.nom_rue)
        }
    }

    const onSubmit = (data: any) => {
        if (streetId != undefined) {
            data.id_rue = streetId
        }
        if(type == 'create') {
            data.uuid = uuidv1()
        }
        data.face = parseInt(data.face, 10)
        onValidate(data, type)
        handleClose()
    }

    return <>
        <Modal show={show} onHide={handleClose} size="xl" animation={false}>
            <Modal.Header closeButton>
                <Modal.Title as="h5">{type == 'edit' ? `Éditer une publicité` : 'Créer une publicité'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit(onSubmit)}>
                    <Row>
                        <Col>
                            <Form.Group className="mb-3" controlId="code_postal">
                                <Form.Label column="sm">Code postal</Form.Label>
                                <Form.Control type="text" placeholder="Code postal" isInvalid={errors.rue && errors.rue.code_postal?.cp} disabled size="sm" {...register('rue.code_postal.cp')} />
                                {errors.rue && errors.rue.code_postal && errors.rue.code_postal.cp && <Form.Control.Feedback type="invalid">{errors.rue.code_postal.cp.message}</Form.Control.Feedback>}
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group className="mb-3" controlId="code_rue">
                                <Form.Label column="sm">Code rue</Form.Label>
                                <Form.Control type="text" placeholder="Code rue" isInvalid={errors.rue && errors.rue.code_rue} disabled size="sm" {...register('rue.code_rue')} />
                                {errors.rue && errors.rue.code_rue && <Form.Control.Feedback type="invalid">{errors.rue.code_rue.message}</Form.Control.Feedback>}
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Form.Group className="mb-3" controlId="adresse_rue">
                                <Form.Label column="sm">Adresse</Form.Label>
                                <Controller
                                    control={control}
                                    name="rue.nom_rue"
                                    render={({
                                        field: { value }
                                    }) => (
                                        <AsyncTypeahead
                                            filterBy={() => true}
                                            id="rue"
                                            isLoading={loadingStreets}
                                            labelKey="nom_rue"
                                            placeholder="Rue"
                                            isInvalid={errors.rue && errors.rue.nom_rue}
                                            onSearch={(query) => StreetSearch(query)}
                                            options={streets}
                                            onChange={(value: any[]) => SetValueOnChange(value)}
                                            emptyLabel='Aucun résultat'
                                            defaultInputValue={value}
                                            size="sm"
                                            className="is-invalid"
                                            autoFocus={type === 'create'}
                                            renderMenu={(results, menuProps) => (
                                                <Menu {...menuProps}>
                                                    {results.map((result, index) => (
                                                        <>
                                                            {result.code_postal &&
                                                                <MenuItem
                                                                    key={index}
                                                                    option={result}
                                                                    position={index}>
                                                                    <div>{result.nom_rue}</div>
                                                                    <div>
                                                                        <small>{result.code_postal.localite}</small>
                                                                    </div>
                                                                </MenuItem>
                                                            }
                                                        </>
                                                    ))}
                                                </Menu>
                                            )}
                                        />
                                    )} />
                                {errors.rue && errors.rue.nom_rue && <Form.Control.Feedback type="invalid">{errors.rue.nom_rue.message}</Form.Control.Feedback>}
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group className="mb-3" controlId="adresse_numero">
                                <Form.Label column="sm">Numéro</Form.Label>
                                <Form.Control type="text" placeholder="Numéro" size="sm" isInvalid={errors.adresse_numero} {...register('adresse_numero')} />
                                {errors.adresse_numero && <Form.Control.Feedback type="invalid">{errors.adresse_numero.message}</Form.Control.Feedback>}
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Form.Group className="mb-3" controlId="type_publicite">
                                <Form.Label column="sm">Type publicité</Form.Label>
                                <Form.Select size="sm" isInvalid={errors.type_publicite} {...register('type_publicite')}>
                                    <option value={1}>Enseigne non lumineuse</option>
                                    <option value={2}>Enseigne lumineuse</option>
                                    <option value={3}>Enseigne clignotante</option>
                                    <option value={4}>Panneau non lumineux</option>
                                    <option value={5}>Panneau lumineux</option>
                                    <option value={6}>Panneau à défilement</option>
                                </Form.Select>
                                {errors.type_publicite && <Form.Control.Feedback type="invalid">{errors.type_publicite.message}</Form.Control.Feedback>}
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Form.Group className="mb-3" controlId="situation">
                                <Form.Label column="sm">Situation <span className="fw-light">(optionnel)</span></Form.Label>
                                <Form.Control type="text" as="textarea" placeholder="Situation" size="sm" isInvalid={errors.situation} {...register('situation')} />
                                {errors.situation && <Form.Control.Feedback type="invalid">{errors.situation.message}</Form.Control.Feedback>}
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Form.Group className="mb-3" controlId="quantite">
                                <Form.Label column="sm">Quantité</Form.Label>
                                <Form.Control type="text" placeholder="Quantité" size="sm" isInvalid={errors.quantite} {...register('quantite')} />
                                {errors.quantite && <Form.Control.Feedback type="invalid">{errors.quantite.message}</Form.Control.Feedback>}
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group controlId="face">
                                <Form.Label column="sm">Face</Form.Label>
                                <Form.Select size="sm" isInvalid={errors.face} {...register('face')}>
                                    <option value={1}>Simple</option>
                                    <option value={2}>Double</option>
                                    <option value={3}>Triple</option>
                                </Form.Select>
                                {errors.face && <Form.Control.Feedback type="invalid">{errors.face.message}</Form.Control.Feedback>}
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group className="mb-3" controlId="surface">
                                <Form.Label column="sm">Surface unitaire</Form.Label>
                                <InputGroup className="mb-2" size="sm">
                                    <Form.Control type="text" placeholder="Surface unitaire" size="sm" isInvalid={errors.surface} {...register('surface')} />
                                    <InputGroup.Text>dm²</InputGroup.Text>
                                    {errors.surface && <Form.Control.Feedback type="invalid">{errors.surface.message}</Form.Control.Feedback>}
                                </InputGroup>
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Form.Group className="mb-3" controlId="mesure">
                                <Form.Label column="sm">Mesure</Form.Label>
                                <Form.Control type="text" placeholder="Mesure" size="sm" isInvalid={errors.mesure} {...register('mesure')} />
                                {errors.mesure && <Form.Control.Feedback type="invalid">{errors.mesure.message}</Form.Control.Feedback>}
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group className="mb-3" controlId="surface_totale">
                                <Form.Label column="sm">Surface totale</Form.Label>
                                <InputGroup className="mb-2" size="sm">
                                    <Form.Control type="text" disabled placeholder="Surface totale" size="sm" isInvalid={errors.surface_totale} value={isNaN(quantite * surface) != true ? (quantite * surface) : 0} />
                                    <InputGroup.Text>dm²</InputGroup.Text>
                                    {errors.surface_totale && <Form.Control.Feedback type="invalid">{errors.surface_totale.message}</Form.Control.Feedback>}
                                </InputGroup>
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group controlId="exoneration">
                                <Form.Label column="sm">Exonération</Form.Label>
                                <Form.Check type="checkbox" isInvalid={errors.exoneration} {...register('exoneration')} />
                                {errors.exoneration && <Form.Control.Feedback type="invalid">{errors.exoneration.message}</Form.Control.Feedback>}
                            </Form.Group>
                        </Col>
                    </Row>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" size="sm" onClick={handleClose}>
                    Annuler
                </Button>
                <Button variant="success" size="sm" onClick={handleSubmit(onSubmit)}>
                    {type == 'create' ? 'Créer' : 'Modifier'}
                </Button>
            </Modal.Footer>
        </Modal>
    </>
}