public without sharing class PaymentClass {

    @AuraEnabled public Student__c student;
    @AuraEnabled public List<Semester__c> semesters;

    // Constructor to initialize student and semesters
    public PaymentClass(Student__c student, List<Semester__c> semesters) {
        this.student = student;
        this.semesters = semesters;
    }

    @AuraEnabled(cacheable=true)
    public static feesPaymentSem getStudentProfileWithSemesters(String studentId) {
        System.debug('📢 Received Student ID: ' + studentId);
        
        if (String.isEmpty(studentId)) {
            throw new AuraHandledException('❌ Student ID is required.');
        }
        
        String trimmedStudentId = studentId.trim();
        System.debug('✂️ Trimmed Student ID: ' + trimmedStudentId);
        
        // ✅ Fetch Student Data
        List<Student__c> students = [SELECT Id, 
            Name__c,
            Last_Name__c,  
            Middle_Name__c,
            Phone_Number__c,
            Email__c,
            Gender__c,
            Course__c
        FROM Student__c 
        WHERE Name = :trimmedStudentId LIMIT 1];
        
        if (students.isEmpty()) {
            System.debug('❌ No student found with ID: ' + trimmedStudentId);
            throw new AuraHandledException('No student found with ID: ' + trimmedStudentId);
        }
        
        Student__c studentRecord = students[0];
        
        // ✅ Fetch Semesters for the Student's Course
        List<Semester__c> semesters = new List<Semester__c>();
        if (studentRecord.Course__c != null) {
            semesters = [SELECT Id, Name, Start_Date__c, End_Date__c, Semester_Fees__c 
                         FROM Semester__c 
                         WHERE Course__c = :studentRecord.Course__c];
        }
        
        System.debug('✅ Semesters Found: ' + semesters);
        
        // ✅ Return Student & Semesters in Wrapper Class
        return new feesPaymentSem(studentRecord, semesters);
    }

    // Updated method to generate Razorpay Payment Link with dynamic fee amount
    @AuraEnabled
    public static String createRazorpayPaymentLink(String semesterId) {
        // Razorpay credentials
        String razorpayKey = 'rzp_test_qrlr4GGaErK4jZ';
        String razorpaySecret = 'SZiUAyEq4RKCuomZZpNACcdr';
        
        // Fetch the Semester Fee dynamically using the semesterId
        List<Semester__c> semesterRecords = [SELECT Semester_Fees__c FROM Semester__c WHERE Id = :semesterId LIMIT 1];
        
        if (semesterRecords.isEmpty()) {
            throw new AuraHandledException('No semester found with ID: ' + semesterId);
        }
        
        Decimal semesterFee = semesterRecords[0].Semester_Fees__c;
        
        // Razorpay API endpoint to create payment link
        String endpoint = 'https://api.razorpay.com/v1/payment_links';
        HttpRequest req = new HttpRequest();
        req.setEndpoint(endpoint);
        req.setMethod('POST');
        
        // Setting Authorization header (Basic Authentication)
        String authHeader = 'Basic ' + EncodingUtil.base64Encode(Blob.valueOf(razorpayKey + ':' + razorpaySecret));
        req.setHeader('Authorization', authHeader);
        req.setHeader('Content-Type', 'application/json');
        
        // Amount in paise (100 paise = 1 INR)
        Integer amountInPaise = (Integer) (semesterFee * 100); // Convert fee to paise
        
        // Prepare the request body with dynamic semester fee
        String body = '{"amount": ' + amountInPaise + ', "currency": "INR", "description": "Semester Payment", "accept_partial": false}';
        req.setBody(body);

        // Sending the request to Razorpay API
        Http http = new Http();
        HttpResponse res = http.send(req);

        if (res.getStatusCode() == 200) {
            // Parsing the response from Razorpay and getting the payment link
            Map<String, Object> result = (Map<String, Object>) JSON.deserializeUntyped(res.getBody());
            String paymentLink = (String) result.get('short_url');
            return paymentLink;
        } else {
            throw new AuraHandledException('Failed to create Razorpay payment link: ' + res.getBody());
        }
    }

    // New method to send email with payment link
    @AuraEnabled
    public static void sendPaymentLinkEmail(String paymentLink, String studentEmail) {
        try {
            Messaging.SingleEmailMessage email = new Messaging.SingleEmailMessage();
            email.setToAddresses(new String[] {studentEmail});
            email.setSubject('Complete Your Semester Payment');
            email.setPlainTextBody('Dear Student,\n\nPlease complete your payment for the semester by clicking the following link: ' + paymentLink);
            Messaging.sendEmail(new Messaging.SingleEmailMessage[] { email });
        } catch (Exception e) {
            System.debug('Error sending email: ' + e.getMessage());
            throw new AuraHandledException('Error sending email: ' + e.getMessage());
        }
    }
}




















