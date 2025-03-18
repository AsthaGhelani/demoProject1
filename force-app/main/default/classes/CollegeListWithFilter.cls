public with sharing class CollegeListWithFilter {

    @AuraEnabled(cacheable=true)
    public static List<College__c> getDistinctColleges() {
        // Query to get distinct college names
        List<College__c> colleges = [SELECT Id, Name FROM College__c ORDER BY Name];
        return colleges;
    }
    
    @AuraEnabled(cacheable=true)
    public static List<Course__c> getColleges(String nameFilter, String cityFilter, String sortBy, String sortOrder, String collegeNameFilter) {

        String query = 'SELECT Id, Name, Course_Fees__c, College__r.Name FROM Course__c';

        // Apply filters if any are provided
        Boolean firstCondition = true;

        // Add the course name filter condition if it's provided
        if (String.isNotBlank(nameFilter)) {
            query += ' WHERE Name LIKE :nameFilter';
            firstCondition = false;
        }

        // Add the city filter condition if it's provided
        if (String.isNotBlank(cityFilter)) {
            if (firstCondition) {
                query += ' WHERE City__c LIKE :cityFilter';
            } else {
                query += ' AND City__c LIKE :cityFilter';
            }
        }

        // Add the college name filter condition if it's provided
        if (String.isNotBlank(collegeNameFilter)) {
            if (firstCondition) {
                query += ' WHERE College__r.Name LIKE :collegeNameFilter';
            } else {
                query += ' AND College__r.Name LIKE :collegeNameFilter';
            }
        }

        // Apply sorting if it's provided
        if (String.isNotBlank(sortBy)) {
            query += ' ORDER BY ' + sortBy;
            if (String.isNotBlank(sortOrder)) {
                query += ' ' + sortOrder;
            }
        }

        // Execute the query
        List<Course__c> courses = Database.query(query);
        return courses;
    }

    @AuraEnabled
    public static void createInquiryLead(Map<String, Object> inquiryData) {
        try {
            Student_Inquiry_Lead__c newInquiry = new Student_Inquiry_Lead__c();
            newInquiry.First_Name__c = (String)inquiryData.get('First_Name__c');
            newInquiry.Last_Name__c = (String)inquiryData.get('Last_Name__c');
            newInquiry.Email__c = (String)inquiryData.get('Email__c');
            newInquiry.Phone__c = (String)inquiryData.get('Phone__c');
            newInquiry.Course__c = (String)inquiryData.get('Course__c');
            newInquiry.College__c = (String)inquiryData.get('College__c');
            insert newInquiry;
        } catch (Exception e) {
            throw new AuraHandledException('Error creating inquiry lead: ' + e.getMessage());
        }
    }

    
}








// public with sharing class CollegeListWithFilter {

//         @AuraEnabled(cacheable=true)
//     public static List<College__c> getColleges(String nameFilter, String cityFilter) {
//         // Start the query without a base condition
//         String query = 'SELECT Id, Name, City__c, UniversityId__c FROM College__c';

//         // Apply filters if any are provided
//         Boolean firstCondition = true;

//         // Add the name filter condition if it's provided
//         if (String.isNotBlank(nameFilter)) {
//             query += ' WHERE';
//             query += ' Name LIKE :nameFilter';
//             firstCondition = false; // First condition added
//         }

//         // Add the city filter condition if it's provided
//         if (String.isNotBlank(cityFilter)) {
//             if (firstCondition) {
//                 query += ' WHERE';
//                 firstCondition = false; // First condition added
//             } else {
//                 query += ' AND';
//             }
//             query += ' City__c LIKE :cityFilter';
//         }

//         // Execute the query
//         List<College__c> colleges = Database.query(query);

//         return colleges;
//     }
    
    
// }