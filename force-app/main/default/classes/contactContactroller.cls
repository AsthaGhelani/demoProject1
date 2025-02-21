public class contactContactroller {
        @AuraEnabled(cacheable=true)
        public static Contact getContactDetails(Id recordId) {
            try {
                return [SELECT Id,FirstName, LastName, PhotoUrl, Description FROM Contact ];

            } catch (Exception e) {
                throw new AuraHandledException(e.getMessage());

            }
        }
}
    
