import { LightningElement, wire, track } from 'lwc';
import getLeadsWithMultiPicklistValues from '@salesforce/apex/MultiPicklistDisplay.getLeadsWithMultiPicklistValues';

export default class LeadListDisplay extends LightningElement {
    @track leads = [];  // To store list of leads
    @track error;       // To store any errors

    // Wire the Apex method to get Leads with Multi-Picklist values
    @wire(getLeadsWithMultiPicklistValues)
    wiredLeads({ error, data }) {
        if (data) {
            // Process the leads to include multi-picklist values as an array
            this.leads = data.map(ld => ({
                ...ld,
                LeadSourceValues: this.getMultiPicklistValues(ld.Multi_Select__c)
            }));
            this.error = undefined;
        } else if (error) {
            this.error = error;
            this.leads = [];
        }
    }

    // Helper function to split the multi-picklist values into an array
    getMultiPicklistValues(multiPicklistString) {
        if (multiPicklistString) {
            return multiPicklistString.split(';'); // Split the multi-picklist values by semicolon
        }
        return [];
    }
}
