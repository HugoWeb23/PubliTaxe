import { useEffect, useState } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form"
import {
    FormControl,
    Form,
    Button,
    Row,
    Col,
    Table
} from 'react-bootstrap'
import { Typeahead } from 'react-bootstrap-typeahead'
import { Entreprise } from '../../Types/IEntreprise'
import { StreetCodeModal } from "./StreetCodeModal";
import { IRue } from "../../Types/IRue";
import { IMotif_majoration } from "../../Types/IMotif_majoration";
import { apiFetch } from "../../Services/apiFetch";
import { Loader } from "../UI/Loader";
import { ErrorAlert } from "../UI/ErrorAlert";
import { toast } from 'react-toastify';

interface TaxeForm {
    data?: any,
    type: 'create' | 'edit',
    onFormSubmit: (data: any) => void
}

export const TaxeForm = ({ data = {}, type, onFormSubmit }: TaxeForm) => {
    const [streetCodeModal, setStreetCodeModal] = useState<boolean>(false)
    const [markUpReasons, setMarkUpReasons] = useState<IMotif_majoration[]>([])
    const { register, control, handleSubmit, watch, getValues, setValue, setError, clearErrors, formState: { errors, isSubmitting } } = useForm(data ? {defaultValues: data} : {});

    useEffect(() => {
        (async () => {
            const reasons = await apiFetch('/motifs_majoration/getall')
            setMarkUpReasons(reasons)
        })()
    }, [])

    const OnSubmit = async(data: any) => {
        delete data.publicites
        try {
            await onFormSubmit(data)
            toast.success('Modifications sauvegardées')
        } catch(e: any) {
            toast.error('Une erreur est survenue')
        }
    }

    const handleSelectStreet = (street: IRue) => {
        setValue('code_rue', street.code_rue)
        setValue('adresse_rue', street.nom_rue)
        setValue('code_postal', street.code_postal)
    }
    return <>
        <StreetCodeModal isOpen={streetCodeModal} handleClose={() => setStreetCodeModal(false)} onSelect={handleSelectStreet} />
        <Form onSubmit={handleSubmit(OnSubmit)} className="mb-3">
        <div className="d-flex justify-content-start">
        <Button variant="success" type="submit" className="mt-3" disabled={isSubmitting}>{type == "create" ? "Créer l'entreprise" : "Modifier l'entreprise"}</Button>
        </div>
            <Row className="mb-3">
                <Col>
                    <Form.Group controlId="matricule_ciger">
                        <Form.Label>Matricule Ciger</Form.Label>
                        <Form.Control type="text" placeholder="Matricule Ciger" disabled={type == 'edit'} {...register('matricule_ciger')} />
                    </Form.Group>
                </Col>
                <Col>
                    <Form.Group controlId="proces_verbal">
                        <Form.Label>Procès verbal</Form.Label>
                        <Form.Check type="checkbox" {...register('proces_verbal')} />
                    </Form.Group>
                </Col>
                <Col>
                    <Form.Group controlId="province">
                        <Form.Label>Province</Form.Label>
                        <Form.Check type="checkbox" {...register('province')} />
                    </Form.Group>
                </Col>
                <Col>
                    <Form.Group controlId="recu">
                        <Form.Label>Reçu</Form.Label>
                        <Form.Check type="checkbox" {...register('recu')} />
                    </Form.Group>
                </Col>
                <Col>
                    <Form.Group controlId="langue">
                        <Form.Label>Langue</Form.Label>
                        <Form.Select {...register('role_linguistique')}>
                            <option value="1">Français</option>
                            <option value="2">Néerlandais</option>
                        </Form.Select>
                    </Form.Group>
                </Col>
            </Row>
            <Row className="mb-3">
                <Col>
                    <Form.Group controlId="nom">
                        <Form.Label>Nom entreprise</Form.Label>
                        <Form.Control type="text" placeholder="Nom entreprise" {...register('nom')} />
                    </Form.Group>
                </Col>
            </Row>
            <Row className="mb-3">
                <Col>
                    <Form.Group controlId="code_rue">
                        <Form.Label>Code rue</Form.Label>
                        <Form.Control type="text" placeholder="Code rue" onClick={() => setStreetCodeModal(true)} {...register('code_rue')} />
                    </Form.Group>
                </Col>
                <Col>
                    <Form.Group controlId="rue">
                        <Form.Label>Rue</Form.Label>
                        <Form.Control type="text" placeholder="Rue" {...register('adresse_rue')} />
                    </Form.Group>
                </Col>
                <Col>
                    <Form.Group controlId="numero">
                        <Form.Label>Numéro</Form.Label>
                        <Form.Control type="text" placeholder="Numéro" {...register('adresse_numero')} />
                    </Form.Group>
                </Col>
                <Col>
                    <Form.Group controlId="index">
                        <Form.Label>Index</Form.Label>
                        <Form.Control type="text" placeholder="Index" {...register('adresse_index')} />
                    </Form.Group>
                </Col>
                <Col>
                    <Form.Group controlId="boite">
                        <Form.Label>Boite</Form.Label>
                        <Form.Control type="text" placeholder="Boite" {...register('adresse_boite')} />
                    </Form.Group>
                </Col>
            </Row>
            <Row className="mb-3">
                <Col>
                    <Form.Group controlId="code_postal">
                        <Form.Label>Code postal</Form.Label>
                        <Form.Control type="text" placeholder="Code postal" {...register('code_postal.cp')} />
                    </Form.Group>
                </Col>
                <Col>
                    <Form.Group controlId="localite">
                        <Form.Label>Localité</Form.Label>
                        <Controller
                            control={control}
                            name="code_postal.localite"
                            render={({
                                field: { onChange, onBlur, value, name, ref }
                            }) => (
                                <Typeahead
                                    id="localite"
                                    options={[
                                        "Mouscron",
                                        "Tournai",
                                        "Mons",
                                        "Namur"
                                    ]}
                                    onChange={(value) => onChange(...value)}
                                    emptyLabel='Aucun résultat'
                                    selected={value != undefined ? [value] : []}
                                />
                            )} />
                    </Form.Group>
                </Col>
                <Col>
                    <Form.Group controlId="telephone">
                        <Form.Label>Téléphone</Form.Label>
                        <Form.Control type="text" placeholder="Téléphone" {...register('numero_telephone')} />
                    </Form.Group>
                </Col>
                <Col>
                    <Form.Group controlId="fax">
                        <Form.Label>Fax</Form.Label>
                        <Form.Control type="text" placeholder="Fax" {...register('numero_fax')} />
                    </Form.Group>
                </Col>
            </Row>
            <Row className="mb-3">
                <Col>
                    <Form.Group controlId="personne_contact">
                        <Form.Label>Personne de contact</Form.Label>
                        <Form.Control type="text" placeholder="Personne de contact" {...register('personne_contact')} />
                    </Form.Group>
                </Col>
                <Col>
                    <Form.Group controlId="telephone_contact">
                        <Form.Label>Téléphone</Form.Label>
                        <Form.Control type="text" placeholder="Téléphone" {...register('telephone_contact')} />
                    </Form.Group>
                </Col>
                <Col>
                    <Form.Group controlId="mail_contact">
                        <Form.Label>Adresse e-mail</Form.Label>
                        <Form.Control type="text" placeholder="Adresse e-mail" {...register('mail_contact')} />
                    </Form.Group>
                </Col>
            </Row>
            <Row className="mb-3">
                <Col>
                    <Form.Group controlId="numero_tva">
                        <Form.Label>Numéro de TVA</Form.Label>
                        <Form.Control type="text" placeholder="Numéro de TVA" {...register('numero_tva')} />
                    </Form.Group>
                </Col>
            </Row>
            <Row className="mb-3">
                <Col>
                    <Form.Group controlId="pourcentage_majoration">
                        <Form.Label>% majoration</Form.Label>
                        <Form.Select {...register('pourcentage_majoration')}>
                            <option value="0">Aucune</option>
                            <option value="10">10 %</option>
                            <option value="2">20 %</option>
                            <option value="5">50 %</option>
                        </Form.Select>
                    </Form.Group>
                </Col>
                <Col>
                    <Form.Group controlId="motif_majoration">
                        <Form.Label>Motif de la majoration</Form.Label>
                        {markUpReasons.length > 0 ?
                        <Form.Select {...register('motif_majorationId')}>
                                    <option value=""></option>
                                    {markUpReasons.map((reason: IMotif_majoration, index: number) => {
                                        return <option key={index} value={reason.id_motif}>{reason.libelle}</option>
                                    })}
                        </Form.Select>
                            : <Loader/>}
                    </Form.Group>
                </Col>
            </Row>
            <Row className="mb-3">
                <Col>
                    <Form.Group controlId="code_rue_taxation">
                        <Form.Label>Code rue taxation</Form.Label>
                        <Controller
                            control={control}
                            name="code_rue_taxation"
                            render={({
                                field: { onChange, onBlur, value, name, ref }
                            }) => (
                                <Typeahead
                                    id="code_rue_taxation"
                                    options={[
                                        "Mouscron",
                                        "Tournai",
                                        "Mons",
                                        "Namur"
                                    ]}
                                    emptyLabel='Aucun résultat'
                                />
                            )} />
                    </Form.Group>
                </Col>
                <Col>
                    <Form.Group controlId="adresse_taxation">
                        <Form.Label>Adresse taxation</Form.Label>
                        <Form.Control type="text" placeholder="Adresse taxation" {...register('adresse_taxation')} />
                    </Form.Group>
                </Col>
                <Col>
                    <Form.Group controlId="adresse_numero_taxation">
                        <Form.Label>Numéro</Form.Label>
                        <Form.Control type="text" placeholder="Numéro" {...register('adresse_numero_taxation')} />
                    </Form.Group>
                </Col>
                <Col>
                    <Form.Group controlId="adresse_index_taxation">
                        <Form.Label>Index</Form.Label>
                        <Form.Control type="text" placeholder="Index" {...register('adresse_index_taxation')} />
                    </Form.Group>
                </Col>
                <Col>
                    <Form.Group controlId="adresse_boite_taxation">
                        <Form.Label>Boite</Form.Label>
                        <Form.Control type="text" placeholder="Boite" {...register('adresse_boite_taxation')} />
                    </Form.Group>
                </Col>
            </Row>
            <Row className="mb-3">
                <Col>
                    <Form.Group controlId="adresse_boite_taxation">
                        <Form.Label>Boite</Form.Label>
                        <Form.Control type="text" placeholder="Boite" {...register('adresse_boite_taxation')} />
                    </Form.Group>
                </Col>
            </Row>
            <Row className="mb-3">
                <Col>
                    <Form.Group controlId="adresse_code_postal_taxation">
                        <Form.Label>Code postal</Form.Label>
                        <Form.Control type="text" placeholder="Code postal" {...register('adresse_code_postal_taxation')} />
                    </Form.Group>
                </Col>
                <Col>
                    <Form.Group controlId="adresse_localite_taxation">
                        <Form.Label>Localité</Form.Label>
                        <Form.Control type="text" placeholder="Localité" {...register('adresse_localite_taxation')} />
                    </Form.Group>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Form.Group controlId="commentaire">
                        <Form.Label>Commentaire</Form.Label>
                        <Form.Control as="textarea" placeholder="Commentaire" {...register('commentaire_taxation')} />
                    </Form.Group>
                </Col>
            </Row>
        </Form>
    </>
}