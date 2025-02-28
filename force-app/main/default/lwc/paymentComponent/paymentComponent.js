import { LightningElement, track } from 'lwc';
import getStudentProfileWithSemesters from '@salesforce/apex/PaymentClass.getStudentProfileWithSemesters';
import createRazorpayPaymentLink from '@salesforce/apex/PaymentClass.createRazorpayPaymentLink';
import sendPaymentLinkEmail from '@salesforce/apex/PaymentClass.sendPaymentLinkEmail';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class FeesPayments extends LightningElement {
    @track studentData = {};
    @track semesters = [];
    @track errorMessage = '';
    @track paymentStatusMessage = '';  // Track the payment status message

    connectedCallback() { 
        const studentId = sessionStorage.getItem('studentId'); 
        console.log('📢 Student ID from session:', studentId); // ✅ Debugging
        
        if (studentId) {
            this.fetchStudentProfile(studentId);
        } else {
            this.errorMessage = 'No student ID found in session.';
        }
    }

    fetchStudentProfile(studentId) {
        console.log('📢 Fetching Student Data for ID:', studentId); // ✅ Debugging
        getStudentProfileWithSemesters({ studentId })
            .then(result => {
                console.log('✅ Data Received:', result);
                if (result && result.student) {
                    this.studentData = result.student;
                    this.semesters = result.semesters;
                } else {
                    this.errorMessage = 'No profile data found for this Student ID.';
                }
            })
            .catch(error => {
                this.errorMessage = 'Error fetching student profile.';
                console.error('❌ Error:', error);
            });
    }

    // Payment Button Logic
    handlePayClick(event) {
        const semesterId = event.target.dataset.id;
        console.log('📝 Pay button clicked for Semester ID:', semesterId);

        // Call Apex to create Razorpay Payment Link
        createRazorpayPaymentLink({ semesterId })
            .then(paymentLink => {
                console.log('✅ Razorpay Payment Link Created:', paymentLink);
                
                // Send the payment link via email to the student
                const studentEmail = this.studentData.Email__c;
                console.log('📧 Sending payment link email to:', studentEmail);
                
                sendPaymentLinkEmail({ paymentLink, studentEmail })
                    .then(() => {
                        // Show success toast and update payment status message
                        this.paymentStatusMessage = `Payment link sent for Semester ID: ${semesterId}`;
                        this.showToast('Payment Initiated', `Payment link sent for Semester ID: ${semesterId}`, 'success');
                    })
                    .catch((emailError) => {
                        // Show error toast if email fails
                        this.paymentStatusMessage = 'Failed to send payment link email.';
                        this.showToast('Error', 'Failed to send payment link email.', 'error');
                        console.error('❌ Email Error:', emailError);
                    });
            })
            .catch((paymentError) => {
                // Show error toast if payment link creation fails
                this.paymentStatusMessage = 'Failed to create payment link.';
                this.showToast('Error', 'Failed to create payment link.', 'error');
                console.error('❌ Payment Error:', paymentError);
            });
    }

    // Toast Notification Function
    showToast(title, message, variant) {
        const event = new ShowToastEvent({
            title: title,
            message: message,
            variant: variant,
        });
        this.dispatchEvent(event);
    }
}
















// import { LightningElement, track } from 'lwc';
// import getStudentProfileWithSemesters from '@salesforce/apex/PaymentClass.getStudentProfileWithSemesters';
// import createRazorpayPaymentLink from '@salesforce/apex/PaymentClass.createRazorpayPaymentLink';
// import sendPaymentLinkEmail from '@salesforce/apex/PaymentClass.sendPaymentLinkEmail';
// import { ShowToastEvent } from 'lightning/platformShowToastEvent';

// export default class FeesPayments extends LightningElement {
//     @track studentData = {};
//     @track semesters = [];
//     @track errorMessage = '';
//     @track studentEmail = '';
//     @track paymentLink = '';

//     connectedCallback() { 
//         const studentId = sessionStorage.getItem('studentId'); 
//         console.log('📢 Student ID from session:', studentId); // ✅ Debugging
        
