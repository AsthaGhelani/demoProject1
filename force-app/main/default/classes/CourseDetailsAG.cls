public with sharing class CourseDetailsAG {

    public CourseDetailsAG() {

    }
}
    // Method to fetch course data by Account ID
    // @AuraEnabled(cacheable=true)
    // public static List<Course__c> getCourse(Id accountId) {
    //     try {
    //         // Query to fetch course data including multi-picklist fields like Eligibility Criteria
    //         List<Course__c> courses = [
    //             SELECT Id, Name, Course_Year__c, Course_Code__c, Credits__c, Course_Fees__c,
    //                    Course_Description__c, Eligibility_Criteria__c
    //             FROM Course__c
    //             WHERE College__c = :accountId
    //         ];
    //         return courses;
    //     } catch (Exception e) {
    //         throw new AuraHandledException('Error retrieving courses: ' + e.getMessage());
    //     }
    // }
    // @AuraEnabled(cacheable=true)
    //     public static List<Course__c> getLeadsWithMultiPicklistValues() {
    //         // Query Leads and retrieve the multi-picklist field LeadSource
    //         List<Course__c> courseList = [SELECT Eligibility_Criteria__c FROM Course__c];
    
    //         // Return the list of Lead records
    //         return courseList;
    //     }

    











// public with sharing class CourseDetailsAG {
//     @AuraEnabled(cacheable=true)
//     public static List<Course__c> getCourse(String accountId){
//        try {
//            return[
//                SELECT Id,Course_Fees__c,Eligibility_Criteria__c,Credits__c,Course_Description__c,Name,Course_Year__c,Course_Code__c 
//                FROM Course__c
//                WHERE College__c=:accountId
//            ];
//        } catch (Exception e) {
//            throw new AuraHandledException(e.getMessage());
//        }
//     }

//     @AuraEnabled(cacheable=true)
//     public static List<Course__c> getLeadsWithMultiPicklistValues() {
//         // Query Leads and retrieve the multi-picklist field LeadSource
//         List<Course__c> courseList = [SELECT Eligibility_Criteria__c FROM Course__c];

//         // Return the list of Lead records
//         return courseList;
//     }
    
    
// }