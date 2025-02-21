import { LightningElement } from 'lwc';

export default class TabNavigation extends LightningElement {
    // Variables to manage active tabs
    isProfileActive = true;
    isDocumentActive = false;
    isFeesPaymentActive = false;

    // Variables to apply active tab styling
    profileTabClass = 'slds-tabs_default__link slds-text-link slds-text-color_default';
    documentTabClass = 'slds-tabs_default__link slds-text-link slds-text-color_default';
    feesPaymentTabClass = 'slds-tabs_default__link slds-text-link slds-text-color_default';

    handleTabClick(event) {
        // Get the clicked tab's data-id
        const selectedTab = event.target.dataset.id;

        // Reset all sections to inactive
        this.isProfileActive = false;
        this.isDocumentActive = false;
        this.isFeesPaymentActive = false;

        // Reset all tab styles
        this.profileTabClass = 'slds-tabs_default__link slds-text-link slds-text-color_default';
        this.documentTabClass = 'slds-tabs_default__link slds-text-link slds-text-color_default';
        this.feesPaymentTabClass = 'slds-tabs_default__link slds-text-link slds-text-color_default';

        // Activate the selected tab and its content
        if (selectedTab === 'profile') {
            this.isProfileActive = true;
            this.profileTabClass = 'slds-tabs_default__link slds-text-link slds-text-color_inverse';
        } else if (selectedTab === 'document') {
            this.isDocumentActive = true;
            this.documentTabClass = 'slds-tabs_default__link slds-text-link slds-text-color_inverse';
        } else if (selectedTab === 'fees-payment') {
            this.isFeesPaymentActive = true;
            this.feesPaymentTabClass = 'slds-tabs_default__link slds-text-link slds-text-color_inverse';
        }
    }
}