//         if (studentId) {
//             this.fetchStudentProfile(studentId);
//         } else {
//             this.errorMessage = 'No student ID found in session.';
//         }
//     }

//     fetchStudentProfile(studentId) {
//         console.log('📢 Fetching Student Data for ID:', studentId); // ✅ Debugging
//         getStudentProfileWithSemesters({ studentId })
//             .then(result => {
//                 console.log('✅ Data Received:', result);
//                 if (result && result.student) {
//                     this.studentData = result.student;
//                     this.semesters = result.semesters;
//                 } else {
//                     this.errorMessage = 'No profile data found for this Student ID.';
//                 }
//             })
//             .catch(error => {
//                 this.errorMessage = 'Error fetching student profile.';
//                 console.error('❌ Error:', error);
//             });
//     }

//     // Payment Button Logic
//     handlePayClick(event) {
//         const semesterId = event.target.dataset.id;
//         console.log('📝 Pay button clicked for Semester ID:', semesterId);

//         // Call Apex to create Razorpay Payment Link
//         createRazorpayPaymentLink({ semesterId })
//             .then(paymentLink => {
//                 // Send the payment link via email to the student
//                 const studentEmail = this.studentData.Email__c;
//                 sendPaymentLinkEmail({ paymentLink, studentEmail })
//                     .then(() => {
//                         // Show success toast
//                         this.showToast('Payment Initiated', `Payment link sent for Semester ID: ${semesterId}`, 'success');
//                     })
//                     .catch((emailError) => {
//                         // Show error toast if email fails
//                         this.showToast('Error', 'Failed to send payment link email.', 'error');
//                         console.error('❌ Email Error:', emailError);
//                     });
//             })
//             .catch((paymentError) => {
//                 // Show error toast if payment link creation fails
//                 this.showToast('Error', 'Failed to create payment link.', 'error');
//                 console.error('❌ Payment Error:', paymentError);
//             });
//     }

//     // Toast Notification Function
//     showToast(title, message, variant) {
//         const event = new ShowToastEvent({
//             title: title,
//             message: message,
//             variant: variant,
//         });
//         this.dispatchEvent(event);
//     }
// }












// import { LightningElement, track, api } from 'lwc';
// import getStudentProfileWithSemesters from '@salesforce/apex/PaymentClass.getStudentProfileWithSemesters';
// import { ShowToastEvent } from 'lightning/platformShowToastEvent';

// export default class FeesPayments extends LightningElement {
//     @track studentData = {};
//     @track semesters = [];
//     @track errorMessage = '';

//     connectedCallback() { 
//         const studentId = sessionStorage.getItem('studentId'); 
//         console.log('📢 Student ID from session:', studentId); // ✅ Debugging
        
//         if (studentId) {
//             this.fetchStudentProfile(studentId);
//         } else {
//             this.errorMessage = 'No student ID found in session.';
//         }
//     }

//     fetchStudentProfile(studentId) {
//         console.log('📢 Fetching Student Data for ID:', studentId); // ✅ Debugging
//         getStudentProfileWithSemesters({ studentId })
//             .then(result => {
//                 console.log('✅ Data Received:', result);
//                 if (result && result.student) {
//                     this.studentData = result.student;
//                     this.semesters = result.semesters;
//                 } else {
//                     this.errorMessage = 'No profile data found for this Student ID.';
//                 }
//             })
//             .catch(error => {
//                 this.errorMessage = 'Error fetching student profile.';
//                 console.error('❌ Error:', error);
//             });
//     }

//     //Payment Button
//     handlePayClick(event) {
//         const semesterId = event.target.dataset.id;
//         console.log('📝 Pay button clicked for Semester ID:', semesterId);
    
//         // Show a toast message
//         this.showToast('Payment Initiated', `Payment started for Semester ID: ${semesterId}`, 'success');
    
//         // You can add payment logic here (e.g., navigate to a payment page)
//     }
    

//     // ✅ Toast Notification Function
//     showToast(title, message, variant) {
//         const event = new ShowToastEvent({
//             title: title,
//             message: message,
//             variant: variant,
//         });
//         this.dispatchEvent(event);
//     }
// }
