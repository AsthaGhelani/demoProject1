public without sharing class ProfileInfo {



    // @AuraEnabled
    // public static void updateStudent(Id studentId, String name, String email, String imageUrl) {
    //     Student__c student = [SELECT Id, Name__c, Email__c, Image__c FROM Student__c WHERE Id = :studentId LIMIT 1];

    //     student.Name__c = name;
    //     student.Email__c = email;

    //     if (imageUrl != null && imageUrl != '') {
    //         student.Image__c = imageUrl; 
    //     }

    //     try {
    //         update student;
    //     } catch (Exception e) {
    //         throw new AuraHandledException('Error updating student record: ' + e.getMessage());
    //     }
    // }


        @AuraEnabled
        public static String uploadFile(Id recordId, String documentId) {
            try {
                Student__c studentRecord = [SELECT Id, Image__c FROM Student__c WHERE Id = :recordId LIMIT 1];
    
                // Generate the URL to download the file (i.e., the image URL)
                ContentDocument doc = [SELECT Id, Title, FileType FROM ContentDocument WHERE Id = :documentId LIMIT 1];
    
                  // Get the Salesforce base URL dynamically
                String baseUrl = URL.getOrgDomainUrl().toExternalForm();

                // Construct the full image URL
                String fileUrl = baseUrl + '/sfc/servlet.shepherd/document/download/' + doc.Id;
    
                // Store the image URL in the Rich Text Area field
                // studentRecord.Image__c = '<img src="' + fileUrl + '" alt="Uploaded Image" />';
                studentRecord.Image__c = fileUrl;
    
                // Update the student record
                update studentRecord;
    
                return fileUrl; // Return the URL for LWC to display the image
            } catch (Exception e) {
                throw new AuraHandledException('Error uploading image: ' + e.getMessage());
            }
        }

        @AuraEnabled(cacheable=true)
    public static String getImageUrl(Id recordId) {
        // try {
            Student__c studentRecord = [SELECT Id, Image__c FROM Student__c WHERE Id = :recordId LIMIT 1];
            return studentRecord.Image__c;
        // } catch (Exception e) {
        //     throw new AuraHandledException('Error fetching image URL: ' + e.getMessage());
        // }
    }

    
    
    //     @AuraEnabled(cacheable=true)
    // public static String getImageUrl(Id recordId) {
    //     try {
    //         // Query ContentDocument associated with the Student__c record
    //         ContentDocumentLink docLink = [SELECT ContentDocumentId FROM ContentDocumentLink 
    //                                        WHERE LinkedEntityId = :recordId 
    //                                        AND ShareType = 'V' 
    //                                        LIMIT 1];

    //         if (docLink != null) {
    //             // Get the ContentDocumentId and construct the download URL
    //             ContentDocument doc = [SELECT Id FROM ContentDocument WHERE Id = :docLink.ContentDocumentId LIMIT 1];
    //             if (doc != null) {
    //                 // Construct the URL for downloading the document (image)
    //                 String fileUrl = '/sfc/servlet.shepherd/document/download/' + doc.Id;
    //                 return fileUrl;
    //             }
    //         }

    //         return null; // No image found for the record
    //     } catch (Exception e) {
    //         System.debug('Error retrieving image: ' + e.getMessage());
    //         return null; // Return null in case of error
    //     }
    // }

    @AuraEnabled(cacheable=true)
    public static String getProfileImage(Id userId) {
        try {
            // Query the Attachment for the profile image based on the user's ID
            String fileName = 'student_profile_' + userId + '.jpeg'; // Assuming the file name follows this pattern
            Attachment profileImage = [SELECT Body, ContentType FROM Attachment WHERE ParentId = :userId  LIMIT 1];
            
            if (profileImage != null) {
                // Convert the image Body (binary data) to Base64
                String base64Image = EncodingUtil.base64Encode(profileImage.Body);
                return 'data:' + profileImage.ContentType + ';base64,' + base64Image;
            }
            return null; // Return null if no image is found
        } catch (Exception e) {
            System.debug('Error retrieving profile image: ' + e.getMessage());
            return null; // Return null in case of error
        }
    }


    
    
    
    @AuraEnabled
    public static String getFlow(String flowName, String recordId) {
        try {
            // Create a map of flow input variables
            Map<String, Object> flowInputs = new Map<String, Object>{
                'recordId' => recordId
            };

            // Invoke the flow by passing the flow name and input parameters
            Flow.Interview flowInterview = Flow.Interview.createInterview(flowName, flowInputs);

            // Start the flow
            flowInterview.start();

            // Retrieve the output variables from the flow (e.g., image URL)
            String imageUrl = (String)flowInterview.getVariableValue('imageUrl');

            // Return the image URL to the LWC or any other calling component
            return imageUrl;

        } catch (Exception e) {
            // Handle exceptions (e.g., flow errors)
            throw new AuraHandledException('Error invoking Flow: ' + e.getMessage());
        }
    }
    
    




    @AuraEnabled(cacheable=true)
    public static String getRecordPageUrl(Id recordId) {
        try {
            // Get the Salesforce domain URL dynamically
            String baseUrl ='https://kriittechnologies44-dev-ed.develop.lightning.force.com/';
            
            // Construct the record URL for Salesforce Lightning
            // Format: /lightning/r/Custom_Object_Name/Record_ID/view
            String recordUrl = baseUrl + '/lightning/r/Student__c/' + recordId + '/view?0.source=alohaHeader';
            System.debug('recordUrl: ' + recordUrl);
            return recordUrl;  // Return the full record URL
        } catch (Exception e) {
            throw new AuraHandledException('Error generating record URL: ' + e.getMessage());
        }
    }



    //  ==================================================================================================


        @AuraEnabled
        public static String associateFileWithRecord(String contentDocumentId, String recordId) {
            try {
                System.debug('ContentDocumentId: ' + contentDocumentId);  // Debugging log
                System.debug('RecordId: ' + recordId);  // Debugging log
    
                // Validate that the record ID and contentDocumentId are valid
                if (String.isEmpty(contentDocumentId) || String.isEmpty(recordId)) {
                    throw new AuraHandledException('ContentDocumentId or RecordId is empty.');
                }
    
                // Check if the ContentDocumentLink already exists
                List<ContentDocumentLink> existingLinks = [ 
                    SELECT Id 
                    FROM ContentDocumentLink 
                    WHERE ContentDocumentId = :contentDocumentId 
                    AND LinkedEntityId = :recordId 
                    LIMIT 1 
                ];
    
                // If a link already exists, skip the insert
                if (!existingLinks.isEmpty()) {
                    return getPublicFileUrl(contentDocumentId);
                }
    
                // Associate the ContentDocument with the given record (e.g., Account)
                ContentDocumentLink docLink = new ContentDocumentLink(
                    ContentDocumentId = contentDocumentId,
                    LinkedEntityId = recordId,  // This associates the file with the specific record
                    ShareType = 'V'  // Viewer share type (public access)
                );
                insert docLink;
    
                // Generate and return the public URL using ContentDistribution
                return generatePublicLink(contentDocumentId);
    
            } catch (Exception e) {
                System.debug('Error occurred: ' + e.getMessage()); // Log the error
                throw new AuraHandledException('Error generating public link: ' + e.getMessage());
            }
        }
    
        // Helper method to generate the public link via ContentDistribution
        private static String generatePublicLink(String contentDocumentId) {
            // Query the ContentVersion record associated with the ContentDocumentId
            ContentVersion contentVersion = [
                SELECT Id
                FROM ContentVersion
                WHERE ContentDocumentId = :contentDocumentId
                ORDER BY CreatedDate DESC
                LIMIT 1
            ];
    
            // Create ContentDistribution for public URL
            ContentDistribution cd = new ContentDistribution(
                Name = 'Public Link for File',
                ContentVersionId = contentVersion.Id,
                PreferencesAllowOriginalDownload = true,
                PreferencesAllowViewInBrowser = true
            );
            insert cd;
    
            // Return the public URL
            return cd.DistributionPublicUrl;
        }
    
    
            // Method to generate the public file URL from ContentVersion
            public static String getPublicFileUrl(String contentDocumentId) {
                // Query ContentVersion based on ContentDocumentId
                ContentVersion contentVersion = [
                    SELECT Id, ContentDocumentId, ContentUrl 
                    FROM ContentVersion 
                    WHERE ContentDocumentId = :contentDocumentId 
                    ORDER BY CreatedDate DESC 
                    LIMIT 1
                ];

                // Return the correct URL using ContentVersion Id
                if (contentVersion != null) {
                    return '/sfc/servlet.shepherd/version/download/' + contentVersion.Id;
                }

                return null; // Return null if no ContentVersion found
            }

            // You can add other methods related to file handling here      





    

        // Method to retrieve the stored image URL from the Student record
        // @AuraEnabled(cacheable=true)
        // public static String getImageUrl(Id studentId) {
        //     // Query the Student record for the Image URL field
        //     Student__c student = [SELECT Image__c FROM Student__c WHERE Id = :studentId LIMIT 1];
        //     return student.Image__c; // Return the URL stored in the Image__c field
        // }
    
        // // Method to save the image URL to the Student record's Image__c field
        // @AuraEnabled
        // public static String saveImageUrl(Id studentId, Id documentId) {
        //     // Query the ContentVersion to get the actual file URL
        //     ContentVersion contentVersion = [SELECT Id, VersionData, ContentDocumentId 
        //                                      FROM ContentVersion 
        //                                      WHERE ContentDocumentId = :documentId 
        //                                      ORDER BY CreatedDate DESC LIMIT 1];
    
        //     // Create the URL for the image to be saved in Image__c field
        //     String imageUrl = '/sfc/servlet.shepherd/version/download/' + contentVersion.Id;
    
        //     // Update the Student record with the new Image URL
        //     Student__c student = [SELECT Id FROM Student__c WHERE Id = :studentId LIMIT 1];
        //     student.Image__c = imageUrl;
        //     update student;
    
        //     // Return the image URL for immediate display
        //     return imageUrl;
        // }
    
    


    
          
        
    
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
    
    
    