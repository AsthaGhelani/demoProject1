import { LightningElement } from 'lwc';


export default class Icons extends LightningElement {
    connectedCallback() {
        // Dynamically load Font Awesome CSS
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css';
        document.head.appendChild(link);
    }
}










// import { LightningElement } from 'lwc';

// export default class Footer1 extends LightningElement {



//     email = ''; // To hold the email entered by the user

//     // Handle email input change
//     handleEmailChange(event) {
//         this.email = event.target.value;
//     }

//     // Handle subscribe button click
//     handleSubscribe() {
//         if (this.email) {
//             // Define the recipient email and subject
//             const recipientEmail = 'hetvivaghasiya@gmail.com'; // Replace with your desired email address
//             const subject = 'Newsletter Subscription';
//             const body = `Email: ${this.email}`;

//             // Open the user's email client with pre-filled details
//             window.location.href = `mailto:${recipientEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
//         } else {
//             alert('Please enter your email address.');
//         }
//     }
// }

