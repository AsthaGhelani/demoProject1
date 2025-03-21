import { LightningElement } from 'lwc';

export default class EmbeddedServiceChat extends LightningElement {
    connectedCallback() {
        // Check if the Embedded Service (esw.min.js) is loaded
        if (!window.embedded_svc) {
            // Dynamically load the Embedded Service script if it's not already loaded
            this.loadScriptWithFetch();
        } else {
            // If the script is already loaded, initialize the service
            this.initializeEmbeddedService();
        }
    }

    // Function to load the script using fetch with 'no-cors' mode
    loadScriptWithFetch() {
        fetch('https://service.force.com/embeddedservice/5.0/esw.min.js', {
            method: 'GET', 
            mode: 'no-cors' // Bypass CORS policy
        })
        .then(response => {
            if (response.ok) {
                // If fetch is successful, inject the script into the DOM
                this.injectScript();
            } else {
                throw new Error('Failed to load script');
            }
        })
        .catch(error => {
            console.error('Error loading script:', error);
        });
    }

    // Function to inject the script into the DOM
    injectScript() {
        const script = document.createElement('script');
        script.src = 'https://service.force.com/embeddedservice/5.0/esw.min.js';
        script.onload = () => this.initializeEmbeddedService();
        document.body.appendChild(script);
    }

    initializeEmbeddedService() {
     console.log('Initializing Embedded Service...');
     const initESW = (gslbBaseURL) => {
         console.log('Embedded Service Initialized');
         embedded_svc.settings.displayHelpButton = true;
         embedded_svc.settings.language = 'en';
 
         // More debugging logs here
         console.log('Service settings:', embedded_svc.settings);
 
         // Enable LiveAgent feature for the embedded service
         embedded_svc.settings.enabledFeatures = ['LiveAgent'];
         embedded_svc.settings.entryFeature = 'LiveAgent'; 
 
         embedded_svc.init(
             'https://kriittechnologies44-dev-ed.develop.my.salesforce.com',
             'https://kriittechnologies44-dev-ed.develop.my.site.com/sep',
             gslbBaseURL,
             '00DdL00000JDyBm', 
             'Enrollment_Help', 
             {
                 baseLiveAgentContentURL: 'https://c.la11-core1.sfdc-y37hzm.salesforceliveagent.com/content',
                 deploymentId: '572dL00000C3GED', 
                 buttonId: '573dL0000035QHt',
                 baseLiveAgentURL: 'https://d.la11-core1.sfdc-y37hzm.salesforceliveagent.com/chat',
                 eswLiveAgentDevName: 'Enrollment_Help',
                 isOfflineSupportEnabled: false 
             }
         );
     };
 
     // Logging for script loading
     if (!window.embedded_svc) {
         console.log('Loading Embedded Service script...');
         const script = document.createElement('script');
         script.src = 'https://kriittechnologies44-dev-ed.develop.my.salesforce.com/embeddedservice/5.0/esw.min.js';
         script.onload = () => {
             console.log('Embedded Service script loaded successfully');
             initESW(null);
         };
         script.onerror = (error) => {
             console.error('Error loading the Embedded Service script:', error);
         };
         document.body.appendChild(script);
     } else {
         initESW('https://service.force.com');
     }
 }
 
}


    

// einsteinBotEmbed.js (LWC JavaScript)
// import { LightningElement } from 'lwc';

// export default class EinsteinBotEmbed extends LightningElement {


//      // Set the URL of the Visualforce page
//      vfPageUrl = '/apex/EmbeddedBotForSEP';

// }
//     connectedCallback() {



//         if (!window.embedded_svc) {
//             const script = document.createElement('script');
//             script.src = 'https://kriittechnologies44-dev-ed.develop.my.site.com/embeddedservice/5.0/esw.min.js';
//             script.onload = () => this.initESW();
//             document.body.appendChild(script);
//         } else {
//             this.initESW('https://service.force.com');
//         }
//     }

//     initESW(gslbBaseURL) {
//         embedded_svc.settings.displayHelpButton = true;
//         embedded_svc.settings.language = '';  // Set language if required

//         embedded_svc.settings.enabledFeatures = ['LiveAgent', 'EinsteinBot'];
//         embedded_svc.settings.entryFeature = 'EinsteinBot'; // Ensure the bot appears

//         embedded_svc.init(
//             'https://kriittechnologies44-dev-ed.develop.my.site.com',
//             'https://kriittechnologies44-dev-ed.develop.my.site.com/studentEnrollmentProcess',
//             gslbBaseURL,
//             '00DdL00000JDyBm', // Deployment ID
//             'Enrollment_Bot',  // Your Einstein Bot Deployment Name
//             {
//                 baseLiveAgentContentURL: 'https://c.la11-core1.sfdc-y37hzm.salesforceliveagent.com/content',
//                 deploymentId: '572dL00000C3GED',
//                 buttonId: '573dL0000035QHt',
//                 baseLiveAgentURL: 'https://d.la11-core1.sfdc-y37hzm.salesforceliveagent.com/chat',
//                 eswLiveAgentDevName: 'Enrollment_Bot',
//                 isOfflineSupportEnabled: false
//             }
//         );
//     }
// }

