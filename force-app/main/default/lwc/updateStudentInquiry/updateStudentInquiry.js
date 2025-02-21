import { LightningElement, api, track, wire } from 'lwc';
import updateStudentInquiryLead from '@salesforce/apex/UpdateStudentInquiry.updateStudentInquiryLead';
import getStudentInquiryLead from '@salesforce/apex/UpdateStudentInquiry.getInquiryData';
// import sendEmail from '@salesforce/apex/UpdateStudentInquiry.updateStudentInquiryLead';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { CurrentPageReference } from 'lightning/navigation';

export default class UpdateInquiry extends LightningElement {
    @api leadId;
    recordId;
    fieldValues;

    // @track mail;
    @track errorMsg;

    @track firstName;
    @track middleName;
    @track lastName;
    @track emailAddress;   
    @track phone;
    @track gender;
    @track street;
    @track country;
    @track city;
    @track state;
    @track xpy;
    @track xper;
    @track xipy;
    @track xiper;
    

    connectedCallback() {
        this.getLeadIdFromUrl();
        if (this.leadId) {
            this.fetchLeadData();
        }
    }

    getLeadIdFromUrl() {
        const urlParams = new URLSearchParams(window.location.search);
        this.leadId = urlParams.get('leadId');
        if (!this.leadId) {
            console.error('No leadId found in URL');
            return;
        }
        console.log('Lead ID from URL:', this.leadId);
    }

    fetchLeadData() {
        if (this.leadId) {
            getStudentInquiryLead({ leadId: this.leadId })
                .then(result => {
                    if (result) {
                        this.firstName = result.First_Name__c;
                        this.middleName = result.Middle_Name__c;
                        this.lastName = result.Last_Name__c;
                        this.emailAddress = result.Email__c;
                        this.phone = result.Phone__c;
                        this.gender = result.Gender__c;
                        this.street = result.Street__c;
                        this.city = result.City__c;
                        this.country = result.Country__c;
                        this.state = result.State__c;
                        this.xpy = result.X10th_Pass_Year__c;
                        this.xper = result.X10th_Percentage__c;
                        this.xipy = result.X12th_Pass_Year__c;
                        this.xiper = result.X12th_Percentage__c;
                    } else {
                        console.error('No lead data found.');
                    }
                })
                .catch(error => {
                    console.error('Error fetching lead data: ', error);
                });   
        }
    }
    
    genderOptions = [
        { label: 'Male', value: 'Male' },
        { label: 'Female', value: 'Female' },
        { label: 'Other', value: 'Other' }
    ];


    handleInputChange(event) {
        // const fieldName = event.target.name; 
        this[event.target.name] = event.target.value; 
    }


    //Update record call "Update Button"
    handleUpdate() {

        //Send Mail 
        // sendEmail()
        //     .then(result =>{
        //         this.mail = result;
        //     })
        //     .catch(error =>{
        //         this.errorMsg = error;
        //     });
        
        if (!this.leadId) {
            console.error('Lead ID is missing');
            return;
        }
    
        const fieldValues = {
            First_Name__c: this.firstName,
            Middle_Name__c: this.middleName,
            Last_Name__c: this.lastName,
            Email__c: this.emailAddress,
            Phone__c: this.phone,
            Gender__c: this.gender,
            Street__c: this.street,
            City__c: this.city,
            Country__c: this.country,
            State__c: this.state,
            X10th_Pass_Year__c: this.xpy,
            X10th_Percentage__c: this.xper,
            X12th_Pass_Year__c: this.xipy,
            X12th_Percentage__c: this.xiper
        };
        console.log('===fieldValues=====',fieldValues);
        updateStudentInquiryLead({ leadId: this.leadId,fieldValues : fieldValues })
            .then(result => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success',
                        message: result,
                        variant: 'success'
                    })
                );
                
                console.log("firstName ========",this.firstName);
                console.log("middleName ========",this.middleName);
                console.log("emailAddress ========",this.emailAddress);
                console.log("Phone ========",this.phone);
            })
            .catch(error => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error updating lead',
                        message: error.body ? error.body.message : error.message,
                        variant: 'error'
                    })
                );
            });

            // sendEmail({leadId:this.leadId, emailAddress:this.emailAddress})
            // .then(result =>{
            //             this.mail = result;
            //         })
            //         .catch(error =>{
            //             this.errorMsg = error;
            //         });


            // const flow = this.template.querySelector('lightning-flow');
            // flow.startFlow('Email_on_Update_Student_Inquiry');
    }
    
    
    // Handle form errors
    handleError(event) {
        this.dispatchEvent(
            new ShowToastEvent({
                title: 'Error',
                message: event.detail.message,
                variant: 'error'
            })
        );
    }

    @wire(CurrentPageReference)
    setCurrentPageReference(currentPageReference) {
        if (currentPageReference && currentPageReference.state.leadId) {
            this.leadId = currentPageReference.state.leadId;  
            console.log('PageReference ID from URL:', this.leadId);
            this.fetchLeadData();  
        }
    }
}































