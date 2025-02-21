public class EmailController {

    @AuraEnabled
    public static void createContactAndSendEmail(String contactName, String email, String phone, String description) {
        // Step 1: Create new Contact record
        Contact newContact = new Contact(
            FirstName = contactName, // Assuming contact name is first name, adjust as needed
            LastName = 'Not Provided', // Default last name, or use logic to handle this
            Email = email,
            Phone = phone,
            Description = description
        );
        try {
            insert newContact;
            System.debug('New Contact Created: ' + newContact.Id);
        } catch (DmlException e) {
            System.debug('Error creating Contact: ' + e.getMessage());
            throw new AuraHandledException('Failed to create new contact');
        }

        // Step 2: Query for the related Opportunity (assuming Contact name is related to Opportunity Account name)
        Opportunity opp = [SELECT Id, Name, (SELECT Product2.Name, Product2.Description, Product2.Family FROM OpportunityLineItems) 
                           FROM Opportunity WHERE Account.Name = :contactName LIMIT 1];

        // Check if Opportunity exists
        if (opp == null) {
            throw new AuraHandledException('No Opportunity found for the provided contact name.');
        }

        // Step 3: Prepare product details for the email
        String productDetails = 'Products related to the Opportunity:\n';
        for (OpportunityLineItem oli : opp.OpportunityLineItems) {
            productDetails += 'Product: ' + oli.Product2.Name + '\n';
            productDetails += 'Description: ' + oli.Product2.Description + '\n';
            productDetails += 'Category: ' + oli.Product2.Family + '\n';
            productDetails += '----------------------------\n';
        }

        if (String.isEmpty(productDetails)) {
            productDetails = 'No products associated with this opportunity.\n';
        }

        // Step 4: Construct email body
        String emailBody = 'Contact Name: ' + contactName + '\n';
        emailBody += 'Phone: ' + phone + '\n';
        emailBody += 'Description: ' + description + '\n\n';
        emailBody += productDetails;

        // Log the email body for debugging
        System.debug('Email Body: ' + emailBody);
        System.debug('Sending email to: ' + email);

        // Step 5: Send the email
        try {
            Messaging.SingleEmailMessage mail = new Messaging.SingleEmailMessage();
            mail.setToAddresses(new String[] { email });
            mail.setSubject('Opportunity Products Details');
            mail.setPlainTextBody(emailBody);
            Messaging.sendEmail(new Messaging.SingleEmailMessage[] { mail });
            System.debug('Email sent successfully to: ' + email);
        } catch (Exception e) {
            System.debug('Error sending email: ' + e.getMessage());
            throw new AuraHandledException('Error sending email');
        }
    }
}
