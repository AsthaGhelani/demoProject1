

// import { LightningElement, api, wire } from 'lwc';
// import getAttachmentsForRecord from '@salesforce/apex/Fetchfiles.getAttachmentsForRecord';
// import getFilesForRecord from '@salesforce/apex/Fetchfiles.getFilesForRecord';
// import getFileUrl from '@salesforce/apex/Fetchfiles.getFileUrl';

// // import getImageUrl from '@salesforce/apex/Fetchfiles.getImageUrl';


// export default class FetchFiles extends LightningElement {

//         recordId = 'a04dL000001h8zRQAQ';  // Static Student Record ID
//         attachments = [];
//         files = [];
//         imageUrls = [];
//         error;
    
//         // Fetch attachments and files when the component is initialized
//         connectedCallback() {
//             this.fetchAttachments();
//             this.fetchFiles();
//         }
    
//         // Fetch Attachments for the given static recordId
//         fetchAttachments() {
//             getAttachmentsForRecord({ recordId: this.recordId })
//                 .then((data) => {
//                     this.attachments = data;
//                     this.loadImageUrls();  // Once attachments are fetched, load URLs
//                 })
//                 .catch((error) => {
//                     this.error = error;
//                     console.error('Error fetching attachments:', error);
//                 });
//         }
    
//         // Fetch Files for the given static recordId (ContentDocument)
//         fetchFiles() {
//             getFilesForRecord({ recordId: this.recordId })
//                 .then((data) => {
//                     this.files = data;
//                     this.loadImageUrls();  // Once files are fetched, load URLs
//                 })
//                 .catch((error) => {
//                     this.error = error;
//                     console.error('Error fetching files:', error);
//                 });
//         }
    
//         // Fetch URLs for Attachments and Files
//         loadImageUrls() {
//             this.imageUrls = [];  // Reset image URLs array
    
//             // Process Attachments
//             this.attachments.forEach((attachment) => {
//                 if (attachment.ContentType && attachment.ContentType.startsWith('image')) {
//                     // Convert the attachment to base64 URL for displaying images
//                     let reader = new FileReader();
//                     reader.onload = () => {
//                         this.imageUrls.push(reader.result);  // Base64 encoded image
//                     };
//                     reader.readAsDataURL(attachment.Body); // Read as base64 encoded data
//                 }
//             });
    
//             // Process Files (ContentDocument)
//             this.files.forEach((file) => {
//                 getFileUrl({ contentDocumentId: file.ContentDocumentId })
//                     .then((url) => {
//                         this.imageUrls.push(url);  // Add file URL for image display
//                     })
//                     .catch((error) => {
//                         console.error('Error fetching file URL:', error);
//                     });
//             });
//         }
// }
    


import { LightningElement, wire } from 'lwc';
import getProfileImage from '@salesforce/apex/Fetchfiles.getProfileImage';

export default class StudentProfileImage extends LightningElement {
    imageUrl;  // Holds the base64-encoded image URL
    error;     // Holds the error message, if any

    // Wire the Apex method to fetch the profile image
    @wire(getProfileImage, { studentId: 'a04dL000001h8zRQAQ' }) // Static student ID
    wiredProfileImage({ error, data }) {
        if (data) {
            // Set the base64-encoded image URL directly
            this.imageUrl = data;
        } else if (error) {
            this.error = error;
            console.error('Error fetching profile image:', error);
        }
    }
}
