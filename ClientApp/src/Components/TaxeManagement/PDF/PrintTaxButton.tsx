import { memo } from 'react';
import { PDFDownloadLink, PDFViewer, usePDF } from '@react-pdf/renderer';
import { Entreprise } from '../../../Types/IEntreprise';
import { TaxPrinter } from "../PDF/TaxPrinter";
import {
    Button
} from 'react-bootstrap'
import { Printer } from '../../UI/Printer';

export const PrintTaxButton = memo(({ entreprise }: any) => {
    return <>
        <PDFDownloadLink document={<TaxPrinter entreprise={entreprise} />} fileName="taxe.pdf">
            {({ blob, url, loading, error }) =>
            <>
                <Button variant="outline-success" className="me-4" size="sm">Imprimer</Button>
                </>
            }
        </PDFDownloadLink>
    </>
})