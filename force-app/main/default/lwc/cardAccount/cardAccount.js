// Contains account card upon button click it can edit that particular record 

import { LightningElement, wire, api, track } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import accountData from '@salesforce/apex/cardStudent.accountData';

export default class CardAccount extends NavigationMixin(LightningElement) {
    @track accounts;
    @track recordId; // To store the selected recordId
    @track isModalOpen = false; // Modal visibility flag

    @wire(accountData)
    wiredContacts({ error, data }) {
        if (data) {
            this.accounts = data;
        } else if (error) {
            console.error(error);
        }
    }

    // Handler for the "More Info" button click
    navigateCourse(event) {
        this.recordId = event.target.dataset.accountId; // Get the Account ID
        this.isModalOpen = true; // Open the modal dialog to edit
    }

    // Close the modal
    closeModal() {
        this.isModalOpen = false;
    }

    // Success handler after saving the record
    handleSuccess(event) {
        const recordId = event.detail.id;
        this.isModalOpen = false; // Close the modal
        console.log('Record Updated with ID:', recordId); // You can add a toast or further action here
    }

    // Error handler for any errors during saving
    handleError(event) {
        const errorMsg = event.detail.message;
        console.error('Error updating record:', errorMsg);
    }
}










// import { LightningElement,wire,api, track } from 'lwc';
// import { NavigationMixin } from 'lightning/navigation';
// import accountData from '@salesforce/apex/cardStudent.accountData';
// // import getAccounts from '@salesforce/apex/courseDataAccountController.getAccounts';


// export default class CardAccount extends NavigationMixin(LightningElement) {
//     //College Card
//      @track recordId;
  
//         accounts;
//         error;

//         @wire(accountData)
//         //function
//         wiredContacts({error,data}){
//             if(data){
//                 this.accounts=data;
//                 this.error=undefined;
//             }else if(error){
//                 this.error=error;
//                 this.accounts=undefined;
//             }
//         }
        
//     //Course Data Builder Page Navigate using "More Info" Button
//         navigateCourse(event){
//             this.recordId=event.target.dataset.accountId;
//             this[NavigationMixin.Navigate]({
//                 type:"comm__namedPage",
//                 attributes:{
//                     name:"Course_Data__c",
//                 },
//                 state: {
//                     accountId: this.recordId // Pass Account ID as a parameter
//                 }
//             });
//         }

        

// }