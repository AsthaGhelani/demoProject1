import { LightningElement, track, wire } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import getLeadId from '@salesforce/apex/AdditionalDetailPage.getLeadId';
import { CurrentPageReference } from 'lightning/navigation';

export default class AdditionalDetailPage extends LightningElement {

    street=''
    city=''
    state=''
    zipCode=''
    country=''
    pinCode=''
    xpy=''
    xper=''
    xipy=''
    xiper=''

    @track error;
     @track currentRecord;
     @track leadId;
     isModalOpen = false;
    
        openModal() {
            this.isModalOpen = true;
        }
    
        closeModal() {
            this.isModalOpen = false;
        }
    
    
        handleChange(event) {
            //const field = event.target.name;
            this[ event.target.name] = event.target.value;
        }
        @wire(getLeadId,{leadId:'$leadId'})
        wiredLead({error, data}) {
            if(data) {
                this.currentRecord=data;
            }
            else if(error) {
                this.showToast('Error', error.message, 'error');
            }
        }
        
        handleSubmit() {
            // if (!this.firstName || !this.lastName || !this.email || !this.courseId) {
            //     this.showToast('Error', 'Please fill all required fields.', 'error');
            //     return;
            // }
    
            console.log('Form Data:', {
                firstName: this.firstName,
                middleName: this.middleName,
                lastName: this.lastName,
                phno: this.phno,
                stream: this.stream,
                prevEdu: this.prevEdu,
                gender: this.gender,
                dob: this.dob,
                emailAddress: this.emailAddress,
                courseId: this.courseId
            });
    
            // console.log('email===========',this.emailAddress);
            // console.log('coureId ========================', courseId);
            
            submitInquiry({ firstName: this.firstName, 
                middleName: this.middleName, 
                lastName: this.lastName, 
                prevEdu: this.prevEdu, 
                stream: this.stream,              
                phno: this.phno, 
                // formattedEligibility:, 
                gender: this.gender, 
                dob: this.dob, 
                //courseId: this.courseId, 
                emailAddress: this.emailAddress 
            })
            .then(result => {
                this.showToast('Success', result, 'success');
                this.resetForm();
                this.closeModal();
            })
            .catch(error => {
                console.error('Error submitting inquiry', error);
                this.showToast('Error', 'Failed to submit inquiry.', 'error');
            });
        }
    
        resetForm() {
            this.firstName = '';
            this.middleName = '';
            this.lastName = '';
            this.prevEdu= '';
            this.gender = 'Male';
            this.dob = '';
            this.emailAddress = '';
            this.courseId = '';
        }
    
        showToast(title, message, variant) {
            this.dispatchEvent(new ShowToastEvent({ title, message, variant }));
        }

        //  studentLeadId from URL
            @wire(CurrentPageReference)
            getStateParameters(currentPageReference) {
                if (currentPageReference?.state?.leadId) {
                    this.studentLeadId = currentPageReference.state.leadId;
                    // console.log('studentLeadId from URL:', this.studentLeadId);
                }
                
                
            }
}