// import { LightningElement, track, wire } from 'lwc';
// import getStudentInquiryLead from '@salesforce/apex/UpdateStudentInquiry.getInquiryData';
// import updateStudentInquiryLead from '@salesforce/apex/UpdateStudentInquiry.updateInquiryData';
// import { ShowToastEvent } from 'lightning/platformShowToastEvent';
// import { CurrentPageReference } from 'lightning/navigation';

// export default class UpdateStudentInquiry extends LightningElement {
//     @track firstName;
//     @track middleName;
//     @track lastName;
//     @track email;
//     @track phone;
//     @track dob;
//     @track gender;

//     @track street;
//     @track country;
//     @track city;
//     @track state;

//     @track xpy;
//     @track xper;
//     @track xipy;
//     @track xiper;

//     @track leadId; //  to store leadId

//     // Fetch record data when component is initialized
//     connectedCallback() {
//         this.getLeadIdFromUrl();
//         if (this.leadId) {
//             this.fetchLeadData();
//         }
//     }

//     getLeadIdFromUrl() {
//         // Extract leadId from URL query parameter
//         const urlParams = new URLSearchParams(window.location.search);
//         this.leadId = urlParams.get('leadId');
//         console.log('Lead ID from URL:', this.leadId);
//     }

//     fetchLeadData() {
//         if (this.leadId) {
//             getStudentInquiryLead({ leadId: this.leadId })
//                 .then(result => {
//                     this.firstName = result.First_Name__c;
//                     this.middleName = result.Middle_Name__c;
//                     this.lastName = result.Last_Name__c;
//                     this.email = result.Email__c;
//                     this.phone = result.Phone__c;
//                     this.dob = result.DOB__c;
//                     this.gender = result.Gender__c;
//                     this.street = result.Street__c;
//                     this.city = result.City__c;
//                     this.country = result.Country__c;
//                     this.state = result.State__c;
//                     this.xpy = result.X10th_Pass_Year__c;
//                     this.xper =result.X10th_Percentage__c;
//                     this.xipy = result.X12th_Pass_Year__c;
//                     this.xiper = result.X12th_Percentage__c;
//                 })
//                 .catch(error => {
//                     console.error('Error fetching lead data: ', error);
//                 });
//         }
//     }


//     handleInputChange(event) {
//         const fieldName = event.target.name;
//         this[fieldName] = event.target.value;
//     }

//     handleUpdate() {
//         const leadData = {
//             Id: this.leadId,
//             First_Name__c: this.firstName,
//             Middle_Name__c: this.middleName,
//             Last_Name__c: this.lastName,
//             Email__c: this.email,
//             Phone__c: this.phone,
//             DOB__c: this.dob,
//             Gender__c: this.gender,
//             City__: this.city,
//             Street__c: this.street,
//             Country__c: this.country,
//             State__c: this.state,
//             X10th_Pass_Year__c: this.xpy,
//             X10th_Percentage__c: this.xper,
//             X12th_Pass_Year__c: this.xipy,
//             X12th_Percentage__c: this.xiper,
//         };

//         updateStudentInquiryLead({ leadId: this.leadId, leadData })
//             .then(result => {
//                 this.dispatchEvent(
//                     new ShowToastEvent({
//                         title: 'Success',
//                         message: result,
//                         variant: 'success',
//                     })
//                 );
//             })
//             .catch(error => {
//                 this.dispatchEvent(
//                     new ShowToastEvent({
//                         title: 'Error',
//                         message: error.body.message,
//                         variant: 'error',
//                     })
//                 );
//             });
//     }

//     @wire(CurrentPageReference)
//     setCurrentPageReference(currentPageReference) {
//         if (currentPageReference && currentPageReference.state.leadId) {
//             this.leadId = currentPageReference.state.leadId;
//             console.log('PageReference ID from URL:', this.leadId);
//             this.fetchLeadData();
//         }
//     }
// }





