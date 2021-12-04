import { Entreprise } from "../../../Types/IEntreprise";
import { IPrintData } from "../../../Types/IPrintData";
import { Page, Text, View, Document, StyleSheet, Font, Image } from '@react-pdf/renderer';
import { DeclarationPrinter } from "./DeclarationPrinter";
import { TaxPrinter } from "./TaxPrinter";
import { LetterPrinter } from "./LetterPrinter";

interface IPrinter {
    entreprises: Entreprise[],
    printData: IPrintData,
    tarifs: any
}

export const Printer = ({ entreprises, printData, tarifs }: IPrinter) => {
    return <>
        <Document>
        {entreprises.map((entreprise: Entreprise, index: number) => {
            return <>
            {printData.print_declaration && <DeclarationPrinter entreprise={entreprise} printData={printData} tarifs={tarifs} />}
            {printData.print_form && <TaxPrinter entreprise={entreprise}/>}
            {printData.print_letter && <LetterPrinter entreprise={entreprise} printData={printData} tarifs={tarifs}/>}
            </>
        })}
        </Document>
    </>
}