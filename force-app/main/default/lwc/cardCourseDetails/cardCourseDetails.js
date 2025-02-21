import { track, wire, api, LightningElement } from 'lwc';
import getCourse from '@salesforce/apex/cardCourse.getCourse';
import submitInquiry from '@salesforce/apex/cardCourse.submitInquiry';
import getCourseList from '@salesforce/apex/cardCourse.getCourseList';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { CurrentPageReference } from 'lightning/navigation';

export default class CardCourseDetails extends LightningElement {
    firstName = '';
    middleName = '';
    lastName = '';
    phno='';
    stream = '';
    prevEdu = '';
    gender = '';
    dob = '';
    emailAddress = '';
  //  @track courseId = ''; 
    @track courses = [];
    
     courseOpId='' ;
    @track cList=[];
   
    @track error;
    @track cid;


      // Fetch courses based on collegeId from URL
    @wire(getCourse, { cid: '$cid' })
    wiredCourses({ error, data }) {
        if (data) {
            this.courses = data.map(course => {
                // Precompute the formatted eligibility criteria for each course
                return {
                    ...course,
                    formattedEligibility: this.formatPicklistValues(course.Eligibility_Criteria__c)
                };
            });
            this.error = undefined;
        } else {
            this.error = error;
            this.courses = [];
        }
    }

    
    @wire(getCourseList, { cid: '$cid' })
    wiredCoursesList({ error, data }) {
        if (data) {
            this.clist = data.map(cl => {
                return{
               label:cl.Name,
               value:cl.Id
                }
            });
            this.error = undefined;
        } else {
            this.error = error;
            this.clist = [];
        }
    }

    // replacing semicolons with spaces
    formatPicklistValues(value) {
        return value ? value.replace(/;/g, ' | ') : 'No Eligibility Criteria Available';
    }

     //  collegeId from URL
    @wire(CurrentPageReference)
    getStateParameters(currentPageReference) {
        if (currentPageReference?.state?.cid) {
            this.cid = currentPageReference.state.cid;
        }
    }

    isModalOpen = false;

    openModal() {
        this.isModalOpen = true;
    }

    closeModal() {
        this.isModalOpen = false;
    }


    handleChange(event) {
        //const field = event.target.name;
        this[event.target.name] = event.target.value;
    }

