
import { LightningElement, wire } from 'lwc';
import getAllColleges from '@salesforce/apex/FacultyInfoController.getAllColleges';
import getFaculty from '@salesforce/apex/FacultyInfoController.getFacultyByCollegeId';

export default class FacultyInfocards extends LightningElement {

    collegeData = [];  // To hold all college records along with their faculty
    isLoading = false; // To show loading state
    error;  

    // Wire the Apex method to get all colleges
    @wire(getAllColleges)
    wiredColleges({ error, data }) {
        if (data) {
            // For each college, fetch its faculty data
            this.collegeData = data.map(college => ({
                ...college,
                facultyRecords: [],
                isActive: false  // Initially, the card is not expanded
            }));

            // Fetch faculty for each college
            this.collegeData.forEach(college => {
                this.fetchFacultyData(college.Id);
            });
        } else if (error) {
            this.error = error;  
            console.error('Error loading colleges:', error);
        }
    }

    // Fetch the faculty list for a specific college
    fetchFacultyData(collegeId) {
        this.isLoading = true;
        getFaculty({ collegeId })
            .then(result => {
                const college = this.collegeData.find(c => c.Id === collegeId);
                if (college) {
                    college.facultyRecords = result;  // Store the faculty data for this college
                    this.collegeData = [...this.collegeData];  // Trigger reactivity to update the DOM
                }
                this.isLoading = false;
            })
            .catch(error => {
                this.isLoading = false;
                this.error = error;
                console.error('Error fetching faculty list:', error);
            });
    }

    // Handle the card click event to toggle expansion
    handleCardClick(event) {
        const cardId = event.target.closest('.card').dataset.id; // Get card ID
        const card = this.template.querySelector(`[data-id="${cardId}"]`);
        card.classList.toggle('cardActive'); // Toggle expansion
    }
}

















// import { LightningElement } from 'lwc';

// export default class FacultyInfocards extends LightningElement {

//        // Sample data for cards
//        cards = [
//         { id: 1, expanded: false, inactive: false },
//         { id: 2, expanded: false, inactive: false },
//         { id: 3, expanded: false, inactive: false },
//         { id: 4, expanded: false, inactive: false },
//         { id: 5, expanded: false, inactive: false },
//         { id: 6, expanded: false, inactive: false },
//         { id: 7, expanded: false, inactive: false },
//         { id: 8, expanded: false, inactive: false },
//     ];

//     // Toggles the card expansion and collapse
//     toggleCard(event) {
//         const clickedCardId = event.target.closest('.card').dataset.id;

//         // Handle expanding or collapsing a card
//         this.cards = this.cards.map(card => {
//             if (card.id === Number(clickedCardId)) {
//                 card.expanded = !card.expanded;
//             } else {
//                 // Collapse all other cards
//                 card.expanded = false;
//                 card.inactive = true;
//             }
//             return card;
//         });
//     }

//     // Close the card when clicking the close icon
//     closeCard(event) {
//         const clickedCardId = event.target.closest('.card').dataset.id;

//         this.cards = this.cards.map(card => {
//             if (card.id === Number(clickedCardId)) {
//                 card.expanded = false;
//             }
//             return card;
//         });
//     }

//     // Return the dynamic class for card state (expanded, collapsed, inactive)
//     getCardClass(cardId) {
//         const card = this.cards.find(c => c.id === cardId);
//         let classes = 'card';

//         if (card.expanded) {
//             classes += ' is-expanded';
//         } else {
//             classes += ' is-collapsed';
//         }

//         if (card.inactive) {
//             classes += ' is-inactive';
//         }

//         return classes;
//     }

//     // Toggle the expanded state of the clicked college
//     handleToggleFaculty(event) {
//         const collegeId = event.target.dataset.id; // Get the clicked college ID
//         this.colleges = this.colleges.map(college => {
//             if (college.Id === collegeId) {
//                 return {
//                     ...college,
//                     expanded: !college.expanded // Toggle the expanded state
//                 };
//             }
//             return college;
//         });
        
//         this.colleges = [...this.colleges]; // Force rerender

//         // Force a re-render of the component to apply class changes
//         this.updateCardClasses();
//     }


//     updateCardClasses() {
//         // Get the cards from the template once
//         const cards = this.template.querySelectorAll('.college-card');
    
