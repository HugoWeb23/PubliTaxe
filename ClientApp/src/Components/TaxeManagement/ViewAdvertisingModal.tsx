import {
    Form,
    Button,
    Row,
    Col,
    Card,
    Container,
    Table,
    Modal,
    Alert,
    Image
} from 'react-bootstrap'
import { IPublicite, IPubliciteImage } from '../../Types/IPublicite';
import settings from '../../../settings.json'

interface IViewAdvertisingModal {
    data: { show: boolean, publicite: IPublicite },
    handleClose: () => void
}

export const ViewAdvertisingModal = ({ data, handleClose }: IViewAdvertisingModal) => {

    let face_text = "";
    let type_publicite_text = "";

    switch(data.publicite.type_publicite) {
        case 1:
            type_publicite_text = "Enseigne non lumineuse"
            break;
        case 2:
            type_publicite_text = "Enseigne lumineuse"
            break;
        case 3:
            type_publicite_text = "Enseigne clignotante"
            break;
        case 4:
            type_publicite_text = "Panneau non lumineux"
            break;
        case 5:
            type_publicite_text = "Panneau lumineux"
            break;
        case 6:
            type_publicite_text = "Panneau à défilement"
            break;
        default:
            type_publicite_text = ""
            break;
    }

    switch(data.publicite.face) {
        case 1:
            face_text = "Simple"
            break;
        case 2:
            face_text = "Double"
            break;
        case 3:
            face_text = "Triple"
            break;
        default:
            face_text = ""
            break;
    }
    return <Modal show={data.show} onHide={handleClose} size="xl" animation={false}>
        <Modal.Header closeButton>
            <Modal.Title>Visionner une publicité</Modal.Title>
        </Modal.Header>
        <Modal.Body>
           <Row>
               <Col>Code postal : <span className="fw-bold">{data.publicite?.rue?.code_postal?.cp}</span></Col>
               <Col>Code rue : <span className="fw-bold">{data.publicite?.rue?.code_rue}</span></Col>
           </Row>
           <Row className="mt-3">
               <Col>Adresse : <span className="fw-bold">{data.publicite?.rue?.nom_rue}</span></Col>
               <Col>Numéro : <span className="fw-bold">{data.publicite.adresse_numero}</span></Col>
           </Row>
           <Row className="mt-3">
               <Col>Type de panneau : <span className="fw-bold">{type_publicite_text}</span></Col>
           </Row>
           <Row className="mt-3">
               <Col>Situation : <span className="fw-bold">{data.publicite.situation}</span></Col>
           </Row>
           <Row className="mt-3">
               <Col>Quantité : <span className="fw-bold">{data.publicite.quantite}</span></Col>
               <Col>Face : <span className="fw-bold">{face_text}</span></Col>
               <Col>Surface unitaire : <span className="fw-bold">{data.publicite.surface + "dm²"}</span></Col>
           </Row>
           <Row className="mt-3">
               <Col>Mesure : <span className="fw-bold">{data.publicite.mesure}</span></Col>
               <Col>Surface totale : <span className="fw-bold">{data.publicite.surface_totale}</span></Col>
               <Col>Exonération : <span className="fw-bold">{data.publicite.exoneration ? "Oui" : "Non"}</span></Col>
           </Row>
           <Row className="mt-3">
               <Col>Taxe : <span className="fw-bold">{data.publicite.taxe_totale} €</span></Col>
           </Row>
           <div className="d-flex justify-content-start mt-3">
                    {data.publicite.photos && data.publicite.photos.map((image: IPubliciteImage, index: number) => {
                        return <>
                            <div style={{ position: 'relative' }} className="me-4" key={index}>
                                <a href={`${process.env.NODE_ENV === 'development' ? settings.Development_url : settings.Production_url}/api/images/` + image.photo} target="_blank"><Image src={`${process.env.NODE_ENV === 'development' ? settings.Development_url : settings.Production_url}/api/images/` + image.photo} style={{ height: "100px", width: "100px" }} rounded /></a>
                            </div>
                        </>
                    })}
                </div>
                {data.publicite.photos && data.publicite.photos.length > 0 &&
                    <Form.Text className="text-muted">
                        Cliquez sur une photo pour la voir dans sa taille réelle.
                    </Form.Text>
                }
        </Modal.Body>
        <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
                Fermer
            </Button>
        </Modal.Footer>
    </Modal>
}