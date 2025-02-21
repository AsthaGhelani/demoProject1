

 // ========================latest code for student inquiry==================================================



 public without sharing class UpdateStudentInquiry {

    // Fetch inquiry data based on the provided recordId
    @AuraEnabled(cacheable=true)
    public static Student_Inquiry_Lead__c getInquiryData(Id leadId) {
        try {
            return [SELECT Id, First_Name__c, Middle_Name__c, Last_Name__c, Email__c, Phone__c
            , Gender__c, Street__c, City__c, Country__c, State__c, 
                           X10th_Pass_Year__c, X10th_Percentage__c, X12th_Pass_Year__c, X12th_Percentage__c
                    FROM Student_Inquiry_Lead__c WHERE Id = :leadId LIMIT 1];
        } catch (Exception e) {
            throw new AuraHandledException('Error fetching inquiry data: ' + e.getMessage());
        }
    }

    @AuraEnabled
    public static String updateStudentInquiryLead(Id leadId, Map<String, Object> fieldValues) {
        try {
            system.debug('======leadId=====' + leadId);
            system.debug('======fieldValues=====' + fieldValues);
                                
            Student_Inquiry_Lead__c lead = [SELECT Id, Email__c, First_Name__c, Last_Name__c FROM Student_Inquiry_Lead__c WHERE Id = :leadId LIMIT 1];

            if (lead == null) {
                throw new CustomException('The requested Lead does not exist.');
            }

            // Update the lead record with the new field values
            for (String field : fieldValues.keySet()) {
                lead.put(field, fieldValues.get(field));
            }

            update lead;

            // Send the email notification
            sendEmailNotification(lead);

            system.debug('Lead after update: ' + lead);
            
            return 'Student Inquiry Lead updated successfully!';
        } catch (QueryException e) {
            return 'Error: Lead not found.';
        } catch (CustomException e) {
            return 'Error: ' + e.getMessage();
        } catch (Exception e) {
            return 'Error: ' + e.getMessage();
        }
    }

    public static void sendEmailNotification(Student_Inquiry_Lead__c lead) {
        try {

            OrgWideEmailAddress owea = [SELECT Id, Address, DisplayName FROM OrgWideEmailAddress where Address = 'asthaghelani8@gmail.com'];


            List<Messaging.SingleEmailMessage> allMails = new List<Messaging.SingleEmailMessage>();

            for(Student_Inquiry_Lead__c ld : [SELECT Id, Email__c FROM Student_Inquiry_Lead__c WHERE Id = :lead.Id LIMIT 1]) {
                Messaging.SingleEmailMessage mail = new Messaging.SingleEmailMessage();
                // mail.setTargetObjectId(ld.Id);
                //mail.setOrgWideEmailAddressId(owa.id);
                System.debug('65 email==>'+ld.Email__c);
                mail.setToAddresses(new String[] { ld.Email__c });

                if ( owea != null) {
                    mail.setOrgWideEmailAddressId(owea.Id);
                    }


                mail.setSubject('Student Inquiry Lead Updated');
                mail.setPlainTextBody('Dear ' + lead.First_Name__c + ' ' + lead.Last_Name__c + ',\n\n' +
                                    'Your inquiry details have been successfully updated. If you have any questions, feel free to reach out.\n\n' +
                                    'Best regards,\nYour Company Name');
                allMails.add(mail);
               
            }
            system.debug('=====allMails===='+allMails);
            // Messaging.sendEmail(allMails);

            Messaging.SendEmailResult[] results = Messaging.sendEmail(allMails);

            for (Messaging.SendEmailResult res : results) {
                if (res.isSuccess()) {
                    System.debug('Email sent successfully');
                }
                else {
                    System.debug('The following errors occurred: ' + res.getErrors());                 
                }
            }
            System.debug('Email sent successfully to ' + lead.Email__c);
        } catch (Exception e) {
            System.debug('Error sending email: ' + e.getMessage());
        }
    }

    // public static void sendEmailNotification(Student_Inquiry_Lead__c lead) {
    //     try {

    //         OrgWideEmailAddress owea = [SELECT Id, Address, DisplayName FROM OrgWideEmailAddress where Address = 'asthaghelani8@gmail.com'];


    //         // List<Messaging.SingleEmailMessage> allMails = new List<Messaging.SingleEmailMessage>();

    //             Messaging.SingleEmailMessage mail = new Messaging.SingleEmailMessage();
    //             // mail.setTargetObjectId(ld.Id);
    //             //mail.setOrgWideEmailAddressId(owa.id);
    //             System.debug('65 email==>'+lead.Email__c);
    //             mail.setToAddresses(new String[] { lead.Email__c });

    //             if ( owea != null) {
    //                 mail.setOrgWideEmailAddressId(owea.Id);
    //                 }


    //             mail.setSubject('Student Inquiry Lead Updated');
    //             mail.setPlainTextBody('Dear ' + lead.First_Name__c + ' ' + lead.Last_Name__c + ',\n\n' +
    //                                 'Your inquiry details have been successfully updated. If you have any questions, feel free to reach out.\n\n' +
    //                                 'Best regards,\nYour Company Name');

    //             // allMails.add(mail);

    //         // Send the email
    //         Messaging.SendEmailResult[] results = Messaging.sendEmail(new Messaging.SingleEmailMessage[] { mail });
    //         for (Messaging.SendEmailResult res : results) {
    //             if (res.isSuccess()) {
    //                 System.debug('Email sent successfully');
    //             }
    //             else {
    //                 System.debug('The following errors occurred: ' + res.getErrors());                 
    //             }
    //         }
    //         System.debug('Email sent successfully to ' + lead.Email__c);
    //     }
            
    //         // system.debug('=====allMails===='+allMails);
    //         // Messaging.sendEmail(allMails);

    //         catch (Exception e) {
    //         System.debug('Error sending email: ' + e.getMessage());
    //     }
    // }

    // Custom Exception to  specific cases
    public class CustomException extends Exception {}




}