// import { LightningElement, api, track, wire } from 'lwc';
// import { getRecord } from 'lightning/uiRecordApi';  // Standard wire adapter 
// import { ShowToastEvent } from 'lightning/platformShowToastEvent';
// import { CurrentPageReference } from 'lightning/navigation';

// Fields to fetch from the lead record
// import FIRST_NAME from '@salesforce/schema/Student_Inquiry_Lead__c.First_Name__c';
// import MIDDLE_NAME from '@salesforce/schema/Student_Inquiry_Lead__c.Middle_Name__c';
// import LAST_NAME from '@salesforce/schema/Student_Inquiry_Lead__c.Last_Name__c';
// import EMAIL from '@salesforce/schema/Student_Inquiry_Lead__c.Email__c';
// import PHONE from '@salesforce/schema/Student_Inquiry_Lead__c.Phone__c';
// import DOB from '@salesforce/schema/Student_Inquiry_Lead__c.DOB__c';
// import GENDER from '@salesforce/schema/Student_Inquiry_Lead__c.Gender__c';
// import STREET from '@salesforce/schema/Student_Inquiry_Lead__c.Street__c';
// import CITY from '@salesforce/schema/Student_Inquiry_Lead__c.City__c';
// import COUNTRY from '@salesforce/schema/Student_Inquiry_Lead__c.Country__c';
// import STATE from '@salesforce/schema/Student_Inquiry_Lead__c.State__c';
// import XPY from '@salesforce/schema/Student_Inquiry_Lead__c.X10th_Pass_Year__c';
// import XPER from '@salesforce/schema/Student_Inquiry_Lead__c.X10th_Percentage__c';
// import XIPY from '@salesforce/schema/Student_Inquiry_Lead__c.X12th_Pass_Year__c';
// import XIPER from '@salesforce/schema/Student_Inquiry_Lead__c.X12th_Percentage__c';

// export default class UpdateStudentInquiry extends LightningElement {
//     @api leadId;  // recordId is passed via URL
//     @track leadData;  // Holds the lead data dynamically fetched

//     @wire(getRecord, {
//         leadId: '$leadId',
//         fields: [
//             FIRST_NAME,
//             MIDDLE_NAME,
//             LAST_NAME,
//             EMAIL,
//             PHONE,
//             DOB,
//             GENDER,
//             STREET,
//             CITY,
//             COUNTRY,
//             STATE,
//             XPY,
//             XPER,
//             XIPY,
//             XIPER
//         ]
//     })
//     lead;

//     // field values from the fetched record
//     get firstName() {
//         return this.lead.data ? this.lead.data.fields.First_Name__c.value : '';
//     }

//     get middleName() {
//         return this.lead.data ? this.lead.data.fields.Middle_Name__c.value : '';
//     }

//     get lastName() {
//         return this.lead.data ? this.lead.data.fields.Last_Name__c.value : '';
//     }

//     get email() {
//         return this.lead.data ? this.lead.data.fields.Email__c.value : '';
//     }

//     get phone() {
//         return this.lead.data ? this.lead.data.fields.Phone__c.value : '';
//     }

//     get dob() {
//         return this.lead.data ? this.lead.data.fields.DOB__c.value : '';
//     }

//     get gender() {
//         return this.lead.data ? this.lead.data.fields.Gender__c.value : '';
//     }

//     get street() {
//         return this.lead.data ? this.lead.data.fields.Street__c.value : '';
//     }

//     get city() {
//         return this.lead.data ? this.lead.data.fields.City__c.value : '';
//     }

//     get country() {
//         return this.lead.data ? this.lead.data.fields.Country__c.value : '';
//     }

//     get state() {
//         return this.lead.data ? this.lead.data.fields.State__c.value : '';
//     }

//     get xpy() {
//         return this.lead.data ? this.lead.data.fields.X10th_Pass_Year__c.value : '';
//     }

//     get xper() {
//         return this.lead.data ? this.lead.data.fields.X10th_Percentage__c.value : '';
//     }

//     get xipy() {
//         return this.lead.data ? this.lead.data.fields.X12th_Pass_Year__c.value : '';
//     }

//     get xiper() {
//         return this.lead.data ? this.lead.data.fields.X12th_Percentage__c.value : '';
//     }

