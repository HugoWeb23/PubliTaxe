import { useMemo } from 'react'
import { Page, Text, View, Document, StyleSheet, Font, Image } from '@react-pdf/renderer';
import { Entreprise } from '../../../Types/IEntreprise';
import { IPrintData } from '../../../Types/IPrintData';
import mouscron from '../../../Images/mouscron.jpg'
import wapi from '../../../Images/wapi.jpg'
import transversal from '../../../Images/transversal.jpg'
import blancke_signature from '../../../Images/blancke_signature.jpg'
import aubert_signature from '../../../Images/aubert_signature.jpg'
import cachet_ville from '../../../Images/cachet_ville.jpg'
import { GetPricesByYear } from '../../../Services/SumTax';
import { IExercice } from '../../../Types/IExercice';
import { IPrice } from '../../../Types/IPrice';

interface ILetterPrinter {
    entreprise: Entreprise,
    printData: IPrintData,
    tarifs: IPrice[],
    currentFiscalYear: IExercice
}

export const LetterPrinter = ({ entreprise, printData, tarifs, currentFiscalYear }: ILetterPrinter) => {
    const prices = useMemo(() => GetPricesByYear(tarifs, currentFiscalYear.id), [])
    Font.register({
        family: 'Arial', fonts: [
            {
                src: '/Fonts/Arial.ttf'
            },
            {
                src: '/Fonts/ArialBold.ttf',
                fontWeight: 'bold'
            }
        ]
    });

    Font.register({
        family: 'Tahoma', fonts: [
            {
                src: '/Fonts/Tahoma.ttf'
            },
            {
                src: '/Fonts/TahomaBold.ttf',
                fontWeight: 'bold'
            }
        ]
    });

    const styles = StyleSheet.create({
        Page: {
            padding: '8mm'
        },
        Header: {
            justifyContent: 'space-between',
            alignItems: 'center',
            flexDirection: 'row'
        },
        MouscronImage: {
            width: '140px',
            height: '90px'
        },
        WapiImage: {
            width: '90px',
            height: '90px'
        },
        HeaderText: {
            fontFamily: 'Arial',
            fontWeight: 'bold',
            fontSize: '14px',
        },
        HeaderSubText: {
            fontSize: '13px'
        },
        SubHeader: {
            justifyContent: 'space-between',
            alignItems: 'center',
            flexDirection: 'row',
            marginTop: '3mm'
        },
        NormalText: {
            fontSize: '10px',
            fontFamily: 'Arial'
        },
        BoldText: {
            fontFamily: 'Arial',
            fontWeight: 'bold'
        },
        CityName: {
            marginTop: '3mm',
            flexDirection: 'row',
            justifyContent: 'flex-start'
        },
        EntrepriseInfo: {
            marginLeft: '45mm'
        },
        TransversalLogo: {
            marginTop: '3mm',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'flex-end'
        },
        TransversalLogoImg: {
            height: '130px',
            width: '70px'
        },
        SignatureSection: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginTop: '15mm',
            paddingRight: '25mm',
            paddingLeft: '25mm'

        },
        BlanckeSignature: {
            width: '120px',
            height: '70px'
        },
        AubertSignature: {
            width: '120px',
            height: '70px'
        },
        CachetVille: {
            width: '90px',
            height: '90px'
        },
        RegulationNormalText: {
            fontFamily: 'Tahoma',
            fontSize: '10px'
        },
        RegulationBoldText: {
            fontFamily: 'Tahoma',
            fontWeight: 'bold',
            fontSize: '10px'
        },
        TaxPricesContainer: {
            flexDirection: 'row',
            alignItems: 'flex-start',
            maxWidth: '100%'
        },
        TaxPrice: {
            justifyContent: 'flex-start',
            alignItems: 'flex-start',
            flexDirection: 'row'
        }
    })
    return <Page style={styles.Page}>
        <View style={styles.Header}>
            <View><Image src={mouscron} style={styles.MouscronImage} /></View>
            <View>
                <Text style={[styles.HeaderText, { textDecoration: 'underline' }]}>Administration communale de Mouscron</Text>
            </View>
            <View><Image src={wapi} style={styles.WapiImage} /></View>
        </View>
        <View style={styles.CityName}>
            <View>
                <Text style={[styles.BoldText, { fontSize: '11px', marginBottom: '1mm' }]}>Administration Communale</Text>
                <Text style={styles.NormalText}>Service de la Recette</Text>
                <Text style={styles.NormalText}>Rue de Courtrai, 63</Text>
                <Text style={styles.NormalText}>B-7700 Mouscron</Text>
                <Text style={styles.NormalText}>Tel.: +32(0)56/ 860.280</Text>
            </View>
            <View style={styles.EntrepriseInfo}>
                <Text style={styles.NormalText}>Matricule : {entreprise.matricule_ciger}</Text>
                <Text style={styles.NormalText}>{entreprise.nom}</Text>
                <Text style={styles.NormalText}>{entreprise.adresse_rue}, {entreprise.adresse_numero}</Text>
                <Text style={styles.NormalText}>{entreprise.code_postal.cp} {entreprise.code_postal.localite}</Text>
            </View>
        </View>
        <View style={styles.TransversalLogo}>
            <View>
                <Image src={transversal} style={styles.TransversalLogoImg} />
            </View>
            <View style={{ marginRight: '40mm' }}>
                <Text style={styles.NormalText}>Mouscron, le {printData.date_impression}</Text>
            </View>
        </View>
        <View style={{ marginTop: '10mm' }}>
            <Text style={styles.NormalText}>Madame, Monsieur,</Text>
        </View>
        <View style={{ marginTop: '10mm' }}>
            <Text style={[styles.NormalText, styles.BoldText, { textDecoration: 'underline' }]}>Concerne : Taxe communale sur les panneaux publicitaires et les enseignes</Text>
        </View>
        <View style={{ marginTop: '5mm' }}>
            <Text style={styles.NormalText}>Vous trouverez en annexe le formulaire de d??claration relatif aux panneaux et/ou enseignes publicitaires pour l'exercice {currentFiscalYear.annee_exercice}, <Text style={[styles.BoldText, { textDecoration: 'underline' }]}>avec situation au 1er janvier de l'ann??e</Text>.</Text>
            <Text style={[styles.NormalText, { marginTop: '5mm' }]}>Voudriez-vous v??rifier si ces donn??es sont exactes et, ??ventuellement, les compl??ter en cas d'oubli ?</Text>
            <Text style={[styles.NormalText, { marginTop: '5mm' }]}>Nous vous prions de bien vouloir nous retourner cette d??claration sign??e de pr??f??rence par mail ?? {printData.mail_contact} ou au Service des Taxes de la ville de Mouscron, rue de Courtrai, 63 ?? 7700 Mouscron pour le <Text style={[styles.BoldText, { textDecoration: 'underline' }]}>{printData.date_echeance}</Text> au plus tard et ce, m??me s'il n'y a aucun changement ?? la situation.</Text>
            <Text style={[styles.NormalText, { marginTop: '5mm' }]}>Pour tout renseignement compl??mentaire, veuillez contacter</Text>
            <View style={{ marginLeft: '50mm', marginTop: '5mm' }}>
                <Text style={styles.NormalText}>{printData.personne_contact} au {printData.telephone_contact}</Text>
                <Text style={[styles.NormalText, { marginLeft: '20mm', marginTop: '3mm' }]}>(du lundi au jeudi)</Text>
            </View>
            <Text style={[styles.NormalText, { marginLeft: '15mm', marginTop: '5mm' }]}>Nous vous prions d'agr??er, Madame, Monsieur, l'expression de nos sentiments distingu??s.</Text>
            <View style={styles.SignatureSection}>
                <View>
                    <Text style={styles.NormalText}>La Directrice G??n??rale</Text>
                    <Text style={[styles.NormalText, { marginTop: '5mm' }]}>{printData.direction_generale}</Text>
                    <Image src={blancke_signature} style={[styles.BlanckeSignature, { marginTop: '5mm' }]} />
                </View>
                <View>
                    <Image src={cachet_ville} style={[styles.CachetVille]} />
                </View>
                <View>
                    <Text style={styles.NormalText}>La Bourgmestre</Text>
                    <Text style={[styles.NormalText, { marginTop: '5mm' }]}>{printData.bourgmestre}</Text>
                    <Image src={aubert_signature} style={[styles.AubertSignature, { marginTop: '5mm' }]} />
                </View>
            </View>
        </View>
        {/* R??glement */}
        <View style={styles.RegulationNormalText} break>
            <Text style={[styles.RegulationBoldText, { textDecoration: 'underline' }]}>TAXE COMMUNALE SUR LES ENSEIGNES LES PANNEAUX PUBLICITAIRES ET PUBLICITES ASSIMILEES</Text>
            <Text style={{ marginTop: '5mm' }}>Il est ??tabli une taxe communale sur les enseignes, les panneaux publicitaires et publicit??s assimil??es directement ou indirectement lumineuses ou non lumineuses de quelque nature qu'elles soient.</Text>
            <Text style={{ marginTop: '5mm' }}>
                Sont vis??es toutes enseignes existantes au 1er janvier de l'exercice d'imposition sur lesquelles figurent des indications visibles
                de la voie publique et qui ont pour but de faire conna??tre la d??nomination du commerce ou de l'industrie ou du service, les
                produits ou services offerts ou susceptible de l'??tre et l'activit?? ou la profession exerc??e, ainsi que les supports visibles d'une
                voie de communication ou d'un endroit fr??quent?? en permanence ou occasionnellement par le public et destin??s ?? l'apposition
                d'affiches ?? caract??re publicitaire.
                Sont ??galement vis??es les affiches publicitaires en m??tal l??ger ou en PVC ne n??cessitant aucun support.
            </Text>
            <Text style={{ marginTop: '5mm' }}>
                Une publicit?? est assimil??e ?? une enseigne lorsque, plac??e ?? proximit?? imm??diate d'un ??tablissement, elle promeut cet
                ??tablissement ou les activit??s qui s'y d??roulent et les produits et services qui y sont fournis.
            </Text>
            <Text style={{ marginTop: '5mm' }}>
                L'imp??t est d?? solidairement par toute personne physique ou morale qui exploite un ??tablissement comprenant des enseignes et/ou qui b??n??ficie directement ou indirectement de l'enseigne et par le propri??taire de l'immeuble auquel est attach??e
                l'enseigne au 1er janvier de l'exercice d'imposition.
            </Text>
            <Text style={{ marginTop: '5mm' }}>
                Sont exon??r??s : l'enseigne la plus ch??re indiquant la raison sociale ou la d??nomination de l'??tablissement et ?? raison d'une
                seule enseigne par ??tablissement - les autocollants de moins d'un m??tre carr?? - les enseignes l'ann??e qui suit leur installation/
                mise en conformit?? apr??s introduction d'un dossier au service de l'Urbanisme.
            </Text>
            <View style={[styles.TaxPricesContainer, { marginTop: '5mm' }]}>
                <View style={{ flex: 0.2 }}>
                    <Text>L'imp??t est fix?? ?? :</Text>
                </View>
                <View style={{ flex: 1 }}>
                    <View style={styles.TaxPrice}>
                        <Text style={{ flex: 0.120 }}>{prices[1].toFixed(2)} EUR.</Text>
                        <Text style={{ flex: 1 }}>par d??cim??tre carr?? pour les enseignes non lumineuses.</Text>
                    </View>
                    <View style={styles.TaxPrice}>
                        <Text style={{ flex: 0.120 }}>{prices[2].toFixed(2)} EUR.</Text>
                        <Text style={{ flex: 1 }}>par d??cim??tre carr?? pour les enseignes lumineuses ou ??clair??es.</Text>
                    </View>
                    <View style={styles.TaxPrice}>
                        <Text style={{ flex: 0.120 }}>{prices[3].toFixed(2)} EUR.</Text>
                        <Text style={{ flex: 1 }}>par d??cim??tre carr?? pour les enseignes clignotantes.</Text>
                    </View>
                    <View style={styles.TaxPrice}>
                        <Text style={{ flex: 0.120 }}>{prices[4].toFixed(2)} EUR.</Text>
                        <Text style={{ flex: 1 }}>par d??cim??tre carr?? de surface du panneau publicitaire.</Text>
                    </View>
                    <View style={styles.TaxPrice}>
                        <Text style={{ flex: 0.120 }}>{prices[5].toFixed(2)} EUR.</Text>
                        <Text style={{ flex: 1 }}>lorsque le panneau est ??quip?? d'un syst??me de d??filement ??lectronique ou m??canique ou lorsque le panneau est lumineux ou ??clair??.</Text>
                    </View>
                </View>
            </View>
            <Text style={{ marginTop: '5mm' }}>La superficie retenue est celle du support sur lequel se trouve l'enseigne ou le panneau et ce quelle que soit la surface par l'information qui y est diffus??e.</Text>
            <Text style={{ marginTop: '5mm' }}>L'administration communale adresse au contribuable une formule de d??claration que celui-ci est tenu de renvoyer, d??ment remplie et sign??e, avant l'??ch??ance mentionn??e sur la dite formule. Le contribuable qui n'a pas re??u de formule de d??claration est tenu de d??clarer ?? l'administration communale, au plus tard le 31 juillet de l'exercice d'imposition, les ??l??ments n??cessaires ?? l'imposition.</Text>
            <Text style={{ marginTop: '5mm' }}>En cas d'enr??lement d'office, la majoration sera la suivante :</Text>
            <View style={{marginLeft: '15mm'}}>
                <Text style={{ marginTop: '3mm' }}>Montant de la taxe + 10% pour ce qui concerne la premi??re infraction,</Text>
                <Text>Montant de la taxe + 50% pour ce qui concerne la seconde infraction,</Text>
                <Text>Montant de la taxe + 100% pour ce qui concerne la troisi??me infraction,</Text>
                <Text>Montant de la taxe + 200% pour ce qui concerne la quatri??me infraction et les suivantes.</Text>
            </View>
            <Text style={{ marginTop: '5mm' }}>Il y a 2??me violation ou violation subs??quente si, au moment o?? une nouvelle violation est commise, le contribuable s'est vu pr??c??demment adress?? une ou plusieurs notification(s) de taxation d'office en application de l'article L3321-6 alin??a 2 du code de la D??mocratie Locale et de la D??centralisation.</Text>
            <Text style={{ marginTop: '5mm' }}>Pour la d??termination du pourcentage d'accroissement ?? appliquer, les violations ant??rieures ne sont pas prises en
                consid??ration si aucune violation n'est constat??e pour les 4 derniers exercices d'imposition qui pr??c??dent celui pour lequel la
                nouvelle violation est constat??e.</Text>
        </View>
    </Page>
}