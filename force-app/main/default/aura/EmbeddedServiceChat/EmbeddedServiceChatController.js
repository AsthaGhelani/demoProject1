// ({
//     myAction : function(component, event, helper) {

//     }
// })




({
    initChat: function (component, event, helper) {
        var initESW = function(gslbBaseURL) {
            embedded_svc.settings.displayHelpButton = true; // Or false
            embedded_svc.settings.language = ''; // Enter language like 'en' or 'en-US'
            embedded_svc.settings.enabledFeatures = ['LiveAgent'];
            embedded_svc.settings.entryFeature = 'LiveAgent';

            embedded_svc.init(
                'https://kriittechnologies44-dev-ed.develop.my.salesforce.com', // Salesforce domain
                'https://kriittechnologies44-dev-ed.develop.my.site.com/', // Site domain
                gslbBaseURL, // Global SSO URL
                '00DdL00000JDyBm', // Organization ID
                'Enrollment_Help', // Bot's Dev Name
                {
                    baseLiveAgentContentURL: 'https://c.la11-core1.sfdc-y37hzm.salesforceliveagent.com/content',
                    deploymentId: '572dL00000C3GED', // Deployment ID
                    buttonId: '573dL0000035QHt', // Button ID
                    baseLiveAgentURL: 'https://d.la11-core1.sfdc-y37hzm.salesforceliveagent.com/chat',
                    eswLiveAgentDevName: 'Enrollment_Help',
                    isOfflineSupportEnabled: false // No offline support enabled
                }
            );
        };

        // Load the Embedded Service Script if not already loaded
        if (!window.embedded_svc) {
            var s = document.createElement('script');
            s.setAttribute('src', 'https://service.force.com/embeddedservice/5.0/esw.min.js'); // Use CDN version
            s.onload = function() {
                initESW(null); // Initialize once script is loaded
            };
            document.body.appendChild(s);
        } else {
            initESW('https://service.force.com'); // Directly initialize if script is already loaded
        }
    }
})
