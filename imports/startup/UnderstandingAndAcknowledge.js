import * as pdfmake from 'pdfmake/build/pdfmake'
import * as vsf_fonts from 'pdfmake/build/vfs_fonts.js'
import { Service } from '../collections/Service'
import { Document } from '../collections/Document';
import { AnnualFee } from '../collections/AnnualFee';
import { injectStrings, removelinesBreaks, injectStringsTwo, makeFooter } from './nameSpace';
import { Agreements } from '../collections/File';
import { replaceableLabels, stringsToInject } from './labels';
import { base64Logo } from './base64Logos';

export const Understanding = (text, obj) => {
    const line = { type: 'line', x1: 0, y1: 10, x2: 520, y2: 10, lineWidth: 1, lineColor: 'Grey' };
    let annualFee = AnnualFee.find({}).fetch()[0]
    let ACKNOWLEDGMENT = Document.find({ type: 'UA' }).fetch()[0]
    if (!ACKNOWLEDGMENT) {
        sAlert.error(`Can't fetch ACKNOWLEDGMENT information from Database`, { effect: 'slide' })
        throw new Meteor.Error('ERROR', 'misingInformation', `Can't fetch ACKNOWLEDGMENT information from Database`)
    }
    const termsCount = ACKNOWLEDGMENT.terms.length
    //console.log('/////////////////////////', termsCount)
    const termsCountTag = ['#T-COUNT']
    let serviceTags = ['#SERVICE-QTY']
    let strToInject = stringsToInject(obj.id, obj.language);
    var docDefinition = {
        footer(currentPage, pageCount) {
            return makeFooter(currentPage, pageCount, obj.language)
        },
        content: [{
            table: {
                widths: [380, 120],
                body: [
                    [{
                        rowSpan: 2,
                        image: base64Logo.greyLogo,
                        fit: [100, 120],
                        alignment: 'left',
                    },
                    {
                        text: [

                            { text: text.UNDERSTANDING.contract, style: 'title', bold: true, alignment: 'left' },
                            { text: obj.fol, style: 'title', alignment: 'left' },

                        ],
                        lineHeight: 1.5

                    }
                    ],
                    [
                        '',
                        {
                            text: [

                                { text: text.UNDERSTANDING.date, style: 'title', bold: true, alignment: 'left' },
                                { text: obj.date, style: 'title', alignment: 'left' },

                            ],
                            lineHeight: 1.5
                        }
                    ],
                ]
            },
            layout: 'noBorders',
        },
        { text: ' ' },
        {
            width: 520,
            table: {
                widths: [520],
                body: [
                    [
                        { text: '   ' + ACKNOWLEDGMENT.title[obj.language] + '   ', style: 'header', border: [false, true, false, true], alignment: 'center' },

                    ]
                ],
                alignment: 'right',
            },
            layout: {
                hLineColor: 'grey',
                vLineColor: 'grey',
                hLineWidth: function () {
                    return 0.1;
                },
            }
        },
        { text: ' ' },

        { text: ' ' },
        { text: ' ' },
        ////////////Generating Services Terms///////////////
        // genServicesTermCols(obj.services, obj.language, strToInject),

        ////////////Generating VR Membership terms///////////////////////////////////////
        genTermsCols(ACKNOWLEDGMENT.terms || undefined, obj.language, strToInject, termsCountTag, termsCount),
        // genTermCols(text.EULA.UNDERSTANDING, text.EULA.AGREEMENT.initials, data),
        // { text: infEULA.contactMessage[obj.language], style: 'text', bold: true, alignment: 'center' },
        // { text: ' ' },
        { text: ' ' },
        {
            table: {
                widths: [260, 260],
                body: [
                    [{ text: '_____________________________________', alignment: 'center' },
                    { text: '_____________________________________', alignment: 'center' },
                    ],
                    ////second row/////////////////
                    [{ text: text.UNDERSTANDING.signature1, style: 'signature', alignment: 'center' },
                    { text: text.UNDERSTANDING.signature2, style: 'signature', alignment: 'center' },
                    ],
                ]
            },
            layout: 'noBorders',
            // pageBreak: 'after',
        },
        ],
        styles: {
            reg: {
                bold: true,
                fontSize: 10.5,
                alignment: 'center'
            },
            header: {
                bold: true,
                fontSize: 12,
                alignment: 'center',
                color: 'black',
            },
            title: {
                fontSize: 9,
                alignment: 'left'
            },
            signature: {
                fontSize: 11,
                alignment: 'left'
            },
            label: {
                bold: true,
                fontSize: 9,
                alignment: 'left'
            },
            labelText: {
                fontSize: 9,
                alignment: 'justify'
            },
            text: {
                fontSize: 10,
                alignment: 'justify'
            },
            greyBand: {
                fontSize: 9,
                color: 'grey',
            },
            foot: {
                color: 'black',
                fontSize: 13,
                alignment: 'center'
            },
            foot2: {
                fillColor: '#3A3A3C',
                color: '#A0A0A0',
                fontSize: 9.5,
                alignment: 'center'
            },
            contactInfo: {
                fillColor: '#3A3A3C',
                color: 'white',
                fontSize: 16,
                alignment: 'center'
            },
            tableTitles: {
                color: 'black',
                bold: true,
                fontSize: 9,
                alignment: 'center'
            }
        },
        defaultStyle: {
            fontSize: 6,
        },
        pageSize: { width: 612, height: 791 },
        pageOrientation: 'portrait'
    };
    let pdf = pdfmake.createPdf(docDefinition);
    pdf.download(`${ACKNOWLEDGMENT.name}_${obj.fol}.pdf`)
    Agreements.remove({ 'meta.memberId': obj.id, 'meta.type': 'UA' })
    pdf.getBase64((data) => {
        Agreements.insert({
            file: data,
            isBase64: true,
            fileName: `${ACKNOWLEDGMENT.name}_${obj.fol}.pdf`,
            type: 'document/pdf',
            meta: {
                type: 'UA',
                memberId: obj.id,
                registerNo: obj.reg,
                folio: obj.fol,
                createdAt: moment().format("YYYY-MM-DD HH:mm:SS") //fixDateTimezone(new Date())
            }
        });
        Session.set('ABtn', false)
    });
}

genServicesTermCols = (services, language, strToInject) => {
    let cols = [];
    services = services || [];
    services = services.sort((a, b) => a.order - b.order);
    services.forEach(service => {
        cols.push({
            columns: [
                { width: 40, text: '________', style: 'text' },
                { text: injectStringsTwo(removelinesBreaks(service.terms[language]), replaceableLabels, strToInject), style: 'text' }
            ],
            alignment: 'justify',
        });
        cols.push({ text: ' ' });
    })
    return cols;
}

const genTermsCols = (terms, language, strToInject, termsCountTag, termsCount) => {
    let cols = [];
    if (terms && terms.length) {
        terms.forEach(term => {
            cols.push({
                columns: [
                    { width: 40, text: '________', style: 'text' },
                    { text: injectStrings(injectStringsTwo(removelinesBreaks(term[language]), replaceableLabels, strToInject), termsCountTag, [termsCount]), style: 'text' }
                ],
                alignment: 'justify',
            });
            cols.push({ text: ' ' });
        });
    }
    return cols;
}