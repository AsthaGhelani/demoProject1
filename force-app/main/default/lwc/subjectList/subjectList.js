import { LightningElement, track } from 'lwc';
import fetchSubjectsForStudent from '@salesforce/apex/SubjectList.fetchSubjectsForStudent';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class SubjectListDisplay extends LightningElement {
    @track subjects = [];  // Store fetched subjects
    @track errorMessage = '';  // Store error messages

    // Fetch subjects when the component is initialized
    connectedCallback() {
        const studentId = sessionStorage.getItem('studentId');
        if (studentId) {
            this.fetchSubjectsForStudent(studentId);
        } else {
            this.errorMessage = 'No student ID found in session.';
        }
    }

    // Call the Apex method to fetch subjects for a specific student
    fetchSubjectsForStudent(studentId) {
        fetchSubjectsForStudent({ studentId })
            .then(result => {
                if (result && result.length > 0) {
                    // Add showTable field to manage visibility of the subject table
                    this.subjects = result.map(subject => ({
                        ...subject,
                        showTable: false,  // Initialize showTable to false
                    }));
                } else {
                    this.errorMessage = 'No subjects found for this student.';
                }
            })
            .catch(error => {
                this.errorMessage = 'Error fetching student subjects.';
                console.error('Error:', error);
            });
    }

    // Handle click event on each subject card
    handleCardClick(event) {
        const clickedSubjectId = event.currentTarget.dataset.id;
        // Toggle the visibility of the subject table
        this.subjects = this.subjects.map(subject => {
            if (subject.Id === clickedSubjectId) {
                subject.showTable = !subject.showTable;
            }
            return subject;
        });
    }















// import { LightningElement, api, wire, track } from 'lwc';
// import getSubjectsForStudent from '@salesforce/apex/SubjectList.getSubjectsForStudent';

// export default class SubjectList extends LightningElement {


//     @track studentNumber =''; // The studentNumber (SN-002) will be passed to this component
//     // studentNumber='SN-0022';
//     subjects = [];

//     // Wire the Apex method to fetch subjects based on student number
//     @wire(getSubjectsForStudent, { studentNumber: '$studentNumber' })
//     wiredSubjects({ error, data }) {
//         if (data) {
//             this.subjects = data; // Store the subjects in the component's state
//         } else if (error) {
//             console.error('Error fetching subjects:', error);
//         }
//     }





    // @api studentId; // The studentId will be passed to this component
    // // studentId='a04dL000001jv9dQAA';
    // subjects = [];

    // @wire(getSubjectsForStudent, { studentId: '$studentId' })
    // wiredSubjects({ error, data }) {
    //     if (data) {
    //         this.subjects = data; // Store the subjects in the component's state
    //     } else if (error) {
    //         console.error('Error fetching subjects:', error);
    //     }
    // }


    
    // @api courseId; // The courseId will be passed to this component
    // courseId='a05dL00000DLZpuQAH'; // If you want to pass data from component to LWC, we have to set that variable using @api
    // subjects = [];

    // @wire(getSubjectsForCourse, { courseId: '$courseId' })
    // wiredSubjects({ error, data }) {
    //     if (data) {
    //         this.subjects = data; // Store the subjects in the component's state
    //     } else if (error) {
    //         console.error('Error fetching subjects:', error);
    //     }
    // }


}