// public without sharing class UpdateStudentInquiry {
    
//     // Method to update the Lead record dynamically
//     @AuraEnabled
//     public static String updateStudentInquiryLead(String leadId, Map<String, Object> fieldValues) {
//         // Fetch the lead record by its ID
//         Student_Inquiry_Lead__c leadRecord = [SELECT Id FROM Student_Inquiry_Lead__c WHERE Id = :leadId LIMIT 1];

//         // Loop through the field values and dynamically set the field values
//         for (String field : fieldValues.keySet()) {
//             // Dynamically assign the value to the field using sObject's put method
//             leadRecord.put(field, fieldValues.get(field));
//         }

//         // Update the lead record
//         try {
//             update leadRecord;
//             return 'Lead updated successfully.';
//         } catch (DmlException e) {
//             throw new AuraHandledException('Error updating lead: ' + e.getMessage());
//         }
//     }

//     // Method to fetch Lead data based on LeadId (Optional: Used to load data into the form)
//     @AuraEnabled(cacheable=true)
//     public static Student_Inquiry_Lead__c getInquiryData(String leadId) {
//         return [SELECT Id, First_Name__c, Middle_Name__c, Last_Name__c, Email__c, Phone__c, DOB__c, Gender__c,
//                 Street__c, City__c, Country__c, State__c, X10th_Pass_Year__c, X10th_Percentage__c, X12th_Pass_Year__c, X12th_Percentage__c 
//                 FROM Student_Inquiry_Lead__c WHERE Id = :leadId LIMIT 1];
//     }
// }




// public without sharing class UpdateStudentInquiry {
    