// public without sharing class PaymentClass {

//     @AuraEnabled public Student__c student;
//     @AuraEnabled public List<Semester__c> semesters;

//     // Constructor to initialize student and semesters
//     public PaymentClass(Student__c student, List<Semester__c> semesters) {
//         this.student = student;
//         this.semesters = semesters;
//     }

//     @AuraEnabled(cacheable=true)
//     public static feesPaymentSem getStudentProfileWithSemesters(String studentId) {
//         System.debug('📢 Received Student ID: ' + studentId);
        
//         if (String.isEmpty(studentId)) {
//             throw new AuraHandledException('❌ Student ID is required.');
//         }
        
//         String trimmedStudentId = studentId.trim();
//         System.debug('✂️ Trimmed Student ID: ' + trimmedStudentId);
        
//         // ✅ Fetch Student Data
//         List<Student__c> students = [SELECT Id, 
//             Name__c,
//             Last_Name__c,  
//             Middle_Name__c,
//             Phone_Number__c,
//             Email__c,
//             Gender__c,
//             Course__c
//         FROM Student__c 
//         WHERE Name = :trimmedStudentId LIMIT 1];
        
//         if (students.isEmpty()) {
//             System.debug('❌ No student found with ID: ' + trimmedStudentId);
//             throw new AuraHandledException('No student found with ID: ' + trimmedStudentId);
//         }
        
//         Student__c studentRecord = students[0];
        
//         // ✅ Fetch Semesters for the Student's Course
//         List<Semester__c> semesters = new List<Semester__c>();
//         if (studentRecord.Course__c != null) {
//             semesters = [SELECT Id, Name, Start_Date__c, End_Date__c 
//                          FROM Semester__c 
//                          WHERE Course__c = :studentRecord.Course__c];
//         }
        
//         System.debug('✅ Semesters Found: ' + semesters);
        
//         // ✅ Return Student & Semesters in Wrapper Class
//         return new feesPaymentSem(studentRecord, semesters);
//     }

//     // New method to generate Razorpay Payment Link
//     @AuraEnabled
//     public static String createRazorpayPaymentLink(String semesterId) {
//         // Razorpay credentials
//         String razorpayKey = 'rzp_test_qrlr4GGaErK4jZ';
//         String razorpaySecret = 'SZiUAyEq4RKCuomZZpNACcdr';
        
//         // Endpoint to create payment link
//         String endpoint = 'https://api.razorpay.com/v1/payment_links';
//         HttpRequest req = new HttpRequest();
//         req.setEndpoint(endpoint);
//         req.setMethod('POST');
        
//         // Setting Authorization header (Basic Authentication)
//         String authHeader = 'Basic ' + EncodingUtil.base64Encode(Blob.valueOf(razorpayKey + ':' + razorpaySecret));
//         req.setHeader('Authorization', authHeader);
//         req.setHeader('Content-Type', 'application/json');
        
//         // Example payload: Adjust as per your payment needs
//         String body = '{"amount": 100000, "currency": "INR", "description": "Semester Payment", "accept_partial": false}';
//         req.setBody(body);

//         // Sending the request to Razorpay API
//         Http http = new Http();
//         HttpResponse res = http.send(req);

