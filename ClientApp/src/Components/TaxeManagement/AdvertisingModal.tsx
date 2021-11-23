import {
    Modal,
    Button,
    Form,
    Col,
    Row,
    InputGroup
} from 'react-bootstrap'
import { IPublicite } from "../../Types/IPublicite"
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, Controller } from "react-hook-form"
import { AdvertisingFormSchema } from '../../Validation/Tax/AdvertisingFormSchema';
import { AsyncTypeahead, Menu, MenuItem } from 'react-bootstrap-typeahead'
import { apiFetch } from "../../Services/apiFetch";
import { useEffect, useState } from 'react';
import { IRue } from '../../Types/IRue';
import { resourceUsage } from 'process';

interface IAdvertisingModal {
    type: 'create' | 'edit',
    show: boolean,
    publicite: IPublicite | null,
    handleClose: () => void,
    onValidate: (daya: any, type: 'create' | 'edit') => void
}

export const AdvertisingModal = ({ type, show, publicite, handleClose, onValidate }: IAdvertisingModal) => {
    const [streets, setStreets] = useState<IRue[]>(publicite?.rue ? [publicite.rue] : [])
    const [streetId, setStreetId] = useState<number>()
    const { register, control, handleSubmit, watch, getValues, setValue, setError, clearErrors, formState: { errors, isSubmitting } } = useForm({ resolver: yupResolver(AdvertisingFormSchema), defaultValues: publicite ? publicite : {} });

    const StreetSearch = async (query: string) => {
        const streets = await apiFetch(`/rues/getbyname`, {
            method: 'POST',
            body: JSON.stringify({ nom_rue: query })
        })
        setStreets(streets)
    }

    const SetValueOnChange = (data: any) => {
        const rue: IRue = { ...data[0] }
        const inputvalue = { ...data }
        if (Object.keys(rue).length > 0) {
            setStreetId(rue.rueId)
            setValue('rue', rue)
            clearErrors('rue.nom_rue')
        } else {
            setValue('rue.nom_rue', inputvalue.nom_rue)
        }
    }

    const onSubmit = (data: any) => {
        if (streetId != undefined) {
            data.id_rue = streetId
        }
        onValidate(data, type)
        handleClose()
    }

    return <>
        <Modal show={show} onHide={handleClose} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>{type == 'edit' ? `Éditer le panneau ${publicite?.numero_panneau}` : 'Créer un panneau'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit(onSubmit)}>
                    <Row>
                        <Col>
                            <Form.Group className="mb-3" controlId="code_postal">
                                <Form.Label column="sm">Code postal</Form.Label>
                                <Form.Control type="text" placeholder="Code postal" disabled size="sm" {...register('rue.code_postal.cp')} />
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group className="mb-3" controlId="code_rue">
                                <Form.Label column="sm">Code rue</Form.Label>
                                <Form.Control type="text" placeholder="Code rue" disabled size="sm" {...register('rue.code_rue')} />
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
                                        field: { onChange, onBlur, value, name, ref }
                                    }) => (
                                        <AsyncTypeahead
                                            filterBy={() => true}
                                            id="rue"
                                            isLoading={false}
                                            labelKey="nom_rue"
                                            placeholder="Rue"
                                            isInvalid={false}
                                            onSearch={(query) => StreetSearch(query)}
                                            options={streets}
                                            onChange={(value: any[]) => SetValueOnChange(value)}
                                            emptyLabel='Aucun résultat'
                                            defaultInputValue={value}
                                            size="sm"
                                            className="is-invalid"
                                            renderMenu={(results, menuProps) => (
                                                <Menu {...menuProps}>
                                                    {results.map((result, index) => (
                                                        <MenuItem
                                                            key={index}
                                                            option={result}
                                                            position={index}>
                                                            <div>{result.nom_rue}</div>
                                                            <div>
                                                                <small>{result.code_postal.localite}</small>
                                                            </div>
                                                        </MenuItem>
                                                    ))}
                                                </Menu>
                                            )}
                                        />
                                    )} />
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group className="mb-3" controlId="adresse_numero">
                                <Form.Label column="sm">Numéro</Form.Label>
                                <Form.Control type="text" placeholder="Numéro" size="sm" {...register('adresse_numero')} />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Form.Group controlId="type_publicite">
                                <Form.Label column="sm">Type panneau</Form.Label>
                                <Form.Select size="sm" {...register('type_publicite')}>
                                    <option value="1">Enseigne non lumineuse</option>
                                    <option value="2">Enseigne lumineuse</option>
                                    <option value="3">Enseigne clignotante</option>
                                    <option value="4">Panneau lumineux</option>
                                    <option value="5">Panneau non lumineux</option>
                                    <option value="6">Panneau à défilement</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Form.Group className="mb-3" controlId="situation">
                                <Form.Label column="sm">Situation</Form.Label>
                                <Form.Control type="text" as="textarea" placeholder="Situation" size="sm" {...register('situation')} />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Form.Group className="mb-3" controlId="quantite">
                                <Form.Label column="sm">Quantité</Form.Label>
                                <Form.Control type="text" placeholder="Quantité" size="sm" {...register('quantite')} />
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group controlId="face">
                                <Form.Label column="sm">Face</Form.Label>
                                <Form.Select size="sm" {...register('face')}>
                                    <option value="1">Simple</option>
                                    <option value="2">Double</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group className="mb-3" controlId="surface_unitaire">
                                <Form.Label column="sm">Surface unitaire</Form.Label>
                                <InputGroup className="mb-2" size="sm">
                                    <Form.Control type="text" placeholder="Surface unitaire" size="sm" {...register('surface')} />
                                    <InputGroup.Text>dm²</InputGroup.Text>
                                </InputGroup>
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Form.Group className="mb-3" controlId="mesure">
                                <Form.Label column="sm">Mesure</Form.Label>
                                <Form.Control type="text" placeholder="Mesure" size="sm" {...register('mesure')} />
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group className="mb-3" controlId="surface_totale">
                                <Form.Label column="sm">Surface totale</Form.Label>
                                <InputGroup className="mb-2" size="sm">
                                    <Form.Control type="text" disabled placeholder="Surface totale" size="sm" {...register('surface_totale')} />
                                    <InputGroup.Text>dm²</InputGroup.Text>
                                </InputGroup>
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group controlId="exoneration">
                                <Form.Label column="sm">Exonération</Form.Label>
                                <Form.Check type="checkbox" {...register('exoneration')} />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Form.Group className="mb-3" controlId="taxe_totale">
                                <Form.Label column="sm">Taxe totale</Form.Label>
                                <InputGroup className="mb-2" size="sm">
                                    <Form.Control type="text" disabled placeholder="Taxe totale" size="sm" {...register('taxe_totale')} />
                                    <InputGroup.Text>€</InputGroup.Text>
                                </InputGroup>
                            </Form.Group>
                        </Col>
                    </Row>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Annuler
                </Button>
                <Button variant="success" onClick={handleSubmit(onSubmit)}>
                    Modifier
                </Button>
            </Modal.Footer>
        </Modal>
    </>
}