//     @AuraEnabled(cacheable=true)
//     public static Student_Inquiry_Lead__c getInquiryData(Id leadId) {
//         // Fetch Lead data for the provided leadId
//         return [SELECT Id, First_Name__c, Middle_Name__c, Last_Name__c, Email__c, Phone__c, DOB__c, Gender__c,
//                         Street__c, City__c, Country__c, State__c, X10th_Pass_Year__c, X10th_Percentage__c, X12th_Pass_Year__c, X12th_Percentage__c 
//                         FROM Student_Inquiry_Lead__c WHERE Id = :leadId LIMIT 1];
//     }
    
//     @AuraEnabled
//     public static void updateInquiryData(Id leadId, String firstName, String middleName, String lastName,
//                                           String email, String phone, Date dob, String gender, String street, 
//                                           String city, String country, String state, Integer xpy, 
//                                           Double xper, Integer xipy, Double xiper) 
//         {
//             Student_Inquiry_Lead__c leadToUpdate = [SELECT Id, First_Name__c, Middle_Name__c, Last_Name__c, Email__c, Phone__c,
//                              DOB__c, Gender__c, Street__c, City__c, Country__c, State__c, X10th_Pass_Year__c,
//                              X10th_Percentage__c, X12th_Pass_Year__c, X12th_Percentage__c 
//                              FROM Student_Inquiry_Lead__c WHERE Id = :leadId LIMIT 1];
        
//         // Set the new values
//         leadToUpdate.First_Name__c = firstName;
//         leadToUpdate.Middle_Name__c = middleName;
//         leadToUpdate.Last_Name__c = lastName;
//         leadToUpdate.Email__c = email;
//         leadToUpdate.Phone__c = phone;
//         leadToUpdate.DOB__c = dob;
//         leadToUpdate.Gender__c = gender;
//         leadToUpdate.Street__c = street;
//         leadToUpdate.City__c = city;
//         leadToUpdate.Country__c = country;
//         leadToUpdate.State__c = state;
//         leadToUpdate.X10th_Pass_Year__c = xpy;
//         leadToUpdate.X10th_Percentage__c = xper;
//         leadToUpdate.X12th_Pass_Year__c = xipy;
//         leadToUpdate.X12th_Percentage__c = xiper;
        
//         // Update the Lead record
//         update leadToUpdate;
//     }
// }







 // ===========================================================================================



    



    // public static String updateInquiryData(Id leadId, Student_Inquiry_Lead__c updatedInquiry) {
    //     try {
    //         Student_Inquiry_Lead__c lead = [SELECT Id FROM Student_Inquiry_Lead__c WHERE Id = :leadId LIMIT 1];
    //         if (lead != null) {
    //             // Update fields with new values
    //             lead.First_Name__c = updatedInquiry.First_Name__c;
    //             lead.Middle_Name__c = updatedInquiry.Middle_Name__c;
    //             lead.Last_Name__c = updatedInquiry.Last_Name__c;
    //             lead.Email__c = updatedInquiry.Email__c;
    //             lead.Phone__c = updatedInquiry.Phone__c;
    //             lead.DOB__c = updatedInquiry.DOB__c;
    //             lead.Gender__c = updatedInquiry.Gender__c;
    //             lead.Street__c = updatedInquiry.Street__c;
    //             lead.City__c = updatedInquiry.City__c;
    //             lead.Country__c = updatedInquiry.Country__c;
    //             lead.State__c = updatedInquiry.State__c;
    //             lead.X10th_Pass_Year__c = updatedInquiry.X10th_Pass_Year__c;
    //             lead.X10th_Percentage__c = updatedInquiry.X10th_Percentage__c;
    //             lead.X12th_Pass_Year__c = updatedInquiry.X12th_Pass_Year__c;
    //             lead.X12th_Percentage__c = updatedInquiry.X12th_Percentage__c;

    //             // Update record in database
    //             update lead;
    //             return 'Inquiry Updated Successfully';
    //         } else {
    //             return 'Inquiry not found';
    //         }
    //     } catch (Exception e) {
    //         return 'Error: ' + e.getMessage();
    //     }
    // }






