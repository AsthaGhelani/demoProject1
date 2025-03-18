public with sharing class LoginController {
    
    // Update the method to return a Map instead of a Boolean
    @AuraEnabled
    public static Map<String, String> loginEnrollmentPassword(String studentId, String password) {
        try {
            // Query the Student__c object using the Student_ID__c field
            List<Student__c> studentList = [SELECT Id, Name__c, Last_Name__c, Email__c, Course__c, College__c 
                                            FROM Student__c
                                            WHERE Name__c = :studentId 
                                            AND Password__c = :password LIMIT 1];
            
            // If a record is found, return student details as a Map
            if (!studentList.isEmpty()) {
                Student__c student = studentList[0];
                // Return the student details in a Map
                return new Map<String, String>{
                    'FirstName' => student.Name__c,
                    'LastName' => student.Last_Name__c,
                    'Email' => student.Email__c,
                    'CourseId' => student.Course__c,
                    'CollegeId' => student.College__c
                };
            }
            return null; // If no student found, return null
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    // Static method to check if the student has already inquired about the course and college
    @AuraEnabled
    public static Boolean checkPreviousInquiry(String firstName, String lastName, String email, String courseId, String collegeId) {
        try {
            // Query to check if the student has already inquired about the same course and college
            List<Student_Inquiry_Lead__c> previousInquiries = [SELECT Id FROM Student_Inquiry_Lead__c
                                                                WHERE First_Name__c = :firstName
                                                                AND Last_Name__c = :lastName
                                                                AND Email__c = :email
                                                                AND Course__c = :courseId
                                                                AND College__c = :collegeId 
                                                                LIMIT 1];
            
            // If an inquiry already exists, return true; otherwise, false
            return !previousInquiries.isEmpty();
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}
