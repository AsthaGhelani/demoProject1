// import { LightningElement, wire, track, api } from 'lwc';
// import { NavigationMixin } from 'lightning/navigation';
// import getContactDetails from '@salesforce/apex/ContactController.getContactDetails';

// export default class ContactCard extends NavigationMixin(LightningElement) {
//     @track contactData; // To store contact data
//     @track contactPhotoUrl; // To store contact photo URL
//     @track contactName; // To store full contact name
//     @track contactDescription; // To store contact description
//     @track placeholderImageUrl = 'https://example.com/path-to-placeholder.jpg'; // Placeholder image URL
//     @api recordId; // Record ID for the Contact being passed

//     @wire(getContactDetails, { recordId: '$recordId' })
//     wiredContact({ error, data }) {
//         if (data) {
//             this.contactData = data; // Store the full contact data
//             this.contactPhotoUrl = data.PhotoUrl || ''; // Get the photo URL (empty string if none)
//             this.contactName = `${data.FirstName} ${data.LastName}`; // Full name
//             this.contactDescription = data.Description || 'No description available'; // Description
//         } else if (error) {
//             console.error('Error fetching contact data', error);
//             this.contactData = undefined;
//         }
//     }

//     // Fallback to placeholder image if the contact photo doesn't exist or can't be loaded
//     handleImageError(event) {
//         event.target.src = this.placeholderImageUrl;
//     }

//     // Navigate to the "Course_Data__c" page when the "More Info" button is clicked
//     navigateCourse(event) {
//         const accountId = event.target.dataset.accountId; // Retrieve account ID from the button
//         this[NavigationMixin.Navigate]({
//             type: 'comm__namedPage',
//             attributes: {
//                 name: 'Course_Data__c',
//             },
//             state: {
//                 accountId: accountId // Pass the Account ID as a parameter
//             }
//         });
//     }
// }










// import { LightningElement, api, wire } from 'lwc';
// import { getRecord } from 'lightning/uiRecordApi';
// import PHOTO_URL_FIELD from '@salesforce/schema/Contact.PhotoUrl';
// import FIRST_NAME_FIELD from '@salesforce/schema/Contact.FirstName';
// import LAST_NAME_FIELD from '@salesforce/schema/Contact.LastName';
// import DESCRIPTION_FIELD from '@salesforce/schema/Contact.Description';


// export default class ImageDisplay1 extends LightningElement {
//     @api recordId; // Record ID to fetch the contact data   @api recordId = '0035g00000XyzAb'; // Mock recordId for testing purposes

//     contact;
//     contactPhotoUrl;
//     contactName;
//     contactDescription;

//     connectedCallback() {
//         // Log the recordId to verify it's being passed
//         console.log('Record ID:', this.recordId);
//     }


//     @wire(getRecord, {
//         recordId: '$recordId',
//         fields: [PHOTO_URL_FIELD, FIRST_NAME_FIELD, LAST_NAME_FIELD, DESCRIPTION_FIELD]
//     })
//     wiredContact({ error, data }) {
//         if (data) {
//             this.contactPhotoUrl = data.fields.PhotoUrl.value || ''; // Get photo URL
//             this.contactName = `${data.fields.FirstName.value} ${data.fields.LastName.value}`; // Get full name
//             this.contactDescription = data.fields.Description ? data.fields.Description.value : 'No description available'; // Get description
//             this.contact = data; // Store full contact data
//         } else if (error) {
//             console.error('Error fetching contact data', error);
//         }
//     }
// }
