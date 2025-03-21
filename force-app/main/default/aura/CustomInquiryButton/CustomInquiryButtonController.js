({
    doInit: function(component, event, helper) {
        component.set("v.isVisible", false); // Initially not visible
    },
    
    show: function(component, event, helper) {
        component.set("v.isVisible", true); // Show the modal when triggered
    },
    
    confirmAction: function(component, event, helper) {
        component.set("v.isVisible", false); // Hide modal
        var onConfirm = component.get("v.onconfirm");
        if (onConfirm) {
            onConfirm(); // Execute logout logic
        }
    },

    cancelAction: function(component, event, helper) {
        component.set("v.isVisible", false); // Hide modal
        var onCancel = component.get("v.oncancel");
        if (onCancel) {
            onCancel(); // Handle cancel
        }
    }
})
