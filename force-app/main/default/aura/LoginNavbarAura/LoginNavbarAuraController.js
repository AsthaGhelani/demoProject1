({
    openModel: function(component, event, helper) {
        var customInquiryButton = component.find('customInquiryButton');
        customInquiryButton.show(); // Show confirmation modal
    },
    
    handleCancel: function(component, event, helper) {
        console.log('Action Canceled!');
    },
    
    handleLogout: function(component, event, helper) {
        // Remove login status from session or local storage
        sessionStorage.removeItem('isLoggedIn');
        
        // Redirect to Home page after logout
        window.location.href = "/";
        setTimeout(() => {
            location.reload(); // Reload after redirect
        }, 100);
    }
})
