// import { LightningElement,track,wire } from 'lwc';
// // import { CurrentPageReference } from 'lightning/navigation';
// // import USER_ID from '@salesforce/user/Id';
// export default class MainNavbar extends LightningElement {
//     @track isLoggedIn = false;

//     connectedCallback() {
//         this.isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
//     }

// }









import { LightningElement, track } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';  // Import NavigationMixin

export default class MainNavbar extends NavigationMixin(LightningElement) {
    @track isLoggedIn = false;

    connectedCallback() {
        this.isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    }

    // Navigate to a page when a link is clicked
    handleNavigation(event) {
        const targetPage = event.target.dataset.page;
        
        this[NavigationMixin.Navigate]({
            type: 'comm__namedPage',
            attributes: {
                name: Home, // Use a dynamic page name here
            }
        });
    }
}
