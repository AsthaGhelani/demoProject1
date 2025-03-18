import { LightningElement } from 'lwc';

export default class NavigationBar extends LightningElement {

    // toggleMobileMenu(event){
    //     const evt = event.currentTarget;
    //     evt.classList.toggle("open");
    // }
    
    toggleMobileMenu() {
        // Select the hamburger menu and mobile menu elements
        const hamburgerMenu = this.template.querySelector('.hamburger-menu');
        const mobileMenu = this.template.querySelector('.mobile-menu');
        
        // Toggle the "open" class on the hamburger menu to change its appearance
        hamburgerMenu.classList.toggle('open');
        
        // Toggle the "display" of the mobile menu
        mobileMenu.classList.toggle('open');
    }
}