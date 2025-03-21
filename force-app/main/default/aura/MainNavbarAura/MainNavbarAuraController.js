({
    handleHamburgerClicked: function(component, event, helper) {
        var showMenu = component.get("v.showMenu");
        component.set("v.showMenu", !showMenu); // Toggle menu visibility
    }
})
