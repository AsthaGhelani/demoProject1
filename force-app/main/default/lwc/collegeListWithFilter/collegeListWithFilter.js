import { LightningElement, track, wire } from 'lwc';
import getColleges from '@salesforce/apex/CollegeListWithFilter.getColleges';
import getDistinctColleges from '@salesforce/apex/CollegeListWithFilter.getDistinctColleges';

export default class CollegeListWithFilter extends LightningElement {
    @track colleges = [];
    @track isLoading = false;
    @track hasError = false;
    @track collegeNameOptions = [];
    collegeNameFilter = '';

    sortBy = 'Name'; // Default sorting by course name
    sortOrder = 'ASC'; // Default sorting order is ascending

    // Sorting options for dropdown
    sortOptions = [
        { label: 'Course Name', value: 'Name' },
        { label: 'Fees', value: 'Course_Fees__c' }
    ];

    // Sort Order options (Ascending / Descending)
    sortOrderOptions = [
        { label: 'Ascending', value: 'ASC' },
        { label: 'Descending', value: 'DESC' }
    ];

    //  columns for the datatable
    columns = [
        { label: 'Course Name', fieldName: 'Name' },
        { label: 'College', fieldName: 'CollegeName' },
        { label: 'Fees', fieldName: 'Course_Fees__c', type: 'currency' }
    ];

    //  fetch college data based on filters and sorting
    @wire(getColleges, { 
        nameFilter: '', 
        cityFilter: '', 
        sortBy: '$sortBy',
        sortOrder: '$sortOrder',
        collegeNameFilter: '$collegeNameFilter' 
    })
    wiredColleges({ error, data }) {
        if (data) {
            // Map the data to include dynamic row classes
            this.colleges = data.map((course, index) => ({
                ...course,
                CollegeName: course.College__r ? course.College__r.Name : 'No College',  // Safely handle null
                rowClass: index % 2 === 0 ? 'even-row' : 'odd-row' // Assign class based on index
            }));
            this.isLoading = false;
            this.hasError = false;
        } else if (error) {
            this.hasError = true;
            this.isLoading = false;
        }
    }

    //  to fetch distinct college names for the filter
    @wire(getDistinctColleges)
    wiredDistinctColleges({ error, data }) {
        if (data) {
            // Include the "All Colleges" option at the top of the list
            this.collegeNameOptions = [
                { label: 'All Colleges', value: '' },  // Value as empty string to signify no filter
                ...data.map(college => ({
                    label: college.Name,
                    value: college.Name
                }))
            ];
        } else if (error) {
            console.error('Error fetching distinct colleges', error);
        }
    }

    // Handle changes to Sort By (course name or fees)
    handleSortByChange(event) {
        this.sortBy = event.target.value;
        this.fetchData();
    }

    // Handle changes to Sort Order (ascending/descending)
    handleSortOrderChange(event) {
        this.sortOrder = event.target.value;
        this.fetchData();
    }

    // Handle changes to College Name filter (including "All Colleges")
    handleCollegeNameFilterChange(event) {
        this.collegeNameFilter = event.target.value;  // Will be empty if "All Colleges" is selected
        this.fetchData();
    }

    // Fetch data based on current filters and sorting
    fetchData() {
        this.isLoading = true;
        // Trigger the wired method to fetch data again based on the updated filter
    }
}












// import { LightningElement, wire } from 'lwc';
// import getColleges from '@salesforce/apex/CollegeListWithFilter.getColleges';

// export default class CollegeListWithFilter extends LightningElement {


 

//     nameFilter = '';
//     cityFilter = '';
//     colleges = [];
//     isLoading = false;
//     hasError = false;

//     columns = [
//         { label: 'Name', fieldName: 'Name' },
//         { label: 'City', fieldName: 'City__c' },
//         { label: 'University Name', fieldName: 'UniversityId__c' }
//     ];

//     // Wire the Apex method to fetch colleges
//     @wire(getColleges, { nameFilter: '$nameFilter', cityFilter: '$cityFilter' })
//     wiredColleges({ error, data }) {
//         if (data) {
//             this.colleges = data;
//             this.isLoading = false;
//             this.hasError = false;
//         } else if (error) {
//             this.colleges = [];
//             this.isLoading = false;
//             this.hasError = true;
//             this.showToast('Error', 'There was a problem fetching college data.', 'error');
//         }
//     }

//     // Handle changes in the name filter input
//     handleNameChange(event) {
//         this.nameFilter = event.target.value;
//         this.isLoading = true;  // Show loading spinner while fetching data
//     }

//     // Handle changes in the city filter input
//     handleCityChange(event) {
//         this.cityFilter = event.target.value;
//         this.isLoading = true;  // Show loading spinner while fetching data
//     }

//     // Show a toast message
//     showToast(title, message, variant) {
//         const event = new ShowToastEvent({
//             title: title,
//             message: message,
//             variant: variant
//         });
//         this.dispatchEvent(event);
//     }
// }