//         if (res.getStatusCode() == 200) {
//             // Parsing the response from Razorpay and getting the payment link
//             Map<String, Object> result = (Map<String, Object>) JSON.deserializeUntyped(res.getBody());
//             String paymentLink = (String) result.get('short_url');
//             return paymentLink;
//         } else {
//             throw new AuraHandledException('Failed to create Razorpay payment link: ' + res.getBody());
//         }
//     }

//     // New method to send email with payment link
//     @AuraEnabled
//     public static void sendPaymentLinkEmail(String paymentLink, String studentEmail) {
//         try {
            
//             Messaging.SingleEmailMessage email = new Messaging.SingleEmailMessage();
//             email.setToAddresses(new String[] {studentEmail});
//             email.setSubject('Complete Your Semester Payment');
//             email.setPlainTextBody('Dear Student,\n\nPlease complete your payment for the semester by clicking the following link: ' + paymentLink);
//             Messaging.sendEmail(new Messaging.SingleEmailMessage[] { email });
//         } catch (Exception e) {
//             System.debug('Error sending email: ' + e.getMessage());
//             throw new AuraHandledException('Error sending email: ' + e.getMessage());
//         }
//     }
// }















// public without sharing class PaymentClass {


//         // @AuraEnabled(cacheable=true)
//         // public static List<Semester__c> getSemestersForCourse(Id studentId) {
//         //     // Query the Student record to get the related Course
//         //     Student__c studentRecord = [SELECT Id, Course__c FROM Student__c WHERE Id = :studentId LIMIT 1];
//         //     System.debug('StudentId-=-==-==---=-=-==-=-=-'+studentRecord);
    
//         //     // Get the Course ID from the Student record
//         //     Id courseId = studentRecord.Course__c;
    
//         //     // Query the related Semester records for the selected Course
//         //     List<Semester__c> semesterList = [SELECT Name, Start_Date__c, End_Date__c 
//         //                                       FROM Semester__c 
//         //                                       WHERE Course__c = :courseId];
    
//         //     return semesterList;
//         // }


//     @AuraEnabled public Student__c student;
//     @AuraEnabled public List<Semester__c> semesters;

//     public feesPaymentSem(Student__c student, List<Semester__c> semesters) {
//         this.student = student;
//         this.semesters = semesters;
//     }
//         @AuraEnabled(cacheable=true)
//         public static feesPaymentSem getStudentProfileWithSemesters(String studentId) {
//             System.debug('📢 Received Student ID: ' + studentId);
        
//             if (String.isEmpty(studentId)) {
//                 throw new AuraHandledException('❌ Student ID is required.');
//             }
        
//             String trimmedStudentId = studentId.trim();
//             System.debug('✂️ Trimmed Student ID: ' + trimmedStudentId);
        
//             // ✅ Fetch Student Data
//             List<Student__c> students = [SELECT Id, 
//                 Name__c,
//                 Last_Name__c,  
//                 Middle_Name__c,
//                 Phone_Number__c,
//                 Email__c,
//                 Gender__c,
//                 Course__c
//             FROM Student__c 
//             WHERE Name = :trimmedStudentId LIMIT 1];
        
//             if (students.isEmpty()) {
//                 System.debug('❌ No student found with ID: ' + trimmedStudentId);
//                 throw new AuraHandledException('No student found with ID: ' + trimmedStudentId);
//             }
//             Student__c studentRecord = students[0];
        
//             // ✅ Fetch Semesters for the Student's Course
//             List<Semester__c> semesters = new List<Semester__c>();
//             if (studentRecord.Course__c != null) {
//                 semesters = [SELECT Id, Name, Start_Date__c, End_Date__c 
//                              FROM Semester__c 
//                              WHERE Course__c = :studentRecord.Course__c];
//             }
            
//             System.debug('✅ Semesters Found: ' + semesters);
        
//             // ✅ Return Student & Semesters in Wrapper Class
//             return new feesPaymentSem(studentRecord, semesters);
//         }
    

// }