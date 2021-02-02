import * as pdfmake from 'pdfmake/build/pdfmake';
import { Document } from '../collections/Document';
import { removelinesBreaks, injectStringsTwo, makeFooter } from './nameSpace'
import { Agreements } from '../collections/File';
import { stringsToInject, replaceableLabels } from './labels';

export const TaC = (text, obj) => {
    let TAC = Document.findOne({ type: 'TAC' })
    if (!TAC) {
        sAlert.error(`Can not find the Terms and Conditions template in the  Database`, { effect: 'slide' })
        throw new Meteor.Error('ERROR', 'misingInformation', `Can not find the Terms and Conditions template in the  Database`)
    }
    let strToInject = stringsToInject(obj._id, obj.language);
    var docDefinition = {
        footer(currentPage, pageCount) {
            return makeFooter(currentPage, pageCount, obj.language)
        },
        content: [
            // {
            //     columns: [
            //         {
            //             width: 80,
            //             table: {
            //                 widths: [80],
            //                 body: [
            //                     [
            //                         {
            //                             image: `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAKEAAABACAYAAABySReRAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA4JpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTM4IDc5LjE1OTgyNCwgMjAxNi8wOS8xNC0wMTowOTowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo2QzJCMjgwRkYwNEExMUU1ODdCOUMwNkY0NkU4M0JCRCIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDo4NTgwMUNGQTlGQ0MxMUU3QUE4MzgzMzI0MjZGODlCMSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo4NTgwMUNGOTlGQ0MxMUU3QUE4MzgzMzI0MjZGODlCMSIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxNSAoTWFjaW50b3NoKSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjFhYjhhMGU3LTJmY2YtNDg1Yy1hMTllLTRmZjNkYjM5OTgxNyIgc3RSZWY6ZG9jdW1lbnRJRD0iYWRvYmU6ZG9jaWQ6cGhvdG9zaG9wOmI1YzE3NDU3LTY4MjctMTE3OS1iNmJkLWIy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`,
            //                             fit: [80, 100],
            //                             fillColor: '#808080', border: 0
            //                         }
            //                     ]
            //                 ]
            //             }
            //         },
            //     ]
            // },
            { text: injectStringsTwo(TAC.title[obj.language], replaceableLabels, strToInject), style: 'title', bold: true, alignment: 'center' },
            { text: ' ' },
            genParagraph(TAC.paragraph, obj.language, strToInject),
            { text: ' ' },
            { text: injectStringsTwo(TAC.footer[obj.language], replaceableLabels, strToInject), style: 'labelText', alignment: 'center' },
            { text: ' ' },
            // {
            //     columns: [
            //         { text: text.PROMISE_TO_PAY.signature1, style: 'label', decoration: 'overline', alignment: 'center' },
            //         { text: text.PROMISE_TO_PAY.signature2, style: 'label', decoration: 'overline', alignment: 'center' },
            //     ]
            // },
            // {
            //     columns: [
            //         { text: text.PROMISE_TO_PAY.address, style: 'label', alignment: 'center' },
            //         { text: text.PROMISE_TO_PAY.address, style: 'label', alignment: 'center' },
            //     ]
            // },
            // {
            //     columns: [
            //         { text: `${obj.address}, ${obj.zip}, ${obj.city}, ${obj.state ? obj.state + ',' : ''} ${getCountryByCode(obj.country)}`, style: 'labelText', alignment: 'center' },
            //         { text: `${obj.address}, ${obj.zip}, ${obj.city}, ${obj.state ? obj.state + ',' : ''} ${getCountryByCode(obj.country)}`, style: 'labelText', alignment: 'center' },
            //     ]
            // }
        ],
        styles: {
            reg: {
                bold: true,
                fontSize: 10.5,
                alignment: 'center'
            },
            header: {
                bold: true,
                fontSize: 10.5,
                alignment: 'center',
                color: '#ffffff',
                background: '#000000'
            },
            title: {
                fontSize: 11.5,
                alignment: 'left'
            },
            label: {
                bold: true,
                fontSize: 9.5,
                alignment: 'left'
            },
            labelText: {
                fontSize: 9.5,
                alignment: 'justify'
            },
            text: {
                fontSize: 8,
                alignment: 'justify',
            },
            boldText: {
                fontSize: 8,
                alignment: 'justify',
                bold: true,
            },
            greyBand: {
                fontSize: 11.5,
                color: 'grey',
            },
            foot: {
                fillColor: '#3A3A3C',
                color: '#ffffff',
                fontSize: 13,
                alignment: 'center'
            },
            foot2: {
                fillColor: '#3A3A3C',
                color: '#A0A0A0',
                fontSize: 9.5,
                alignment: 'center'
            },

            tableTitles: {
                fillColor: '#F4F4F4',
                color: 'black',
                fontSize: 9.5,
                alignment: 'center'
            }
        },
        pageSize: { width: 612, height: 791 },
        pageOrientation: 'portrait'
    };
    let pdf = pdfmake.createPdf(docDefinition);
    pdf.download(`${TAC.name}_${obj.contract.fol}.pdf`);
    let fileObj = Agreements.findOne({ 'meta.memberId': obj._id, 'meta.type': 'TAC' });
    if (fileObj && fileObj.get('_id')) {
        Agreements.collection.remove({ _id: fileObj.get('_id') });
    }
    pdf.getBase64((data) => {
        Agreements.insert({
            file: data,
            isBase64: true,
            fileName: `${TAC.name}_${obj.contract.fol}.pdf`,
            type: 'document/pdf',
            meta: {
                type: 'TAC',
                memberId: obj._id,
                contractNo: obj.reg,
                contractFol: obj.fol,
                createdAt: moment().format("YYYY-MM-DD HH:mm:SS") //fixDateTimezone(new Date())
            }
        });

        Session.set('TBtn', false)
    });
}

const genParagraph = (paragraph, language, strToInject) => {
    let text = [];
    if (paragraph && paragraph.length) {
        paragraph.forEach(p => {
            let style = p.enphasize ? 'boldText' : 'text';
            text.push({
                text: injectStringsTwo(removelinesBreaks(p[language]), replaceableLabels, strToInject),
                style: style,
                alignment: 'justify'
            });
            text.push({ text: ' ' });
        });
        return text;
    }
}