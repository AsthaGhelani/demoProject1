import { LightningElement, api, wire } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import uploadFile from '@salesforce/apex/ProfileInfo.uploadFile';  // Apex method to handle the file upload
import getImageUrl from '@salesforce/apex/ProfileInfo.getImageUrl';  // Apex method to retrieve the image URL

export default class ImageUpload extends LightningElement {
    @api recordId = 'a04dL000001iQRFQA2'; 
    imageUrl; 
    isOverlayClosed = false; 

    @wire(getImageUrl, { recordId: '$recordId' })
    wiredImageUrl({ error, data }) {
        if (data) {
            this.imageUrl = data; 
        } else if (error) {
            this.showToast('Error', 'Error fetching image: ' + error.body.message, 'error');
        }
    }

    // Method triggered when the upload finishes
    handleUploadFinished(event) {
        // Get the document ID of the uploaded file
        const uploadedFiles = event.detail.files;
        if (uploadedFiles.length > 0) {
            const documentId = uploadedFiles[0].documentId;
            this.uploadImageToRecord(documentId);
        }
    }

    uploadImageToRecord(documentId) {
        if (this.isOverlayClosed) {
            console.log('Overlay is already closed or in the process of closing');
            return; 
        }

        this.isOverlayClosed = true; 

       uploadFile({ recordId: this.recordId, documentId: documentId })
    .then((result) => {
        console.log('Image URL:', result); 
        this.imageUrl = result; 
        this.showToast('Success', 'Image uploaded successfully!', 'success');
        this.closeOverlay();
    })
    .catch(error => {
        let errorMessage = 'Unknown error occurred';
        if (error && error.body && error.body.message) {
            errorMessage = error.body.message;
        } else if (error && error.message) {
            errorMessage = error.message;
        }
        
        this.showToast('Error', 'Error uploading image: ' + errorMessage, 'error');
        console.error(error);
    });
    

    }

    showToast(title, message, variant) {
        const event = new ShowToastEvent({
            title: title,
            message: message,
            variant: variant,
        });
        this.dispatchEvent(event);
    }

    // HTML template part for showing the image
    get imageSrc() {
        return this.imageUrl; // Set image source dynamically based on the image URL
    }
}



















// import { LightningElement, api } from 'lwc';
// import { FlowNavigationNextEvent } from 'lightning/flowSupport';

// export default class FileUploadWithFlow extends LightningElement {
//      recordId ='a04dL000001h8szQAA'; // Salesforce record ID to link with uploaded file
//     uploadedFileUrl = ''; // Store the URL of the uploaded image

//     // Accepted file formats
//     get acceptedFormats() {
//         return ['.jpg', '.png', '.jpeg'];
//     }

//     // Event handler after file upload finishes
//     handleUploadFinished(event) {
//         const uploadedFiles = event.detail.files;
//         if (uploadedFiles.length > 0) {
//             const uploadedFile = uploadedFiles[0]; // Assuming you are uploading a single file

//             // Here we can process the uploaded file URL
//             this.uploadedFileUrl = `/sfc/servlet.shepherd/version/download/${uploadedFile.documentId}`;
//             console.log('Uploaded file URL:', this.uploadedFileUrl);

//             // Trigger a Flow to use this uploaded file URL
//             this.startFlowWithFileUrl(this.uploadedFileUrl);
//         }
//     }

//     // Start Flow with the uploaded file URL as input
//     startFlowWithFileUrl(fileUrl) {
//         const flowInputVariables = [
//             { name: 'recordId', type: 'String', value: this.recordId },
//             { name: 'uploadedFileUrl', type: 'String', value: fileUrl }
//         ];

//         // Navigate to the Flow
//         const flow = this.template.querySelector('lightning-flow');
//         flow.startFlow('Profile_Image_Display', flowInputVariables);
//     }
// }














// import { LightningElement, api } from 'lwc';
// import associateFileWithRecord from '@salesforce/apex/ProfileInfo.associateFileWithRecord';

// export default class FileUpload extends LightningElement {
//     @api recordId = 'a04dL000001h8szQAA';  // This is the specific record ID (e.g., Account ID, Contact ID)
//     uploadedFileUrl = ''; // Variable to store the uploaded file URL

//     // Accepted file formats
//     get acceptedFormats() {
//         return ['.jpg', '.png'];
//     }

//     // Handles the file upload finished event
//     handleUploadFinished(event) {
//         const uploadedFiles = event.detail.files;
//         console.log('Files uploaded:', uploadedFiles);

//         // Check if files were uploaded and capture the ContentDocumentId
//         if (uploadedFiles.length > 0) {
//             const file = uploadedFiles[0];
//             const contentDocumentId = file.documentId; // Get ContentDocumentId

//             // Call Apex to associate the file with the record and get the public URL
//             this.getFileUrlFromApex(contentDocumentId);
//         }
//     }

//     // Call Apex to associate the file with the record and get the public URL
//     getFileUrlFromApex(contentDocumentId) {
//         associateFileWithRecord({ contentDocumentId, recordId: this.recordId })
//             .then(result => {
//                 this.uploadedFileUrl = result; // Set the file URL from Apex
//                 console.log('Uploaded file URL:', this.uploadedFileUrl);
//             })
//             .catch(error => {
//                 console.error('Error generating public link:', error);
//             });
//     }
// }





















// import { LightningElement } from 'lwc';

// export default class TabNavigation extends LightningElement {
//     // Variables to manage active tabs
//     isProfileActive = true;
//     isDocumentActive = false;
//     isFeesPaymentActive = false;

//     // Variables to apply active tab styling
//     profileTabClass = 'slds-tabs_default__link slds-text-link slds-text-color_default';
//     documentTabClass = 'slds-tabs_default__link slds-text-link slds-text-color_default';
//     feesPaymentTabClass = 'slds-tabs_default__link slds-text-link slds-text-color_default';

//     handleTabClick(event) {
//         // Get the clicked tab's data-id
//         const selectedTab = event.target.dataset.id;

//         // Reset all sections to inactive
//         this.isProfileActive = false;
//         this.isDocumentActive = false;
//         this.isFeesPaymentActive = false;

//         // Reset all tab styles
//         this.profileTabClass = 'slds-tabs_default__link slds-text-link slds-text-color_default';
//         this.documentTabClass = 'slds-tabs_default__link slds-text-link slds-text-color_default';
//         this.feesPaymentTabClass = 'slds-tabs_default__link slds-text-link slds-text-color_default';

//         // Activate the selected tab and its content
//         if (selectedTab === 'profile') {
//             this.isProfileActive = true;
//             this.profileTabClass = 'slds-tabs_default__link slds-text-link slds-text-color_inverse';
//         } else if (selectedTab === 'document') {
//             this.isDocumentActive = true;
//             this.documentTabClass = 'slds-tabs_default__link slds-text-link slds-text-color_inverse';
//         } else if (selectedTab === 'fees-payment') {
//             this.isFeesPaymentActive = true;
//             this.feesPaymentTabClass = 'slds-tabs_default__link slds-text-link slds-text-color_inverse';
//         }
//     }
// }
