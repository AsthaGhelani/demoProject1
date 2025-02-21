public with sharing class SendEmailForAccount {
    public SendEmailForAccount() {

    }
        @AuraEnabled
        public static void saveAccount(String accountName, String emailAddress) {
            try {
                Account newAccount = new Account(Name = accountName);
                insert newAccount;
    
                List<Contact> relatedContacts = [SELECT FirstName, LastName, Phone, Email 
                                                  FROM Contact 
                                                //   WHERE AccountId = :newAccount.Id 
                                                  ORDER BY CreatedDate DESC LIMIT 5];
    
                if (!relatedContacts.isEmpty()) {
                    sendEmail(newAccount, relatedContacts, emailAddress);
                }
            } catch (Exception e) {
                throw new AuraHandledException('Error creating account: ' + e.getMessage());
            }
        }
    
        private static void sendEmail(Account account, List<Contact> contacts, String toAddress) {

            String emailBody = 'New Account created: ' + account.Name + '<br><br>';
            emailBody += 'Recent 5 Contacts:<br>';
            emailBody += '<table border="1"><tr><th>First Name</th><th>Last Name</th><th>Phone</th><th>Email</th></tr>';
    
            for (Contact c : contacts) {
                emailBody += '<tr><td>' + c.FirstName + '</td><td>' + c.LastName + '</td><td>' + c.Phone + '</td><td>' + c.Email + '</td></tr>';
            }
    
            emailBody += '</table>';
    
            Messaging.SingleEmailMessage mail = new Messaging.SingleEmailMessage();
            mail.setToAddresses(new String[] { toAddress });
            mail.setSubject('New Account Created with Recent Contacts');
            mail.setHtmlBody(emailBody);
            Messaging.sendEmail(new Messaging.SingleEmailMessage[] { mail });
        }
}
    