//     handleSuccess(event) {
//         const fields = event.detail.fields;
//         this.dispatchEvent(
//             new ShowToastEvent({
//                 title: 'Success',
//                 message: `Lead ${fields.Name} updated successfully.`,
//                 variant: 'success'
//             })
//         );
//     }

//     handleError(event) {
//         this.dispatchEvent(
//             new ShowToastEvent({
//                 title: 'Error',
//                 message: event.detail.message,
//                 variant: 'error'
//             })
//         );
//     }

//     @wire(CurrentPageReference)
//     setCurrentPageReference(currentPageReference) {
//         if (currentPageReference && currentPageReference.state.leadId) {
//             this.leadId = currentPageReference.state.leadId;
//             console.log('Lead ID from URL:', this.leadId);  // Add this log to verify
//         }
//     }

// }









// import { LightningElement, api, track, wire } from 'lwc';
// import getStudentInquiryLead from '@salesforce/apex/UpdateStudentInquiry.getInquiryData';
// import updateStudentInquiry from '@salesforce/apex/UpdateStudentInquiry.updateInquiryData';
// import { ShowToastEvent } from 'lightning/platformShowToastEvent';
// import { CurrentPageReference } from 'lightning/navigation';

// export default class UpdateStudentInquiry extends LightningElement {
//     @track leadId;
//     @track firstName;
//     @track middleName;
//     @track lastName;
//     @track email;
//     @track phone;
//     @track dob;
//     @track gender;

//     @track street;
//     @track country;
//     @track city;
//     @track state;

//     @track xpy;
//     @track xper;
//     @track xipy;
//     @track xiper;

//     connectedCallback() {
//         this.getLeadIdFromUrl();
//         if (this.leadId) {
//             this.fetchLeadData();
//         }
//     }

//     getLeadIdFromUrl() {
//         const urlParams = new URLSearchParams(window.location.search);
//         this.leadId = urlParams.get('leadId');
//         if (!this.leadId) {
//             console.error('No leadId found in URL');
//             return;
//         }
//         console.log('Lead ID from URL:', this.leadId);
//     }

//     fetchLeadData() {
//         if (this.leadId) {
//             getStudentInquiryLead({ leadId: this.leadId })
//                 .then(result => {
//                     if (result) {
//                         this.firstName = result.First_Name__c;
//                         this.middleName = result.Middle_Name__c;
//                         this.lastName = result.Last_Name__c;
//                         this.email = result.Email__c;
//                         this.phone = result.Phone__c;
//                         this.dob = result.DOB__c;
//                         this.gender = result.Gender__c;
//                         this.street = result.Street__c;
//                         this.city = result.City__c;
//                         this.country = result.Country__c;
//                         this.state = result.State__c;
//                         this.xpy = result.X10th_Pass_Year__c;
//                         this.xper = result.X10th_Percentage__c;
//                         this.xipy = result.X12th_Pass_Year__c;
//                         this.xiper = result.X12th_Percentage__c;
//                     } else {
//                         console.error('No lead data found.');
//                     }
//                 })
//                 .catch(error => {
//                     console.error('Error fetching lead data: ', error);
//                 });
//         }
//     }

//     handleInputChange(event) {
//         const fieldName = event.target.name;
//         this[fieldName] = event.target.value;
//     }

//     // Submit the form to update the Lead record
//     handleSubmit(event) {
//         event.preventDefault(); // Prevent default form submission

//         updateStudentInquiry({
//             leadId: this.leadId,
//             firstName: this.firstName,
//             middleName: this.middleName,
//             lastName: this.lastName,
//             email: this.email,
//             phone: this.phone,
//             dob: this.dob,
//             gender: this.gender,
//             street: this.street,
//             city: this.city,
//             country: this.country,
//             state: this.state,
//             xpy: this.xpy,
//             xper: this.xper,
//             xipy: this.xipy,
//             xiper: this.xiper
//         })
//         .then(() => {
//             this.showToast('Success', 'Lead updated successfully', 'success');
//         })
//         .catch(error => {
//             this.showToast('Error', 'Failed to update lead: ' + error.body.message, 'error');
//         });
//     }

//     showToast(title, message, variant) {
//         this.dispatchEvent(
//             new ShowToastEvent({
//                 title: title,
//                 message: message,
//                 variant: variant,
//             })
//         );
//     }

