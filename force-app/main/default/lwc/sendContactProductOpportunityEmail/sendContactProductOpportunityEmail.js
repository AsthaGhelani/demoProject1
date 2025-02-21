import { LightningElement, track } from 'lwc';
import createContactAndSendEmail from '@salesforce/apex/EmailController.createContactAndSendEmail';

export default class ContactForm extends LightningElement {
    @track contactName = '';
    @track email = '';
    @track phone = '';
    @track description = '';

    handleNameChange(event) {
        this.contactName = event.target.value;
    }

    handleEmailChange(event) {
        this.email = event.target.value;
    }

    handlePhoneChange(event) {
        this.phone = event.target.value;
    }

    handleDescriptionChange(event) {
        this.description = event.target.value;
    }

    sendEmail() {
        createContactAndSendEmail({ 
            contactName: this.contactName, 
            email: this.email, 
            phone: this.phone, 
            description: this.description 
        })
        .then((result) => {
            console.log('Contact created and email sent successfully');
        })
        .catch((error) => {
            console.error('Error: ', error);
        });
    }
}
