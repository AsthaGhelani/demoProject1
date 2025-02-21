// upon button click it opens new record form for inserting

import { LightningElement } from 'lwc';

export default class NewSupportProductRecord extends LightningElement {
    isModalOpen = false;

    // Open the modal dialog
    openModal() {
        this.isModalOpen = true;
    }

    // Close the modal dialog
    closeModal() {
        this.isModalOpen = false;
    }

    // Handle success after record creation
    handleSuccess(event) {
        const recordId = event.detail.id;
        this.closeModal(); // Close the modal on success
        // Optionally, you can add a toast or any other actions after successful creation
        console.log('Record Created with ID:', recordId);
    }

    // Handle errors
    handleError(event) {
        const errorMsg = event.detail.message;
        console.error('Error creating record:', errorMsg);
    }
}













// import { LightningElement } from 'lwc';
// import { ShowToastEvent } from 'lightning/platformShowToastEvent';

// export default class NewSupportProductRecord extends LightningElement {

//     supportProductObject = SUPPORT_PRODUCT_OBJECT;


//       // Open the modal dialog
//     openModal() {
//         this.isModalOpen = true;
//     }

//     // Close the modal dialog
//     closeModal() {
//         this.isModalOpen = false;
//     }

//     // Success callback for form submission
//     handleSuccess(event) {
//         const evt = new ShowToastEvent({
//             title: 'Success',
//             message: 'Support Product created successfully!',
//             variant: 'success',
//         });
//         this.dispatchEvent(evt);
//         this.closeModal(); // Close the modal after successful creation
//     }

//     // Cancel callback
//     handleCancel() {
//         // You can add any logic you want to handle when the form is canceled.
//         console.log('New Support Product creation was canceled');
//     }
// }
