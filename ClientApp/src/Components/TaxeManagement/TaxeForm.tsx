import { useState } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form"
import {
    FormControl,
    Form,
    Button,
    Row,
    Col,
    FloatingLabel
} from 'react-bootstrap'
import { Typeahead } from 'react-bootstrap-typeahead'
import {Entreprise} from '../../Types/IEntreprise'

interface TaxeForm {
    data: any
}

export const TaxeForm = ({data}: TaxeForm) => {
    const { register, control, handleSubmit, watch, getValues, setValue, setError, clearErrors, formState: { errors, isSubmitting } } = useForm({defaultValues: data});
    return <>
        <Row className="mb-3">
            <Col>
                <Form.Group controlId="matricule_ciger">
                    <Form.Label>Matricule Ciger</Form.Label>
                    <Form.Control type="text" placeholder="Matricule Ciger" {...register('matricule_ciger')} />
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
                <Controller
                control={control}
                name="code_rue"
                render={({
                    field: { onChange, onBlur, value, name, ref }
                }) => (
                <Typeahead
                    id="code_rue"
                    placeholder="Code rue"
                    options={[
                        "Mouscron",
                        "Tournai",
                        "Mons",
                        "Namur"
                    ]}
                    emptyLabel='Aucun résultat'
                />
                )}/>
                </Form.Group>
            </Col>
            <Col>
                <Form.Group controlId="adresse">
                    <Form.Label>Adresse</Form.Label>
                    <Form.Control type="text" placeholder="adresse" {...register('adresse_rue')} />
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
                    <Form.Control type="text" placeholder="Code postal" {...register('adresse_code_postal')} />
                </Form.Group>
            </Col>
            <Col>
                <Form.Group controlId="localite">
                    <Form.Label>Localité</Form.Label>
                    <Controller
                control={control}
                name="localite"
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
                        emptyLabel='Aucun résultat'
                    />
                )}/>
                </Form.Group>
            </Col>
            <Col>
                <Form.Group controlId="telephone">
                    <Form.Label>Téléphone</Form.Label>
                    <Form.Control type="text" placeholder="Téléphone" {...register('telephone')} />
                </Form.Group>
            </Col>
            <Col>
                <Form.Group controlId="fax">
                    <Form.Label>Fax</Form.Label>
                    <Form.Control type="text" placeholder="Fax" {...register('fax')} />
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
                    <Form.Select {...register('motif_majoration')}>
                        <option value="0">Blabla 1</option>
                        <option value="1">sdsdsdsdds</option>
                        <option value="2">!!!dssd!</option>
                        <option value="5">565s656ds65</option>
                    </Form.Select>
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
                )}/>
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
    </>
}