//         // Create a map for quick lookups by college ID
//         const collegeMap = this.colleges.reduce((acc, college) => {
//             acc[college.Id] = college; // Using the college ID as the key for quick lookup
//             return acc;
//         }, {});
    
//         // Iterate over each card and toggle the class based on its associated college's expanded state
//         cards.forEach(card => {
//             const collegeId = card.dataset.id;
    
//             // Check if the college exists in the map and get its expanded state
//             const college = collegeMap[collegeId];
//             if (college) {
//                 const isExpanded = college.expanded;
    
//                 // Toggle the 'cardActive' class based on the expanded state
//                 if (isExpanded) {
//                     card.classList.add('cardActive');
//                 } else {
//                     card.classList.remove('cardActive');
//                 }
//             }
//         });
//     }
    


//     // // Method to update the classes dynamically on the DOM
//     // updateCardClasses() {
//     //     const cards = this.template.querySelectorAll('.college-card');
        
//     //     cards.forEach(card => {
//     //         const collegeId = card.dataset.id;
//     //         const college = this.colleges.find(col => col.Id === collegeId);
            
//     //         // Add or remove the 'cardActive' class based on the expanded state
//     //         if (college.expanded) {
//     //             card.classList.add('cardActive');
//     //         } else {
//     //             card.classList.remove('cardActive');
//     //         }
//     //     });
//     // }
// }










// import { LightningElement } from 'lwc';

// export default class CollegeFaculty extends LightningElement {
//     // College Name (Header)
//     collegeName = 'Example College';

//     // Faculty List
//     facultyList = [
//         { id: 1, name: 'Dr. John Doe', position: 'Professor', email: 'johndoe@example.com' },
//         { id: 2, name: 'Dr. Jane Smith', position: 'Assistant Professor', email: 'janesmith@example.com' },
//         { id: 3, name: 'Dr. Emily White', position: 'Lecturer', email: 'emilywhite@example.com' }
//     ];

//     // Track whether the card is expanded or collapsed
//     isExpanded = false;

//     // Toggle class based on isExpanded state
//     get expandClass() {
//         return this.isExpanded ? 'expand' : 'collapse';
//     }

//     // Toggle function for expand/collapse
//     toggleExpand() {
//         this.isExpanded = !this.isExpanded;
//     }
// }



// import { LightningElement, wire, track } from 'lwc';
// import getColleges from '@salesforce/apex/FacultyInfoController.getColleges';
// import getFacultyByCollegeId from '@salesforce/apex/FacultyInfoController.getFacultyByCollegeId';

// export default class CollegeFaculty extends LightningElement {
//     @track colleges = []; // Store college and faculty data

//     // Wire to get colleges
//     @wire(getColleges)
//     wiredColleges({ error, data }) {
//         if (data) {
//             this.colleges = data.map(college => ({
//                 id: college.Id,
//                 name: college.Name,
//                 facultyList: [], // Initialize faculty list as empty
//                 isExpanded: false // Track expanded state
//             }));
//             this.fetchFaculty(collegeId);
//         } else if (error) {
//             console.error(error);
//         }
//     }

//     // Fetch faculty when the college is clicked
//     handleToggleExpand(event) {
//         const collegeId = event.target.dataset.id; // Get college ID from the clicked element
//         const college = this.colleges.find(col => col.id === collegeId);

//         if (college) {
//             // Toggle the expanded state
//             college.isExpanded = !college.isExpanded;

//             // Find the corresponding faculty list DOM element
//             const facultyListElement = this.template.querySelector(`.faculty-list[data-id="${collegeId}"]`);

//             // Toggle the visibility of the faculty list
//             if (facultyListElement) {
//                 if (college.isExpanded) {
//                     // Fetch faculty only if expanding and if not already fetched
//                     if (college.facultyList.length === 0) {
//                         this.fetchFaculty(collegeId);
//                     }
//                     facultyListElement.style.display = 'block'; // Show the faculty list
//                 } else {
//                     facultyListElement.style.display = 'none'; // Hide the faculty list
//                 }
//             }
//         }
//     }

//     isExpanded = false;

//     get expandClass() {
//         return this.isExpanded ? 'expand' : 'collapse';
//     }

//     // Toggle function for expand/collapse
//     toggleExpand() {
//         this.isExpanded = !this.isExpanded;
//     }


