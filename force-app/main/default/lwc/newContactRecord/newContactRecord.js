import { LightningElement, wire } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import CONTACT_OBJECT from '@salesforce/schema/Contact';
import FIRST_NAME_FIELD from '@salesforce/schema/Contact.FirstName';
import LAST_NAME_FIELD from '@salesforce/schema/Contact.LastName';
import EMAIL_FIELD from '@salesforce/schema/Contact.Email';
import TITLE_FIELD from '@salesforce/schema/Contact.Title';
import PHONE_FIELD from '@salesforce/schema/Contact.Phone';
import ACCOUNT_FIELD from '@salesforce/schema/Contact.AccountId';
import getAccounts from '@salesforce/apex/GetAccounts.getAccountRecords';  // Importing the Apex method

export default class NewContactRecord extends LightningElement {
    isModalOpen = false;
    contactObject = CONTACT_OBJECT;
    firstNameField = FIRST_NAME_FIELD;
    lastNameField = LAST_NAME_FIELD;
    emailField = EMAIL_FIELD;
    phoneField = PHONE_FIELD;
    titleField = TITLE_FIELD;
    accountField = ACCOUNT_FIELD;

    accounts = []; // Will store the list of Accounts fetched from Apex

    // Wire the getAccounts method to retrieve the Account names
    @wire(getAccounts)
    wiredAccounts({ error, data }) {
        if (data) {
            this.accounts = data.map(account => ({
                label: account.Name,
                value: account.Id
            }));
        } else if (error) {
            console.error('Error fetching accounts:', error);
        }
    }

    openModal() {
        this.isModalOpen = true;
    }

    closeModal() {
        this.isModalOpen = false;
    }

    handleSuccess(event) {
        const evt = new ShowToastEvent({
            title: 'Success',
            message: 'Contact created successfully!',
            variant: 'success',
        });
        this.dispatchEvent(evt);
        this.closeModal();
    }

    handleAccountChange(event) {
        this.accountValue = event.target.value;
    }

    
}










// import { LightningElement } from 'lwc';
// import {NavigationMixin} from 'lightning/navigation';

// export default class NewContactRecord extends NavigationMixin( LightningElement ){
//     navigateToNewRecordPage() {
//         this[NavigationMixin.Navigate]({
//             type: "standard__recordPage",
//             attributes: {
//             objectApiName: "Contact",
//             actionName: "new",
//             },
//         })
//     }
// }