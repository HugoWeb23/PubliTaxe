import {
    Form,
    Button,
    Row,
    Col,
    Modal,
    Image
} from 'react-bootstrap'
import { IPublicite, IPubliciteImage } from '../../Types/IPublicite';
import settings from '../../settings.json'

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
            <Modal.Title as="h5">Visionner une publicité</Modal.Title>
        </Modal.Header>
        <Modal.Body>
           <Row>
               <Col><div className="fw-bold">Code postal</div><span className="d-block">{data.publicite?.rue?.code_postal?.cp}</span></Col>
               <Col><div className="fw-bold">Code rue</div><span className="d-block">{data.publicite?.rue?.code_rue}</span></Col>
           </Row>
           <Row className="mt-3">
               <Col><div className="fw-bold">Adresse</div><span className="d-block">{data.publicite?.rue?.nom_rue}</span></Col>
               <Col><div className="fw-bold">Numéro</div><span className="d-block">{data.publicite.adresse_numero}</span></Col>
           </Row>
           <Row className="mt-3">
               <Col><div className="fw-bold">Type de panneau</div><span className="d-block">{type_publicite_text}</span></Col>
           </Row>
           <Row className="mt-3">
               <Col><div className="fw-bold">Situation</div>{data.publicite?.situation?.length > 0 ? <span className="d-block">{data.publicite.situation}</span> : <span className="d-block fw-light">(aucune situation)</span>}</Col>
           </Row>
           <Row className="mt-3">
               <Col><div className="fw-bold">Quantité</div><span className="d-block">{data.publicite.quantite}</span></Col>
               <Col><div className="fw-bold">Face</div><span className="d-block">{face_text}</span></Col>
               <Col><div className="fw-bold">Surface unitaire</div><span className="d-block">{data.publicite.surface + " dm²"}</span></Col>
           </Row>
           <Row className="mt-3">
               <Col><div className="fw-bold">Mesure</div><span className="d-block">{data.publicite.mesure}</span></Col>
               <Col><div className="fw-bold">Surface totale</div><span className="d-block">{data.publicite.surface_totale + " dm²"}</span></Col>
               <Col><div className="fw-bold">Exonération</div><span className="d-block">{data.publicite.exoneration ? "Oui" : "Non"}</span></Col>
           </Row>
           <Row className="mt-3">
               <Col><div className="fw-bold">Taxe : </div><span className="d-block">{data.publicite.taxe_totale ? data.publicite.taxe_totale.toFixed(2) : 0.00} €</span></Col>
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
            <Button variant="secondary" size="sm" onClick={handleClose}>
                Fermer
            </Button>
        </Modal.Footer>
    </Modal>
}