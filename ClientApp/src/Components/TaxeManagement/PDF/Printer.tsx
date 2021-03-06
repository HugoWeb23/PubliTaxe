import { memo } from 'react'
import { Entreprise } from "../../../Types/IEntreprise";
import { IPrintData } from "../../../Types/IPrintData";
import { Page, Text, View, Document, StyleSheet, Font, Image } from '@react-pdf/renderer';
import { DeclarationPrinter } from "./DeclarationPrinter";
import { TaxPrinter } from "./TaxPrinter";
import { LetterPrinter } from "./LetterPrinter";
import { IExercice } from '../../../Types/IExercice';
import { IPrice } from '../../../Types/IPrice';
import { MinutesPrinter } from './MinutesPrinter';
import { IMotif_majoration } from '../../../Types/IMotif_majoration';
import { RegisteredLetter } from './RegisteredLetter';

interface IPrinter {
    entreprises: Entreprise[],
    printData: IPrintData,
    tarifs: IPrice[],
    currentFiscalYear: IExercice,
    motifsMajoration?: IMotif_majoration[]
}

export const Printer = memo(({ entreprises, printData, tarifs, currentFiscalYear, motifsMajoration }: IPrinter) => {
    return <>
        <Document>
            {entreprises.map((entreprise: Entreprise, index: number) => {
                return <>
                    {printData.options.print_declaration && <DeclarationPrinter entreprise={entreprise} printData={printData} tarifs={tarifs} currentFiscalYear={currentFiscalYear} />}
                    {printData.options.print_form && <TaxPrinter entreprise={entreprise} />}
                    {printData.options.print_letter && <LetterPrinter entreprise={entreprise} printData={printData} tarifs={tarifs} currentFiscalYear={currentFiscalYear} />}
                    {printData.options.print_minutes && <MinutesPrinter entreprise={entreprise} printData={printData} motifsMajoration={motifsMajoration}/>}
                    {printData.options.print_minutes && <RegisteredLetter entreprise={entreprise} printData={printData} currentFiscalYear={currentFiscalYear} motifsMajoration={motifsMajoration}/>}
                </>
            })}
        </Document>
    </>
})