//     @wire(CurrentPageReference)
//     setCurrentPageReference(currentPageReference) {
//         if (currentPageReference && currentPageReference.state.leadId) {
//             this.leadId = currentPageReference.state.leadId;
//             this.fetchLeadData();
//         }
//     }
// }















// ==============================================================


// import { LightningElement, api, track, wire } from 'lwc';
// import updateStudentInquiryLead from '@salesforce/apex/UpdateStudentInquiry.updateStudentInquiryLead';
// import getStudentInquiryLead from '@salesforce/apex/UpdateStudentInquiry.getInquiryData';
// import { ShowToastEvent } from 'lightning/platformShowToastEvent';
// import { CurrentPageReference } from 'lightning/navigation';

// export default class UpdateStudentInquiry extends LightningElement {
  

//     @track leadId;
//     recordId;
//     // @track leadId; // Store the dynamically fetched leadId from URL
//     // leadId = 'a01dL00000o39htQAA'
//     @track firstName;
//     @track middleName;
//     @track lastName;
//     @track email;
//     @track phone;
//     @track dob;
//     @track gender;

//     @track street;
//     @track country;
//     @track city;
//     @track state;

//     @track xpy;
//     @track xper;
//     @track xipy;
//     @track xiper;

//     // Fetch record data when component is initialized
//     connectedCallback() {
//         this.getLeadIdFromUrl();
//         if (this.leadId) {
//             this.fetchLeadData();
//         }
//     }

//     getLeadIdFromUrl() {
//         const urlParams = new URLSearchParams(window.location.search);
//         this.leadId = urlParams.get('leadId');
//         if (!this.leadId) {
//             console.error('No leadId found in URL');
//             return;
//         }
//         console.log('Lead ID from URL:', this.leadId);
//     }

//     // Fetch data for the leadId
//     fetchLeadData() {
//         if (this.leadId) {
//             getStudentInquiryLead({ leadId: this.leadId })
//                 .then(result => {
//                     if (result) {
//                         this.firstName = result.First_Name__c;
//                         this.middleName = result.Middle_Name__c;
//                         this.lastName = result.Last_Name__c;
//                         this.email = result.Email__c;
//                         this.phone = result.Phone__c;
//                         this.dob = result.DOB__c;
//                         this.gender = result.Gender__c;
//                         this.street = result.Street__c;
//                         this.city = result.City__c;
//                         this.country = result.Country__c;
//                         this.state = result.State__c;
//                         this.xpy = result.X10th_Pass_Year__c;
//                         this.xper = result.X10th_Percentage__c;
//                         this.xipy = result.X12th_Pass_Year__c;
//                         this.xiper = result.X12th_Percentage__c;

//                         console.log("Phone ========",this.phone);
//                         console.log("Street ========",this.street);
//                         console.log("xpy ========",this.xpy);
//                     } else {
//                         console.error('No lead data found.');
//                     }
//                 })
//                 .catch(error => {
//                     console.error('Error fetching lead data: ', error);
//                 });

                
//         }
//     }
    
//     genderOptions = [
//         { label: 'Male', value: 'Male' },
//         { label: 'Female', value: 'Female' },
//         { label: 'Other', value: 'Other' }
//     ];


//     handleInputChange(event) {
//         const fieldName = event.target.name; 
//         this[fieldName] = event.target.value; 
//     }

//     // Form submission to update the lead record dynamically
//     handleSuccess(event) {
//         // const fieldValues = {};
//         // const fields = [
//         //     'firstName', 'middleName', 'lastName', 'email', 'phone', 'dob', 'gender',
//         //     'street', 'city', 'country', 'state', 'xpy', 'xper', 'xipy', 'xiper'
//         // ];

//         const fieldValues = {
//                         'First_Name__c': this.firstName,
//                         'Middle_Name__c': this.middleName,
//                         'Last_Name__c': this.lastName,
//                         'Email__c': this.email,
//                         'Phone__c': this.phone,
//                         'DOB__c': this.dob,
//                         'Gender__c': this.gender,
//                         'Street__c': this.street,
//                         'City__c': this.city,
//                         'Country__c': this.country,
//                         'State__c': this.state,
//                         'X10th_Pass_Year__c': this.xpy,
//                         'X10th_Percentage__c': this.xper,
//                         'X12th_Pass_Year__c': this.xipy,
//                         'X12th_Percentage__c': this.xiper,
//                         // 'Marks__c': this.marks
//                     };
        
