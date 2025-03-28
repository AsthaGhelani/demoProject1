public without sharing class ProfileSemester {
        @AuraEnabled(cacheable=true)
        public static Student__c studentProfile(String studentId){
            try {
    
                System.debug('Received Student ID: ' + studentId);
    
                // Trim spaces
                String trimmedStudentId = studentId != null ? studentId.trim() : '';
                System.debug('Trimmed Student ID: ' + trimmedStudentId);
        
                
                 List<Student__c> students=[SELECT Id, 
                 Name__c,
                 Last_Name__c,  
                 Middle_Name__c,
                 Phone_Number__c,
                 Email__c,
                 Gender__c
                FROM Student__c 
                WHERE Name=:trimmedStudentId LIMIT 1];
                
    
                // If no student found, log an error
                if (students.isEmpty()) {
                    System.debug('No student found for ID: ' + trimmedStudentId);
                    throw new AuraHandledException('No student found with this ID.');
                }
    
                System.debug('Student Found: ' + students[0]);
                return students[0];
                
            } catch (Exception e) {
                throw new AuraHandledException(e.getMessage());
            }
        }
    
    

    
        @AuraEnabled
        public static String uploadStudentImage(String studentId, String fileName, String base64Data) {
            try {
                ContentVersion contentVersion = new ContentVersion();
                contentVersion.Title = fileName;
                contentVersion.PathOnClient = fileName;
                contentVersion.VersionData = EncodingUtil.base64Decode(base64Data);
                insert contentVersion;
    
                // Link file to Student__c record
                ContentDocumentLink contentLink = new ContentDocumentLink();
                contentLink.ContentDocumentId = [SELECT ContentDocumentId FROM ContentVersion WHERE Id = :contentVersion.Id].ContentDocumentId;
                contentLink.LinkedEntityId = studentId;
                contentLink.ShareType = 'V'; // Viewer access
                insert contentLink;
    
                return 'File uploaded successfully';
            } catch (Exception e) {
                throw new AuraHandledException('Error uploading file: ' + e.getMessage());
            }
        }
    
        @AuraEnabled(cacheable=true)
    public static String getStudentAttachment(String studentId) {
        try {
            System.debug('Fetching Attachment for Student ID: ' + studentId);
    
            if (String.isEmpty(studentId)) {
                return 'Error: Student ID is missing!';
            }
    
            // Fetch latest image from Attachment
            List<Attachment> attachments = [
                SELECT Id, Name
                FROM Attachment
                WHERE ParentId = :studentId
                ORDER BY CreatedDate DESC
                LIMIT 1
            ];
    
            if (attachments.isEmpty()) {
                System.debug('No attachment found for student ID: ' + studentId);
                return ''; // Return empty string instead of throwing an error
            }
    
            String attachmentId = attachments[0].Id;
            String imageUrl = '/servlet/servlet.FileDownload?file=' + attachmentId;
            System.debug('✅ Returning Image URL: ' + imageUrl);
    
            return imageUrl;
    
        } catch (Exception e) {
            System.debug('❌ Error fetching student image: ' + e.getMessage());
            return 'Error: ' + e.getMessage();
        }
    }
    
    
    @AuraEnabled(cacheable=true)
    public static List<Semester__c> getSemestersForCourse(String studentId) {
        // Query the Student record to get the related Course
        Student__c studentRecord = [SELECT Id, Course__c FROM Student__c WHERE Name__c=:studentId LIMIT 1];
        System.debug('--=--=-=-=-=-=-=-= StudentId -=---=-=--'+studentId);
        // Get the Course ID from the Student record
        Id courseId = studentRecord.Course__c;
    
        // Query the related Semester records for the selected Course
        List<Semester__c> semesterList = [SELECT Name, Start_Date__c, End_Date__c 
                                          FROM Semester__c 
                                          WHERE Course__c = :courseId];
    
        return semesterList;
    }
    
        
        
    
         // Method to upload student image
       
    // ===================IF STORAGE IS FULL THEN USE BELOW 2 COMMAND IN DEVELOPER CONSOLE
    
    // -----------------------------1..DELETE THE FILES IN CONTENTDOCUMENT-----------------------------------------------------------
    //List<ContentDocument> todayDocuments = [SELECT Id FROM ContentDocument WHERE CreatedDate = TODAY];
    //delete todayDocuments;
    
    // -----------------------------2..DELETE THE FILES IN ATTACHMENT-----------------------------------------------------------
    // List<Attachment> todayAttachments = [SELECT Id FROM Attachment WHERE CreatedDate = TODAY];
    // delete todayAttachments;
    
    // -----------------------------3..DELETE THE FILES IN COntentVersion-----------------------------------------------------------
    // SELECT Id FROM ContentVersion WHERE CreatedDate = TODAY
    // SELECT Id, Title, ContentSize FROM ContentVersion ORDER BY ContentSize DESC LIMIT 10
    
        // @AuraEnabled
        // public static String uploadStudentImage(String studentId, String fileName, String base64Data) {
        //     try {
        //         System.debug('Starting image upload for Student ID: ' + studentId);
        //         System.debug('File Name: ' + fileName);
        //         System.debug('Base64 Data Length: ' + (base64Data != null ? base64Data.length() : 0));
    
        //         if (studentId == null) {
        //             System.debug('Error: Student ID is null or empty.');
        //             throw new AuraHandledException('Student ID is required.');
        //         }
    
        //         if (fileName == null) {
        //             System.debug('Error: File Name is null or empty.');
        //             throw new AuraHandledException('File Name is required.');
        //         }
    
        //         if (base64Data == null ) {
        //             System.debug('Error: Base64 Data is empty.');
        //             throw new AuraHandledException('Invalid file data.');
        //         }
    
        //         // Find the student record
        //         List<Student__c> students = [SELECT Id FROM Student__c WHERE Id = :studentId LIMIT 1];
        //         if (students.isEmpty()) {
        //             System.debug('Error: No Student record found.');
        //             throw new AuraHandledException('Student record not found.');
        //         }
        //         System.debug('Student record found: ' + students[0].Id);
    
        //         // Decode the base64 file data
        //         Blob fileBody = EncodingUtil.base64Decode(base64Data);
        //         System.debug('File successfully decoded.');
    
        //         // Create ContentVersion record
        //         ContentVersion cv = new ContentVersion();
        //         cv.Title = fileName;
        //         cv.PathOnClient = fileName;
        //         cv.VersionData = fileBody;
        //         cv.FirstPublishLocationId = students[0].Id; // Associate with the student record
        //         insert cv;
    
        //         System.debug('Image uploaded successfully: ' + fileName);
        //         return 'Image uploaded successfully.';
        //     } catch (Exception e) {
        //         System.debug('Error uploading image: ' + e.getMessage());
        //         throw new AuraHandledException('Error uploading image: ' + e.getMessage());
        //     }
        
        // }
    }
    
    
    