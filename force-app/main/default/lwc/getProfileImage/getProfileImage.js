import { LightningElement, api, wire } from 'lwc';
import getImageUrl from '@salesforce/apex/ProfileInfo.getImageUrl';  // Apex method to retrieve image URL
import getProfileImage from '@salesforce/apex/ProfileInfo.getProfileImage'; 
import getFlow from '@salesforce/apex/ProfileInfo.getFlow';

export default class ImageDisplay extends LightningElement {
    recordId ='a04dL000001h8szQAA';
    imageUrl; // Holds the image URL or the <img> tag

    // Use wire service to get the image URL
    @wire(getImageUrl, { recordId: '$recordId' })
    wiredImage({ error, data }) {
        if (data) {
            // Store the returned HTML content (which includes <img> tag)
            this.imageUrl = data;
        } else if (error) {
            this.imageUrl = null;
            console.error('Error retrieving image:', error);
        }
    }


    // Method to call the Flow and retrieve image URL
    handleFlowStart() {
        getFlow({ flowName: 'Fetch_Image_Flow', recordId: this.recordId })
            .then(result => {
                this.imageUrl = result; // Set the image URL returned by Apex
            })
            .catch(error => {
                console.error('Error retrieving flow result:', error);
            });
    }

    // You can call this method on the button click or page load
    connectedCallback() {
        this.handleFlowStart();  // Automatically starts the flow on component load
    }
}