//         // Loop through fields and add the non-empty ones to fieldValues
//         // fieldValues.forEach(field => {
//         //     if (this[field]) {
//         //         fieldValues[`${field.charAt(0).toUpperCase() + field.slice(1)}__c`] = this[field];
//         //     }
//         // });

//         console.log('Field Values: ', fieldValues); 
//         for (const field in fieldValues) {
//             if (!fieldValues[field]) {
//                 delete fieldValues[field];
//             }
//         }
//         console.log("Phone ========",this.phone);
//         console.log("Street ========",this.street);
//         console.log("xpy ========",this.xpy);

//         updateStudentInquiryLead({ leadId: this.leadId, fieldValues })
//             .then(result => {
//                 // Show success toast
//                 this.dispatchEvent(
//                     new ShowToastEvent({
//                         title: 'Success',
//                         message: result,
//                         variant: 'success'
//                     })
//                 );

//                 // Optionally fetch data again to update the form with latest values
//                 this.fetchLeadData();
//             })
//             .catch(error => {
//                 this.dispatchEvent(
//                     new ShowToastEvent({
//                         title: 'Error',
//                         message: error.body.message,
//                         variant: 'error'
//                     })
//                 );
//             });
//     }

//     // Handle form errors
//     handleError(event) {
//         this.dispatchEvent(
//             new ShowToastEvent({
//                 title: 'Error',
//                 message: event.detail.message,
//                 variant: 'error'
//             })
//         );
//     }

//     @wire(CurrentPageReference)
//     setCurrentPageReference(currentPageReference) {
//         if (currentPageReference && currentPageReference.state.leadId) {
//             this.leadId = currentPageReference.state.leadId;  // Dynamically set leadId from URL
//             console.log('PageReference ID from URL:', this.leadId);
//             this.fetchLeadData();  // Fetch the lead data if the leadId is present
//         }
//     }
// }

















// ================= latest code =================================================


// import { LightningElement, api, track, wire } from 'lwc';
// import updateStudentInquiryLead from '@salesforce/apex/UpdateStudentInquiry.updateStudentInquiryLead';
// import getStudentInquiryLead from '@salesforce/apex/UpdateStudentInquiry.getInquiryData';
// import { ShowToastEvent } from 'lightning/platformShowToastEvent';
// import { CurrentPageReference } from 'lightning/navigation';


// export default class updateStudentInquiry extends LightningElement {
//     // @api recordId; // The record ID passed from the URL or parent component
//     //  recordId='a01dL00000o39htQAA'
//     recordId;
//     @track leadId;

//     @track firstName;
//     @track middleName;
//     @track lastName;
//     @track email;
//     @track phone;
//     @track dob;
//     @track gender;

    
//     @track street;
//     @track country;
//     @track city;
//     @track state;

//     @track xpy;
//     @track xper;
//     @track xipy;
//     @track xiper;



//     // Fetch record data when component is initialized
//     connectedCallback() {
//         this.getLeadIdFromUrl();
//         if (this.leadId) {
//             this.fetchLeadData();
//         }
//     }

//     getLeadIdFromUrl() {
//         const urlParams = new URLSearchParams(window.location.search);
//         this.leadId = urlParams.get('leadId');
//         if (!this.leadId) {
//             console.error('No leadId found in URL');
//             return;
//         }
//         console.log('Lead ID from URL:', this.leadId);
//     }
    
//     fetchLeadData() {
//         if (this.leadId) {
//             getStudentInquiryLead({ leadId: this.leadId })
//                 .then(result => {
//                     if (result) {
//                         this.firstName = result.First_Name__c;
//                         this.middleName = result.Middle_Name__c;
//                         this.lastName = result.Last_Name__c;
//                         this.email = result.Email__c;
//                         this.phone = result.Phone__c;
//                         this.dob = result.DOB__c;
//                         this.gender = result.Gender__c;
//                         this.street = result.Street__c;
//                         this.city = result.City__c;
//                         this.country = result.Country__c;
//                         this.state = result.State__c;
//                         this.xpy = result.X10th_Pass_Year__c;
//                         this.xper = result.X10th_Percentage__c;
//                         this.xipy = result.X12th_Pass_Year__c;
//                         this.xiper = result.X12th_Percentage__c;
//                     } else {
//                         console.error('No lead data found.');
//                     }
//                 })
//                 .catch(error => {
//                     console.error('Error fetching lead data: ', error);
//                 });

//         }
//     }

