import {useEffect, useState} from 'react'
import {
    Button,
    Modal,
    Form
} from 'react-bootstrap'
import { PrintTaxButton } from './PDF/PrintTaxButton'

export const IndividualPrint = ({show, handleClose, tax}: any) => {
    const [test, setTest] = useState<boolean>(false)
    useEffect(() => {
        setTimeout(() => setTest(true), 2000)
    }, [])
    return <>
     <Modal show={show} onHide={handleClose} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Impression individuelle</Modal.Title>
        </Modal.Header>
        <Modal.Body>
           {test == true ? <PrintTaxButton entreprise={tax}/> : 'Chargement...'}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Fermer
          </Button>
        </Modal.Footer>
      </Modal>
    </>
}