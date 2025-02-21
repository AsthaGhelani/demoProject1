public with sharing class Fetchfiles {


        // Fetch legacy attachments related to a record (e.g., Account, Case)
        @AuraEnabled(cacheable=true)
        public static List<Attachment> getAttachmentsForRecord(Id recordId) {
            return [SELECT Id, Body, Name, ContentType FROM Attachment WHERE ParentId = :recordId];
        }
    
        // Fetch files related to the record (ContentDocument)
        @AuraEnabled(cacheable=true)
        public static List<ContentDocumentLink> getFilesForRecord(Id recordId) {
            return [SELECT ContentDocumentId FROM ContentDocumentLink WHERE LinkedEntityId = :recordId];
        }
    
        // Fetch the URL for a file (ContentDocument) to display in the component
        @AuraEnabled
        public static String getFileUrl(Id contentDocumentId) {
            ContentVersion contentVersion = [SELECT Id, VersionData FROM ContentVersion WHERE ContentDocumentId = :contentDocumentId ORDER BY CreatedDate DESC LIMIT 1];
            // The URL to download the file
            return '/sfc/servlet.shepherd/version/download/' + contentVersion.Id;
        }

    


            // Static method marked with @AuraEnabled for LWC to call
            @AuraEnabled(cacheable=true)
            public static String getProfileImage(Id studentId) {
                String imageUrl ='';
                try {
                    // Construct the file name using the provided student ID
                    // String fileName = 'student_profile_' + studentId + '.jpeg';
                    

                    String fileName='nature.jpeg';
                     // Query the Attachment object for the profile image by ParentId and file name
            List<Attachment> attachments = [
                SELECT Body, ContentType, Name
                FROM Attachment
                WHERE ParentId = :studentId
                AND Name = :fileName
                LIMIT 1
            ];
            
            // If an attachment is found, convert it to a base64 string for use as an image URL
            if (!attachments.isEmpty()) {
                Attachment profileImage = attachments[0];
                imageUrl = 'data:' + profileImage.ContentType + ';base64,' + EncodingUtil.base64Encode(profileImage.Body);
            } else {
                System.debug('No profile image found for the student with ID: ' + studentId);
            }
        } catch (Exception e) {
            // Log any error that occurs during the query
            System.debug('Error fetching profile image: ' + e.getMessage());
        }
        
        // Return the base64-encoded image URL
        return imageUrl;
    }


}
    