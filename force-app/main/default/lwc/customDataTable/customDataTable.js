// import { LightningElement, wire, track } from 'lwc';
// import getRecords from '@salesforce/apex/getContactRecord.getRecords';  // Apex call to fetch contact data

// export default class CustomDataTable extends LightningElement {
//     @track contacts = [];  // Holds the list of contact records
//     @track error;  // Error object in case of an error while fetching data

//     // Fetch the contact records using the wire service
//     @wire(getRecords)
//     wiredContacts({ error, data }) {
//         if (data) {
//             this.contacts = data;
//             this.error = undefined;
//         } else if (error) {
//             this.error = error;
//             this.contacts = [];
//         }
//     }
// }










import { LightningElement, track, wire } from 'lwc';
// import LightningDatatable from 'lightning/datatable';
import getRecords from '@salesforce/apex/getContactRecord.getRecords'; // Apex call to fetch contacts

import customImage from './customImage.html';

export default class CustomDataTable extends LightningElement {
static customTypes = {
        customImage: {
            template: customImage,
            typeAttributes: ['title']
        }

    }


      @track contacts = [];  // Stores the fetched contacts
        @track error;  // Stores any errors that occur during data fetch
    
        // Fetch the contact records using the wire service
        @wire(getRecords)
        wiredContacts({ error, data }) {
            if (data) {
                this.contacts = data;
                this.error = undefined;
            } else if (error) {
                this.error = error;
                this.contacts = [];
            }
        }
}