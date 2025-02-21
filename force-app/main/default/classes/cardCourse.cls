public without sharing class cardCourse {
    @AuraEnabled(cacheable=true)
    public static List<Course__c> getCourse(String cid) {
        try {
            List<Course__c> course = [
                SELECT Id, Course_Fees__c, Eligibility_Criteria__c, Credits__c, Course_Description__c, Name, Course_Year__c, Course_Code__c 
                FROM Course__c
                WHERE College__c = :cid
            ];
            return course;  
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled(cacheable=true)
    public static List<Course__c> getCourseList(String cid) {
        try {
            List<Course__c> cl = [
                SELECT Id, Course_Fees__c, Eligibility_Criteria__c, Credits__c, Course_Description__c, Name, Course_Year__c, Course_Code__c 
                FROM Course__c
                WHERE College__c = :cid
            ];
            return cl;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled
    public static String submitInquiry(
        Id courseId, 
        String firstName, 
        String middleName, 
        String lastName,  
        String gender, 
        Date dob,  
        String emailAddress, 
        String phno, 
        String prevEdu, 
        String stream
    ) {
        try {
            // Id courseId = 'a05dL00000DLkl7QAD';
            // Create a new Lead for student inquiry
            Student_Inquiry_Lead__c lead = new Student_Inquiry_Lead__c(
                First_Name__c = firstName,
                Middle_Name__c = middleName,
                Last_Name__c = lastName,
                Email__c = emailAddress,
                Phone__c = phno,
                DOB__c = dob,
                Gender__c = gender,
                Stream__c = stream,
                Previous_Education__c = prevEdu,
                Course__c =  courseId

            );
            insert lead;

            // Fetch Semester details for the given Course
            // List<Semester__c> semesters = [SELECT Id, Name, Start_Date__c, End_Date__c, Semester_Fees__c, 
            //                                Course__r.Name, Course__r.Prerequisites__c, Course__r.College__r.Name
            //                             //    ,(SELECT Id, Name FROM Subjects__r) 
            //                                FROM Semester__c 
            //                                WHERE Course__c = :courseOpId];

             List<Semester__c> semesters = [
            SELECT Id, Name, Start_Date__c, End_Date__c, Semester_Fees__c 
            FROM Semester__c 
            WHERE Course__c = :courseId
            ];

            System.debug('Semesters found: ' + semesters);


            System.debug('Semesters for Course ID ' + courseId + ': ' + semesters);
            
            // Send email with semester details
            sendEmailToStudent( semesters, firstName, middleName, lastName, phno, dob, gender, prevEdu, stream, emailAddress, courseId, lead.Id);

            return 'Inquiry Submitted Successfully';
        } catch (Exception e) {
            System.debug(e);
            return 'Error: ' + e.getMessage();
        }
    }

    public static void sendEmailToStudent(
        List<Semester__c> semList, 
        String firstName, 
        String middleName, 
        String lastName, 
        String phone, 
        Date dob, 
        String gender, 
        String prevEdu, 
        String stream, 
        String emailAddress,
        String courseId,
        Id leadId
    ) {
        try {
            // Debugging the semester list
            System.debug('Semester List: ' + semList);

            OrgWideEmailAddress owea = [SELECT Id, Address, DisplayName FROM OrgWideEmailAddress where Address = 'asthaghelani8@gmail.com'];
           

            Messaging.SingleEmailMessage email = new Messaging.SingleEmailMessage();


            if ( owea != null) {
                email.setOrgWideEmailAddressId(owea.Id);
                }

            // Send email on Inquiry to the student
            email.setToAddresses(new String[]{emailAddress}); 

            email.setSubject('Thanks ' + firstName + ' ' + lastName + ' for showing interest');
            String body = '' + 
                'Your details according to inquiry submission are as follows: <br>' + 
                'First Name: ' + firstName + '<br>' +
                'Last Name: ' + lastName + '<br>' + 
                'Middle Name: ' + middleName + '<br>' +
                'Phone: ' + phone + '<br>' + 
                'Email: ' + emailAddress + '<br>' + 
                'DOB: ' + dob + '<br>' + 
                'Gender: ' + gender + '<br>' + 
                'Previous Education: ' + prevEdu + '<br>' + 
                'Stream: ' + stream + '<br>';

            // Debugging the semester details
            body += 'Semester Details for the Course: <br>';
            if (!semList.isEmpty()) {
                Decimal courseTotalFees = 0;
                for(Semester__c sem : semList) {
                    body += 'Semester Name: ' + sem.Name + '<br>';
                    body += 'Semester Fees: ' + sem.Semester_Fees__c + '<br>';
                    body += 'Start Date: ' + sem.Start_Date__c + '<br>';
                    body += 'End Date: ' + sem.End_Date__c + '<br>';

                    // body += 'Subjects: <br>';
                    // if (!sem.Subjects__r.isEmpty()) {
                    //     for (Subject__c sub : sem.Subjects__r) {
                    //         body += '- ' + sub.Name + '<br>';
                    //     }
                    // } else {
                    //     body += 'No subjects available for this semester.<br>';
                    // }

                    courseTotalFees += sem.Semester_Fees__c;
                }
                body += '<br><b>Total Course Fees: ' + courseTotalFees + ' Rs.</b><br>';
            } else {
                body += 'No semester details available for this course.<br>';
            }


            // Construct the link to the detail page of the Student Inquiry Lead record
        // String leadDetailPageUrl = 'https://kriittechnologies44-dev-ed.develop.my.site.com/studentEnrollmentProcess/additional-detail-page?leadId=' + leadId + '/';
      
       String leadDetailPageUrl ='https://kriittechnologies44-dev-ed.develop.my.site.com/studentEnrollmentProcess/additional-detail-page?leadId='+leadId ;
      
        // Add the URL to the Student Inquiry Lead record in the email body
        body += '<br><br>For more details, you can view your inquiry record here: <a href="' + leadDetailPageUrl + '">View Inquiry</a><br>';

   
   
    // String siteBaseUrl = Site.getBaseUrl();
    // String leadDetailPageUrl = siteBaseUrl + '/studentEnrollmentProcess/additional-detail-page?leadId=' + leadId;
    
    // // Add the URL to the email body
    // body += '<br><br>For more details, you can view your inquiry record here: <a href="' + leadDetailPageUrl + '">View Inquiry</a><br>';
    


            body += '<br><br>Thanks,<br>';
            email.setHtmlBody(body);
            Messaging.sendEmail(new Messaging.SingleEmailMessage[]{email});

            System.debug('Email sent successfully to student: ' + emailAddress);
        } catch (Exception e) {
            System.debug('Error sending email: ' + e.getMessage());
        }
    }

    // public static void sendLinkToStudent(Id leadId){

    //     String leadDetailPageUrl ='https://kriittechnologies44-dev-ed.develop.my.site.com/studentEnrollmentProcess?leadId='+leadId +'/';


    // }
}











// public without sharing class cardCourse {
//         @AuraEnabled(cacheable=true)
//         public static List<Course__c> getCourse(String cid){
//            try {
//                List<Course__c> course = [
//                    SELECT Id,Course_Fees__c,Eligibility_Criteria__c,Credits__c, Course_Description__c ,Name,Course_Year__c,Course_Code__c 
//                    FROM Course__c
//                    WHERE College__c=:cid
//                ];
//                return course;
//            } catch (Exception e) {
//                throw new AuraHandledException(e.getMessage());
//            }
//         }




//     // @AuraEnabled
//         // public static List<SelectOption> getCourseList(){
//         //     List<SelectOption> options = new List<SelectOption>();
//         //     List<Course__c> courseList = [SELECT Id, Name FROM Course__c ];
//         //     for(Course__c cList : courseList){
//         //         options.add( new SelectOption(cList.Id, cList.Name));            
//         //     }
//         //     return options;
//         // }


//         // @AuraEnabled
//         // public static List<Course__c> getCourseList(String cid) {
//         //     // Fetch the list of courses based on College Id (cid)
//         //     List<Course__c> courseList = [SELECT Id, Name FROM Course__c WHERE College__c = :cid];
//         //     return courseList;
//         // }


//         // =======================================================================


//         @AuraEnabled
//         public static String submitInquiry(
//             Id courseId, 
//             String firstName, 
//             String middleName, 
//             String lastName,  
//             String gender, 
//             Date dob,  
//             String emailAddress, 
//             String phno, 
//             String prevEdu, 
//             String stream) 
//         {
//             try {
//                 // Create a new Lead for student inquiry
//                 Student_Inquiry_Lead__c lead = new Student_Inquiry_Lead__c(
//                     First_Name__c = firstName,
//                     Middle_Name__c = middleName,
//                     Last_Name__c = lastName,
//                     Email__c = emailAddress,
//                     Phone__c = phno,
//                     DOB__c = dob,
//                     Gender__c = gender,
//                     Stream__c = stream,
//                     Previous_Education__c = prevEdu,
//                     Course__c = courseId
//                 );
//                 insert lead;

//                 // Fetch Semester details for the given Course
//                 List<Semester__c> semesters = [SELECT Id, Name FROM Semester__c WHERE Course__c = :courseId];

//                 // Log the results to ensure the query is returning data
//                 System.debug('Semesters for Course ID ' + courseId + ': ' + semesters);

//                 // Send email with semester details
//                 sendEmailToAdmin(semesters, firstName, middleName, lastName, phno, dob, gender, prevEdu, stream, emailAddress);

//                 return 'Inquiry Submitted Successfully';
//             } catch (Exception e) {
//                 System.debug(e);
//                 return 'Error: ' + e.getMessage();
//             }
//         }



//         public static void sendEmailToAdmin(
//             List<Semester__c> semList, 
//             String firstName, 
//             String middleName, 
//             String lastName, 
//             String phone, 
//             Date dob, 
//             String gender, 
//             String prevEdu, 
//             String stream, 
//             String emailAddress
//         ) {
//             try {
//                 // Debugging the semester list
//                 System.debug('Semester List: ' + semList);

//                 Messaging.SingleEmailMessage email = new Messaging.SingleEmailMessage();
//                 email.setToAddresses(new String[]{emailAddress}); // Send email to admin

//                 email.setSubject('Thanks ' + firstName + ' ' + lastName + ' for showing interest');
//                 String body = '' + 
//                     'Your details according to inquiry submission are as follows: <br>' + 
//                     'First Name: ' + firstName + '<br>' +
//                     'Last Name: ' + lastName + '<br>' + 
//                     'Middle Name: ' + middleName + '<br>' +
//                     'Phone: ' + phone + '<br>' + 
//                     'Email: ' + emailAddress + '<br>' + 
//                     'DOB: ' + dob + '<br>' + 
//                     'Gender: ' + gender + '<br>' + 
//                     'Previous Education: ' + prevEdu + '<br>' + 
//                     'Stream: ' + stream + '<br>';

//                 // Debugging the semester details
//                 body += 'Semester Details for the Course: <br>';
//                 if (!semList.isEmpty()) {
//                     for(Semester__c sem : semList) {
//                         body += 'Semester Name: ' + sem.Name + '<br>';
//                     }
//                 } else {
//                     body += 'No semester details available for this course.<br>';
//                 }

//                 body += '<br><br>Thanks,<br>';

//                 email.setHtmlBody(body);
//                 Messaging.sendEmail(new Messaging.SingleEmailMessage[]{email});

//                 System.debug('Email sent successfully to Admin: ' + emailAddress);
//             } catch (Exception e) {
//                 System.debug('Error sending email: ' + e.getMessage());
//             }
//         }
// }





    //=====================================================================================================







        // @AuraEnabled
        // public static String submitInquiry(Id courseId, String firstName, String middleName, String lastName,  String gender, Date dob,  String emailAddress, String phno, String prevEdu, String stream) 
        // {

            
        //     try {
          
        //     // System.debug(courseInfo);
        //         System.debug('---Lead---');
        //     Student_Inquiry_Lead__c lead = new Student_Inquiry_Lead__c(
            
        //     First_Name__c = firstName,
        //     Middle_Name__c = middleName,
        //     Last_Name__c = lastName,
        //     Email__c = emailAddress,
        //     Phone__c = phno,
        //     DOB__c = dob,
        //     Gender__c = gender,
        //     Stream__c = stream,
        //     Previous_Education__c = prevEdu,
        //     Course__c = courseId
        //       );
        //     insert lead;

          

        //     sendEmailToAdmin(courseId, firstName, middleName, lastName, phno, dob, gender, prevEdu, stream, emailAddress);


        //     return 'Inquiry Submitted Successfully';

        //     }
        //     catch(Exception e){
        //         System.debug(e);
        //         return 'Error: ' + e.getMessage();
        //     }


        // }
    
        


        // // Method to send an email to a specific user (e.g., Admin)
        // public static void sendEmailToAdmin(
        //     List<Semester__c> semList, 
        //     String firstName, 
        //     String middleName, 
        //     String lastName, 
        //     String phone, 
        //     Date dob, 
        //     String gender, 
        //     String prevEdu, 
        //     String stream, 
        //     String emailAddress
        // ) {
        //     try {
        //         // Debugging the semester list
        //         System.debug('Semester List: ' + semList);
        
        //         Messaging.SingleEmailMessage email = new Messaging.SingleEmailMessage();
        //         email.setToAddresses(new String[]{emailAddress}); // Send email to admin
        
        //         email.setSubject('Thanks ' + firstName + ' ' + lastName + ' for showing interest');
        //         String body = '' + 
        //             'Your details according to inquiry submission are as follows: <br>' + 
        //             'First Name: ' + firstName + '<br>' +
        //             'Last Name: ' + lastName + '<br>' + 
        //             'Middle Name: ' + middleName + '<br>' +
        //             'Phone: ' + phone + '<br>' + 
        //             'Email: ' + emailAddress + '<br>' + 
        //             'DOB: ' + dob + '<br>' + 
        //             'Gender: ' + gender + '<br>' + 
        //             'Previous Education: ' + prevEdu + '<br>' + 
        //             'Stream: ' + stream + '<br>';
        
        //         // Debugging the semester details
        //         body += 'Semester Details for the Course: <br>';
        //         if (!semList.isEmpty()) {
        //             for(Semester__c sem : semList) {
        //                 body += 'Semester Name: ' + sem.Name + '<br>';
        //             }
        //         } else {
        //             body += 'No semester details available for this course.<br>';
        //         }
        
        //         body += '<br><br>Thanks,<br>';
        
        //         email.setHtmlBody(body);
        //         Messaging.sendEmail(new Messaging.SingleEmailMessage[]{email});
        
        //         System.debug('Email sent successfully to Admin: ' + emailAddress);
        //     } catch (Exception e) {
        //         System.debug('Error sending email: ' + e.getMessage());
        //     }
        // }
        

    // ================================================================================

        // @AuraEnabled
        // public static void saveInquiry(String firstName, String lastName, String middleName, 
        //                 String phno, Date dob, String prevEdu, String gender, String stream,  
        //                 String course,   String emailAddress) 
        // { 

        //     try {
        //         Student_Inquiry_Lead__c newInquiry = 
        //                             new Student_Inquiry_Lead__c( First_Name__c = firstName,
        //                             Last_Name__c = lastName,
        //                             Middle_Name__c = middleName,
        //                                 Email__c = emailAddress,
        //                                 Phone__c = phno,
        //                                 DOB__c = dob,
        //                                 Previous_Education__c = prevEdu,
        //                                 Gender__c = gender,
        //                                 Stream__c = stream,
        //                                 Course__c = course);
        //         insert newInquiry;
    
        //         List<Course__c> relatedCourses = [SELECT Id, Name, College__c, Course_Fees__c, Course_Description__c, Eligibility_Criteria__c, (Select Name, Semester_Fees__c, Start_date__c, End_Date__c from Semester__c where Name =: course.Name )
        //                                           FROM Course__c
        //                                           WHERE College__c = :course]; 
        //                                         //   WHERE AccountId = :newAccount.Id 
        //                                         //   ORDER BY CreatedDate DESC LIMIT 5];
    
        //         if (!relatedCourses.isEmpty()) {
        //             sendEmail(newInquiry, relatedCourses, emailAddress);
        //         }
        //     } catch (Exception e) {
        //         throw new AuraHandledException('Error creating account: ' + e.getMessage());
        //     }
        // }


        // private static void sendEmail(Student_Inquiry_Lead__c sil, List<Course__c> courses, String toAddress) {

        //     String emailBody = 'New Inquiry created: ' + sil.First_Name__c + '<br><br>';
        //     emailBody += 'Recent 5 Courses:<br>';
        //     emailBody += '<table border="1"><tr><th>First Name</th><th>Last Name</th><th>Phone</th><th>Email</th></tr>';
    
        //     for (Course__c c : courses) {
        //         emailBody += '<tr><td>' + c.College__c + '</td><td>' + c.Course_Fees__c + '</td><td>' + c.Course_Description__c + '</td><td>' + c.Eligibility_Criteria__c + '</td></tr>';
        //         emailBody += '<tr><td>' + c.Name + '</td><td>' + c.Course_Fees__c + '</td><td>' + c.Semester_Fees__c + '</td><td>' + c.Start_date__c + '</td></tr>';

        //     }
    
        //     emailBody += '</table>';
    
        //     Messaging.SingleEmailMessage mail = new Messaging.SingleEmailMessage();
        //     mail.setToAddresses(new String[] { toAddress });
        //     mail.setSubject('New Account Created with Recent Contacts');
        //     mail.setHtmlBody(emailBody);
        //     Messaging.sendEmail(new Messaging.SingleEmailMessage[] { mail });
        // }

        // @AuraEnabled(cacheable=true)
        // public static List<Course__c> getLeadsWithMultiPicklistValues() {
        //     // Query Leads and retrieve the multi-picklist field LeadSource
        //     List<Course__c> courseList = [SELECT Eligibility_Criteria__c FROM Course__c];
    
        //     // Return the list of Lead records
        //     return courseList;
        // }
        
    