//     // Method to fetch faculty for a specific college
//     fetchFaculty(collegeId) {
//         getFacultyByCollegeId({ collegeId })
//             .then(facultyList => {
//                 const college = this.colleges.find(col => col.id === collegeId);
//                 if (college) {
//                     college.facultyList = facultyList.map(faculty => ({
//                         id: faculty.Id,
//                         name: faculty.Name,
//                         position: faculty.Position__c,
//                         email: faculty.Email__c
//                     }));
//                 }
//             })
//             .catch(error => {
//                 console.error(error);
//             });
//     }
// }











// import { LightningElement, wire } from 'lwc';
// import getAllColleges from '@salesforce/apex/FacultyInfoController.getColleges';
// import getFacultyList from '@salesforce/apex/FacultyInfoController.getFacultyByCollegeId';

// export default class FacultyComponent extends LightningElement {
//     collegeData = [];
//     isLoading = false;
//     error;

//     // Fetching the colleges data
//     @wire(getAllColleges)
//     wiredColleges({ error, data }) {
//         if (data) {
//             this.collegeData = data.map(college => ({
//                 ...college,
//                 isActive: false, // Initially set the card as not active
//                 facultyList: null // Faculty list is initially null
//             }));
//         } else if (error) {
//             this.error = error;
//         }
//     }

//     // Handle the click event on a card
//     handleCardClick(event) {
//         const collegeId = event.target.dataset.id;
//         const college = this.collegeData.find(c => c.id === collegeId);
//         college.isActive = !college.isActive;

//         if (college.isActive && !college.facultyList) {
//             this.fetchFacultyData(collegeId, college);
//         }

//         // Re-trigger reactivity by setting the collegeData array again
//         this.collegeData = [...this.collegeData];
//     }

//     // Fetch the faculty list for a specific college
//     fetchFacultyData(collegeId, college) {
//         this.isLoading = true;
//         getFacultyList({ collegeId })
//             .then(result => {
//                 college.facultyList = result;
//                 this.isLoading = false;
//                 this.collegeData = [...this.collegeData]; // Update collegeData
//             })
//             .catch(error => {
//                 this.isLoading = false;
//                 this.error = error;
//             });
//     }

//     // Getter for dynamic class binding for each college
//     get collegeClasses() {
//         return this.collegeData.map(college => {
//             return {
//                 id: college.id,
//                 className: college.isActive ? 'card cardActive' : 'card'  // Dynamically set class
//             };

//         });
//     }
// }





















// ================================================================================ 

// import { LightningElement, wire } from 'lwc';
// import getFaculty from '@salesforce/apex/FacultyInfoController.getCollegesWithFaculty';

// export default class FacultyInfocards extends LightningElement {

    
//         // facultyData = []; // To hold the data from Apex
//         // error; // To capture any error
    
//         // // Wire the Apex method to fetch data
//         // @wire(getFaculty)
//         // wiredFaculty({ error, data }) {
//         //     if (data) {
//         //         this.facultyData = data.map(faculty => ({
//         //             name: faculty.Name,
//         //             description: faculty.Last_Name__c,
//         //             // data: faculty.Data__c ? faculty.Data__c.split(';') : [],
//         //             // details: faculty.Details__c ? faculty.Details__c.split(';') : []
//         //         }));
//         //     } else if (error) {
//         //         this.error = error;
//         //         console.error('Error fetching faculty data', error);
//         //     }
//         // }
    
//         // // Handle the card click event to toggle active state
//         // handleCardClick(event) {
//         //     event.target.closest('.card').classList.toggle('cardActive');
//         // }



//     facultyRecords = [];  // To hold the fetched records
//     error;  // To handle errors

//     // Wire the Apex method to get the faculty records
//     @wire(getFaculty)
//     wiredFacultyRecords({ error, data }) {
//         if (data) {
//             this.facultyRecords = data;  // Assign the fetched data to facultyRecords
//         } else if (error) {
//             this.error = error;  // Handle error if any
//         }
//     }

//     // Handle the card click event to toggle the expansion
//     handleCardClick(event) {
//         const cardId = event.target.closest('.card').dataset.id; // Get card ID
//         const card = this.template.querySelector(`[data-id="${cardId}"]`);
//         card.classList.toggle('cardActive'); // Toggle expansion
//     }


//     }
    
    // ===================================================================