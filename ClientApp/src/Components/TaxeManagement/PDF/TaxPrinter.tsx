import { Page, Text, View, Document, StyleSheet, Font } from '@react-pdf/renderer';
import { useEffect } from 'react';
import { Entreprise } from '../../../Types/IEntreprise';

interface ITaxPrinter {
    entreprise: Entreprise
}

export const TaxPrinter = ({entreprise}: ITaxPrinter) => {
    const styles = StyleSheet.create({
        ViewMainTitle: {
            border: '2px solid #000',
            margin: '1mm'
        },
        MainTitle: {
            color: '#000',
            fontSize: '10px',
            textAlign: 'center',
            padding: '1mm'
        }
    });

    return <Document>
        <Page size="A4">
            <View style={styles.ViewMainTitle}>
                <Text style={styles.MainTitle}>Fiche de taxation</Text>
            </View>
        </Page>
    </Document>
}