import { memo, useEffect } from 'react';
import { PDFDownloadLink, PDFViewer, usePDF } from '@react-pdf/renderer';
import { Entreprise } from '../../../Types/IEntreprise';
import { TaxPrinter } from "../PDF/TaxPrinter";
import {
    Button
} from 'react-bootstrap'

export const PrintTaxButton = memo(({ entreprise }: any) => {
    return <>
        <PDFDownloadLink document={<TaxPrinter entreprise={entreprise} />} fileName="taxe.pdf">
            {({ blob, url, loading, error }) =>
               <>
               {loading ? 'Chargement ...' : <Button variant="success">Télécharger</Button>}
               </>
            }
        </PDFDownloadLink>
    </>
})