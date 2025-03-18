// import { LightningElement } from 'lwc';

// export default class EmbeddedServiceBot extends LightningElement {

//         connectedCallback() {
//             // Call to initialize the embedded service when the component is added to the page
//             this.initializeEmbeddedService();
//         }
    
//         initializeEmbeddedService() {
//             const initESW = (gslbBaseURL) => {
//                 // Configure the embedded service settings
//                 embedded_svc.settings.displayHelpButton = true; // Show Help button (can be set to false)
//                 embedded_svc.settings.language = 'en-US'; // Language setting, you can modify as needed (for example, 'en-US')
    
//                 // Set the features you want to enable in the embedded service (e.g., Live Agent)
//                 embedded_svc.settings.enabledFeatures = ['LiveAgent'];
//                 embedded_svc.settings.entryFeature = 'LiveAgent';
    
//                 // Initialize the Embedded Service with all the required details
//                 embedded_svc.init(
//                     'https://kriittechnologies44-dev-ed.develop.my.site.com', // Replace with your Salesforce Community URL
//                     'https://kriittechnologies44-dev-ed.develop.my.site.com/studentEnrollmentProcess', // Your actual Salesforce Community page URL
//                     gslbBaseURL, // You can keep this null or specify it for specific routing
//                     '00DdL00000JDyBm', // Replace with your Salesforce Organization ID
//                     'Enrollment_Help', // Bot Deployment Name (replace with your Bot's name)
//                     {
//                         baseLiveAgentContentURL: 'https://c.la11-core1.sfdc-y37hzm.salesforceliveagent.com/content', // Live Agent content URL
//                         deploymentId: '572dL00000C3GED', // Replace with your Deployment ID
//                         buttonId: '573dL0000035QHt', // Replace with your Button ID
//                         baseLiveAgentURL: 'https://d.la11-core1.sfdc-y37hzm.salesforceliveagent.com/chat', // Live Agent URL
//                         eswLiveAgentDevName: 'Enrollment_Help', // Development name of your bot
//                         isOfflineSupportEnabled: false // Set this to true if you want to support offline (leave false if not)
//                     }
//                 );
//             };
    
//             // Ensure embedded_svc is loaded, if not, load it
//             if (!window.embedded_svc) {
//                 const script = document.createElement('script');
//                 script.src = 'https://service.force.com/embeddedservice/5.0/esw.min.js';
//                 script.onload = () => initESW(null);
//                 document.body.appendChild(script);
//             } else {
//                 initESW('https://service.force.com'); // Initialize directly if the script is already loaded
//             }
//         }
//     }
    

// einsteinBotEmbed.js (LWC JavaScript)
import { LightningElement } from 'lwc';

export default class EinsteinBotEmbed extends LightningElement {


     // Set the URL of the Visualforce page
     vfPageUrl = '/apex/Embedded_Chat_Bot';

}
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