    handleCourseChange(event) {
        // Update the courseId with the selected value
        this.courseOpId = event.target.value; // This binds the selected course ID to the courseId variable
    }
    
    
    handleSubmit() {
        // if (!this.firstName || !this.lastName || !this.email || !this.courseId) {
        //     this.showToast('Error', 'Please fill all required fields.', 'error');
        //     return;
        // }

        let formsttedDob=this.dob?new Date(this.dob):null;

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
            courseOpId: this.courseOpId
        });

        // console.log('email===========',this.emailAddress);
        // console.log('coureOpId ========================', courseOpId);
        
        submitInquiry({ 
            courseId:this.courseOpId,
            firstName: this.firstName, 
            middleName: this.middleName, 
            lastName: this.lastName, 
            gender: this.gender, 
            dob:formsttedDob,
            emailAddress: this.emailAddress,
            phno: this.phno, 
            prevEdu: this.prevEdu, 
            stream: this.stream   
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
}



//======================================================================







// import { track, wire, api, LightningElement } from 'lwc';
// import getCourse from '@salesforce/apex/cardCourse.getCourse';
// import { getRelatedListRecords } from 'lightning/uiRelatedListApi';
// // import saveInquiry from '@salesforce/apex/cardCourse.saveInquiry';
// import { CurrentPageReference } from 'lightning/navigation';

// export default class CardCourseDetails extends LightningElement {
//     @track courses = [];
//     @track error;
//     @track cid;
  

//     // Fetch courses based on collegeId from URL
//     @wire(getCourse, { cid: '$cid' })
//     wiredCourses({ error, data }) {
//         if (data) {
//             this.courses = data.map(course => {
//                 // Precompute the formatted eligibility criteria for each course
//                 return {
//                     ...course,
//                     formattedEligibility: this.formatPicklistValues(course.Eligibility_Criteria__c)
//                 };
//             });
//             this.error = undefined;
//         } else {
//             this.error = error;
//             this.courses = [];
//         }
//     }

//     // replacing semicolons with spaces
//     formatPicklistValues(value) {
//         return value ? value.replace(/;/g, ' | ') : 'No Eligibility Criteria Available';
//     }

//     //  collegeId from URL
//     @wire(CurrentPageReference)
//     getStateParameters(currentPageReference) {
//         if (currentPageReference?.state?.cid) {
//             this.cid = currentPageReference.state.cid;
//         }
//     }

//     isModalOpen = false;

//     openModal() {
//         this.isModalOpen = true;
//     }

//     closeModal() {
//         this.isModalOpen = false;
//     }

//     // Handle success after record creation
//     handleSuccess(event) {
//         const recordId = event.detail.id;
//         this.closeModal(); 
//         console.log('Record Created with ID:', recordId);
        
//     }

//     handleError(event) {
//         const errorMsg = event.detail.message;
//         console.error('Error creating record:', errorMsg);
//     }
// }
    



// ==========================================================================
   



        // course List for college in combo box

   
        // @track courseToDisplay = [];
        // @track selectedCourseId;  // To store the selected course
    
        // // Fetch related courses for the college based on the collegeId from the URL
        // @wire(getRelatedListRecords, {
        //     parentRecordId: '$cid', 
        //     relatedListId: 'Courses__r',  // Ensure this is the correct API name for the related list
        //     fields: ['Course__c.Name', 'Course__c.Id']
        // })
        // wiredRelatedList({ error, data }) {
        //     if (data) {
        //         console.log('Courses Data:', data.records);
        //         this.courses = data.records;
        //         this.updateCourseList();
        //         this.error = undefined;
        //     } else {
        //         this.error = error;
        //         this.courses = [];
        //     }
        // }
    
        // // Update the course list for combobox options
        // updateCourseList() {
        //     if (this.courses.length > 0) {
        //         this.courseToDisplay = this.courses.map(course => ({
        //             label: course.Name,  // Course name
        //             value: course.Id     // Course ID (to be used as the value in combobox)
        //         }));
        //     }
        // }
    
        // // Get the collegeId from the URL (via CurrentPageReference)
        // @wire(CurrentPageReference)
        // getStateParameters(currentPageReference) {
        //     if (currentPageReference?.state?.cid) {
        //         this.cid = currentPageReference.state.cid; // Fetch the college ID from the URL
        //     }
        // }
    
        // // Handle course selection change
        // handleCourseSelection(event) {
        //     this.selectedCourseId = event.detail.value;
        //     console.log("Selected Course:", this.selectedCourseId);
        // }
    
    
    

    // ====================================================================================




    


    //for email 
    // firstName = ''; 
    // lastName = ''; 
    // middleName ='';
    // emailAddress=''
    // phno='';
    // gender='';
    // stream='';
    // course='';
    // prevEdu='';
    // dob='';
    

    // handleInputChange(event) {
    //     this.firstName = event.target.value;
    //     this.lastName = event.target.value;
    //     this.middleName = event.target.value;
    //     this.emailAddress = event.target.value;
    //     this.phno = event.target.value;
    //     this.gender = event.target.value;
    //     this.stream = event.target.value;
    //     this.course = event.target.value;
    //     this.prevEdu = event.target.value;
    //     this.dob = event.target.value;

    // }

    // handleSave() {
    //         if (!this.emailAddress) {
    //             this.showToast('Error', 'Please enter a valid email address.', 'error');
    //             return;
    //         }
    
    //         saveAccount({ firstName: this.firstName, lastName: this.lastName, 
    //             middleName: this.middleName, emailAddress: this.emailAddress, phno: this.phno , dob: this.dob, prevEdu: this.prevEdu, gender :this.gender, stream :this.stream, course: this.course })
    //             .then(() => {
    //                 this.showToast('Success', 'Inquiry has been created and email sent!', 'success');
    //             })
    //             .catch((error) => {
    //                 this.showToast('Error', error.body.message, 'error');
    //             });
    //     }

    //     showToast(title, message, variant) {
    //         const event = new ShowToastEvent({
    //             title,
    //             message,
    //             variant,
    //         });
    //         this.dispatchEvent(event);
    //     }













// import { track, wire, api, LightningElement } from 'lwc';
// import getCourse from '@salesforce/apex/cardCourse.getCourse';
// // import getLeadsWithMultiPicklistValues from '@salesforce/apex/cardCourse.getLeadsWithMultiPicklistValues';
// import { CurrentPageReference } from 'lightning/navigation';

// export default class CardCourseDetails extends LightningElement {
//     @track courses = [];
//     // @track leads = [];
//     @track error;
//     @track cid;

//     // Fetch courses based on accountId from URL
//     @wire(getCourse, { cid: '$cid' })
//     wiredCourses({ error, data }) {
//         if (data) {
//             this.courses = data;
//             this.error = undefined;
//         } else {
//             this.error = error;
//             this.courses = [];
//         }
//     }

  
//     formatPicklistValues(value) {
//         return value ? value.replace(/;/g, ' ') : '';
//     }


//     // take accountId from the URL
//     @wire(CurrentPageReference)
//     getStateParameters(currentPageReference) {
//         if (currentPageReference?.state?.cid) {
//             this.cid = currentPageReference.state.cid;
//         }
//     }

    
//     isModalOpen = false;


//     //  dialog
//     openModal() {
//         this.isModalOpen = true;
//     }

//     closeModal() {
//         this.isModalOpen = false;
//     }

//     //  success after record creation
//     handleSuccess(event) {
//         const recordId = event.detail.id;
//         this.closeModal(); 
//         console.log('Record Created with ID:', recordId);
//     }

//     handleError(event) {
//         const errorMsg = event.detail.message;
//         console.error('Error creating record:', errorMsg);
//     }

// }