//     // Handle field input changes
//     handleInputChange(event) {
//         // const fieldName = event.target.fieldName;
//         this[event.target.fieldName] = event.target.value;
//     }



//     //  form submission
//     handleSuccess(event) {
//         // Prepare the data to be sent to Apex
//         const fieldValues = {
//             'First_Name__c': this.firstName,
//             'Middle_Name__c': this.middleName,
//             'Last_Name__c': this.lastName,
//             'Email__c': this.email,
//             'Phone__c': this.phone,
//             'DOB__c': this.dob,
//             'Gender__c': this.gender,
//             'Street__c': this.street,
//             'City__c': this.city,
//             'Country__c': this.country,
//             'State__c': this.state,
//             'X10th_Pass_Year__c': this.xpy,
//             'X10th_Percentage__c': this.xper,
//             'X12th_Pass_Year__c': this.xipy,
//             'X12th_Percentage__c': this.xiper,
//             // 'Marks__c': this.marks
//         };
//         console.log('10th======',this.xpy)
//         console.log('Gender======',this.xpy)


//         // Remove empty fields from the map
//         for (const field in fieldValues) {
//             if (!fieldValues[field]) {
//                 delete fieldValues[field];
//             }
//         }        

//             // Call Apex to update the record
//         updateStudentInquiryLead({ leadId: this.recordId, fieldValues })
//             .then(result => {
//                 this.dispatchEvent(
//                     new ShowToastEvent({
//                         title: 'Success',
//                         message: result,
//                         variant: 'success'
//                     })
//                 );
//             })
//             .catch(error => {
//                 this.dispatchEvent(
//                     new ShowToastEvent({
//                         title: 'Error',
//                         message: error.body.message,
//                         variant: 'error'
//                     })
//                 );
//             });



//     }

//     // Handle form errors
//     handleError(event) {
//         this.dispatchEvent(
//             new ShowToastEvent({
//                 title: 'Error',
//                 message: event.detail.message,
//                 variant: 'error'
//             })
//         );
//     }


//     handleUpdate(event) {
//         const fields = event.detail.fields;
//         this.dispatchEvent(
//             new ShowToastEvent({
//                 title: 'Success',
//                 message: `Lead ${fields.Name} updated successfully.`,
//                 variant: 'success'
//             })
//         );
//          // Refresh the record after successful update
//          refreshApex(this.leadId); // This will refresh the wire data
//     }

//     @wire(CurrentPageReference)
//     setCurrentPageReference(currentPageReference) {
//         if (currentPageReference && currentPageReference.state.leadId) {
//             this.leadId = currentPageReference.state.leadId;
//             console.log('PageReference ID from URL:', this.leadId);
//             this.fetchLeadData();
//         }
//     }
// }















// import { LightningElement, api, track, wire } from 'lwc';
// import getStudentInquiryLead from '@salesforce/apex/UpdateStudentInquiry.getInquiryData';
// import updateStudentInquiryLead from '@salesforce/apex/UpdateStudentInquiry.updateInquiryData';
// import { ShowToastEvent } from 'lightning/platformShowToastEvent';
// import { CurrentPageReference } from 'lightning/navigation';

// export default class UpdateStudentInquiry extends LightningElement {
//     // @api recordId; // Record ID passed from the URL
//     leadId; // Record ID passed from the URL
//     leadId ='a01dL00000nkYowQAE'
//     @track firstName;
//     @track middleName;
//     @track lastName;
//     @track email;
//     @track phone;
//     @track dob;
//     @track gender;
//    
    // @track street;
    // @track country;
    // @track city;
    // @track state;

    // @track xpy;
    // @track xper;
    // @track xipy;
    // @track xiper;


//     // Fetch the lead record data when component is initialized
//     connectedCallback() {
//         this.fetchLeadData();
//         console.log('recordId', this.leadId);
//     }

//     fetchLeadData() {
//         getStudentInquiryLead({ leadId: this.leadId })
//             .then(result => {
//                 // Set the retrieved lead data to the form fields
//                 this.firstName = result.First_Name__c;
//                 this.middleName = result.Middle_Name__c;
//                 this.lastName = result.Last_Name__c;
//                 this.email = result.Email__c;
//                 this.phone = result.Phone__c;
//                 this.dob = result.DOB__c;
//                 this.gender = result.Gender__c;
//                  this.street = result.Street__c;
                    // this.city = result.City__c;
                    // this.country = result.Country__c;
                    // this.state = result.State__c;
                    // this.xpy = result.X10th_Pass_Year__c;
                    // this.xper =result.X10th_Percentage__c;
                    // this.xipy = result.X12th_Pass_Year__c;
                    // this.xiper = result.X12th_Percentage__c;
