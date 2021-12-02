import {
    Modal,
    Button,
    Form,
    Col,
    Row,
    InputGroup,
    Image
} from 'react-bootstrap'
import { IPublicite, IPubliciteImage } from "../../Types/IPublicite"
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, Controller, useWatch } from "react-hook-form"
import { AdvertisingFormSchema } from '../../Validation/Tax/AdvertisingFormSchema';
import { AsyncTypeahead, Menu, MenuItem } from 'react-bootstrap-typeahead'
import { apiFetch } from "../../Services/apiFetch";
import { useEffect, useState, useRef, useMemo } from 'react';
import { IRue } from '../../Types/IRue';
import { resourceUsage } from 'process';
import { Trash } from '../UI/Trash';
import { toast } from 'react-toastify';
import { IPricesByTypes } from './ManageAdvertising';

interface IAdvertisingModal {
    type: 'create' | 'edit',
    show: boolean,
    publicite: any,
    matricule: number,
    tarifs: any,
    handleClose: () => void,
    onValidate: (daya: any, type: 'create' | 'edit') => void
}

export const AdvertisingModal = ({ type, show, publicite, matricule, tarifs, handleClose, onValidate }: IAdvertisingModal) => {
    const [streets, setStreets] = useState<IRue[]>(publicite?.rue ? [publicite.rue] : [])
    const [streetId, setStreetId] = useState<number>()
    const [loadingStreets, setLoadingStreets] = useState<boolean>(false)
    const [imagesLinks, setImagesLinks] = useState<IPubliciteImage[]>(publicite?.photos.length > 0 ? publicite.photos : [])
    const { register, control, reset, handleSubmit, watch, getValues, setValue, setError, clearErrors, formState: { errors, isSubmitting } } = useForm({ resolver: yupResolver(AdvertisingFormSchema), defaultValues: publicite ? publicite : { type_publicite: 1, face: 1 } });

    const pricesByTypes: any[] = [
        { type: 1, value: "prix_unitaire_enseigne_non_lumineuse" },
        { type: 2, value: "prix_unitaire_enseigne_lumineuse" },
        { type: 3, value: "prix_unitaire_enseigne_clignotante" },
        { type: 4, value: "prix_unitaire_panneau_non_lumineux" },
        { type: 5, value: "prix_unitaire_panneau_lumineux" },
        { type: 6, value: "prix_unitaire_panneau_a_defilement" }
    ]

    const quantite = useWatch({
        control,
        name: "quantite"
    })

    const surface = useWatch({
        control,
        name: "surface"
    })

    const face = useWatch({
        control,
        name: "face"
    })

    const typePub = useWatch({
        control,
        name: "type_publicite"
    })

    const SumTax = () => {
        const data = pricesByTypes.find((element: any) => element.type == typePub).value
        const price = (surface * tarifs[0][data]) * quantite * face
        return !isNaN(price) ? price.toFixed(2) : 0
    }

    const StreetSearch = async (query: string) => {
        setLoadingStreets(true)
        const streets = await apiFetch(`/rues/getbyname`, {
            method: 'POST',
            body: JSON.stringify({ nom_rue: query })
        })
        setStreets(streets)
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
        if (type == 'create') {
            data.matricule_ciger = matricule
            data.exercice_courant = 2021
        }
        onValidate(data, type)
        handleClose()
    }

    const onFileChange = async (e: any) => {
        const files = e.target.files
        const formData = new FormData()
        Array.from(files).forEach((image: any, index: number) => {
            formData.append(`images`, image)
        })

        const link = await apiFetch(`/entreprises/publicite/uploadimage`, {
            method: 'POST',
            body: formData
        })

        const allImages = [...imagesLinks, ...link.map((l: any) => {
            return { photo: l }
        })]
        setValue('photos', allImages)

        setImagesLinks(links => [...links, ...link.map((l: any) => {
            return { photo: l }
        })])
    }

    const deleteImage = async (imageName: string) => {
        try {
            await apiFetch(`/entreprises/publicite/deleteimage/${imageName}`, {
                method: 'DELETE'
            })
            setImagesLinks(links => links.filter((link: IPubliciteImage) => link.photo != imageName))
            setValue('photos', imagesLinks.filter((link: IPubliciteImage) => link.photo != imageName))
        } catch (e) {
            toast.error('Une erreur est survenue')
        }
    }

    return <>
        <Modal show={show} onHide={handleClose} size="xl">
            <Modal.Header closeButton>
                <Modal.Title>{type == 'edit' ? `Éditer un panneau` : 'Créer un panneau'}</Modal.Title>
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
                                        field: { onChange, onBlur, value, name, ref }
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
                                <Form.Label column="sm">Type panneau</Form.Label>
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
                                <Form.Label column="sm">Situation</Form.Label>
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
                    <Row>
                        <Col>
                            <Form.Group controlId="formFileSm" className="mb-3">
                                <Form.Label>Photos du panneau</Form.Label>
                                <Form.Control type="file" size="sm" accept="image/*" multiple onChange={onFileChange} />
                                <Form.Text className="text-muted">
                                    Maintenez la touche CTRL pour sélectionner plusieurs photos.
                                </Form.Text>
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Form.Group className="mb-3" controlId="taxe_totale">
                                <Form.Label column="sm">Taxe totale</Form.Label>
                                <InputGroup className="mb-2" size="sm">
                                    <Form.Control type="text" disabled placeholder="Taxe totale" size="sm" isInvalid={errors.taxe_totale} value={SumTax()} />
                                    <InputGroup.Text>€</InputGroup.Text>
                                    {errors.taxe_totale && <Form.Control.Feedback type="invalid">{errors.taxe_totale.message}</Form.Control.Feedback>}
                                </InputGroup>
                            </Form.Group>
                        </Col>
                    </Row>
                </Form>
                <div className="d-flex justify-content-start">
                    {imagesLinks.map((image: IPubliciteImage, index: number) => {
                        return <>
                            <div style={{ position: 'relative' }} className="me-4" key={index}>
                                <Button className="btn-circle" onClick={() => deleteImage(image.photo)} style={{ position: 'absolute', top: "-7px", right: "-14px" }} variant="danger" size="sm"><Trash /></Button>
                                <a href={"https://localhost:5001/api/images/" + image.photo} target="_blank"><Image src={"https://localhost:5001/api/images/" + image.photo} style={{ height: "100px", width: "100px" }} rounded /></a>
                            </div>
                        </>
                    })}
                </div>
                {imagesLinks.length > 0 &&
                    <Form.Text className="text-muted">
                        Cliquez sur une photo pour la voir dans sa taille réelle.
                    </Form.Text>
                }
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Annuler
                </Button>
                <Button variant="success" onClick={handleSubmit(onSubmit)}>
                    {type == 'create' ? 'Créer' : 'Modifier'}
                </Button>
            </Modal.Footer>
        </Modal>
    </>
}