//             })
//             .catch(error => {
//                 // Handle error
//                 console.error('Error fetching lead data: ', error);
//             });
//     }

//     handleInputChange(event) {
//         const fieldName = event.target.name;
//         this[fieldName] = event.target.value;
//     }

//     handleUpdate() {
//         const leadData = {
//             Id: this.leadId,
//             First_Name__c: this.firstName,
//             Middle_Name__c: this.middleName,
//             Last_Name__c: this.lastName,
//             Email__c: this.email,
//             Phone__c: this.phone,
//             DOB__c: this.dob,
//             Gender__c: this.gender,
//             Stream__c: this.stream,
//             Previous_Education__c: this.prevEdu,
//              Street__c: this.street,
                // Country__c: this.country,
                // State__c: this.state,
                // X10th_Pass_Year__c: this.xpy,
                // X10th_Percentage__c: this.xper,
                // X12th_Pass_Year__c: this.xipy,
                // X12th_Percentage__c: this.xiper,
//         };

//         updateStudentInquiryLead({ leadId: this.leadId, leadData })
//             .then(result => {
//                 this.dispatchEvent(
//                     new ShowToastEvent({
//                         title: 'Success',
//                         message: result,
//                         variant: 'success',
//                     })
//                 );
//             })
//             .catch(error => {
//                 this.dispatchEvent(
//                     new ShowToastEvent({
//                         title: 'Error',
//                         message: error.body.message,
//                         variant: 'error',
//                     })
//                 );
//             });
//     }

//     @wire(CurrentPageReference)
//     setCurrentPageReference(currentPageReference) {
//         if (currentPageReference) {
//             this.leadId = currentPageReference.state.leadId;
//             console.log('Record ID from URL:', this.leadId);
//         }
//     }
// }













// import { LightningElement, api, track } from 'lwc';
// import updateStudentInquiryLead from '@salesforce/apex/UpdateStudentInquiry.updateStudentInquiryLead';
// import { ShowToastEvent } from 'lightning/platformShowToastEvent';

// export default class updateStudentInquiry extends LightningElement {
//     // @api recordId; // The record ID passed from the URL or parent component
//     // recordId='a01dL00000nkYowQAE'
//     @api recordId;

//     @track firstName;
//     @track middleName;
//     @track lastName;
//     @track email;
//     @track phone;
//     @track dob;
//     @track gender;
//     @track street;
//     @track country;
//     @track state;
//     // @track marks;

//     // Handle field input changes
//     handleInputChange(event) {
//         const fieldName = event.target.fieldName;
//         this[fieldName] = event.target.value;
//     }

//     // Handle form submission
//     handleSuccess(event) {
//         // Prepare the data to be sent to Apex
//         const fieldValues = {
//             'First_Name__c': this.firstName,
//             'Middle_Name__c': this.middleName,
//             'Last_Name__c': this.lastName,
//             'Email__c': this.email,
//             'Phone__c': this.phone,
//             'DOB__c': this.dob,
//             'Gender__c': this.gender,
//             'Street__c': this.street,
//             'Country__c': this.country,
//             'State__c': this.state,
//             // 'Marks__c': this.marks
//         };

//         // Remove empty fields from the map
//         for (const field in fieldValues) {
//             if (!fieldValues[field]) {
//                 delete fieldValues[field];
//             }
//         }

//         // Call Apex to update the record
//         updateStudentInquiryLead({ leadId: this.recordId, fieldValues })
//             .then(result => {
//                 this.dispatchEvent(
//                     new ShowToastEvent({
//                         title: 'Success',
//                         message: result,
//                         variant: 'success'
//                     })
//                 );
//             })
//             .catch(error => {
//                 this.dispatchEvent(
//                     new ShowToastEvent({
//                         title: 'Error',
//                         message: error.body.message,
//                         variant: 'error'
//                     })
//                 );
//             });
//     }

//     // Handle form errors
//     handleError(event) {
//         this.dispatchEvent(
//             new ShowToastEvent({
//                 title: 'Error',
//                 message: event.detail.message,
//                 variant: 'error'
//             })
//         );
//     }
// }
