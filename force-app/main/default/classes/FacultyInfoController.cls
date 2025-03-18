
public without sharing class FacultyInfoController {


//     // Apex method to retrieve all colleges for the student (only one college)
//     @AuraEnabled(cacheable=true)
//     public static College__c getStudentCollege(Id studentId) {
//         try {
//             // Assuming you have a lookup field 'Student__r' on College, this query will return the associated college
//             return [SELECT Id, Name FROM College__c WHERE Id = :studentId LIMIT 1];
//         } catch (Exception e) {
//             throw new AuraHandledException('Error fetching student\'s college: ' + e.getMessage());
//         }
//     }

//     // Apex method to retrieve faculty records for a specific CollegeId
//     @AuraEnabled(cacheable=true)
//     public static List<Faculty__c> getFacultyByCollegeId(Id collegeId) {
//         try {
//             return [SELECT Id, Name, Position__c, Email__c FROM Faculty__c WHERE College__c = :collegeId];
//         } catch (Exception e) {
//             throw new AuraHandledException('Error fetching faculty records: ' + e.getMessage());
//         }
//     }


    


    // Fetch College ID for a given Student ID (with trimming of the studentId)
    @AuraEnabled(cacheable=true)
    public static Id getCollegeIdByStudentId(String studentId) {
        try {
            // Trim spaces from studentId before using it in the query
            String trimmedStudentId = studentId != null ? studentId.trim() : '';
            System.debug('Trimmed Student ID: ' + trimmedStudentId);

            // Query the student's collegeId (Assuming there's a lookup field College__c on Student object)
            List<Student__c> students = [SELECT Id, Name, College__c FROM Student__c WHERE Name = :trimmedStudentId LIMIT 1];
            
            // If no student found with the provided studentId
            if (students.isEmpty()) {
                throw new AuraHandledException('No student found with the provided student ID.');
            }

            // Return the College ID
            return students[0].College__c;
            
        } catch (Exception e) {
            throw new AuraHandledException('Error fetching collegeId: ' + e.getMessage());
        }
    }

    // Fetch Faculty for a specific collegeId
    @AuraEnabled(cacheable=true)
    public static List<Faculty__c> fetchFacultyForCollege(Id collegeId) {
        try {
            // Query the Faculty records for the provided collegeId
            List<Faculty__c> facultyList = [SELECT Id, Name, Last_Name__c, Position__c, Email__c 
                                            FROM Faculty__c 
                                            WHERE College__c = :collegeId];
            
            // If no faculty found for the given collegeId
            if (facultyList.isEmpty()) {
                throw new AuraHandledException('No faculty records found for this college.');
            }

            return facultyList;
            
        } catch (Exception e) {
            throw new AuraHandledException('Error fetching faculty records: ' + e.getMessage());
        }
    }
}

    

    























// public with sharing class FacultyInfoController {

//     @AuraEnabled(cacheable=true)
//     public static List<College__c> getAllColleges() {
//         List<College__c> colleges = [SELECT Id, Name FROM College__c];
//         return colleges;
//     }

//     @AuraEnabled(cacheable=true)
//     public static List<Faculty__c> getFacultyList(String collegeId) {
//         List<Faculty__c> facultyList = [SELECT Id, Name, Position__c, Email__c 
//                                         FROM Faculty__c 
//                                         WHERE College__c = :collegeId];
//         return facultyList;
//     }
// }


    



// public with sharing class FacultyInfoController {
    
//     @AuraEnabled(cacheable=true)
//     public static List<College__c> getColleges() {
//         // Fetch a list of colleges (no faculty data here)
//         List<College__c> colleges = [SELECT Id, Name FROM College__c];
//         return colleges;
//     }
    
//     @AuraEnabled(cacheable=true)
//     public static List<Faculty__c> getFacultyByCollegeId(Id collegeId) {
//         // Fetch faculty members based on college ID
//         List<Faculty__c> facultyList = [
//             SELECT Id, Name, Position__c, Email__c 
//             FROM Faculty__c 
//             WHERE College__c = :collegeId
//         ];
//         return facultyList;
//     }
// }







    // public static Map<String, Object> relatedRecords(Id recordId, Boolean fetchFaculty) {
    //     if (recordId == null) {
    //         throw new AuraHandledException('Record ID cannot be null');
    //     }

    //     Map<String, Object> resultData = new Map<String, Object>();

    //     // Fetch the College record
    //     List<College__c> collegeRecords = [SELECT Id, Name FROM College__c WHERE Id = :recordId LIMIT 1];
    //     if (collegeRecords.isEmpty()) {
    //         throw new AuraHandledException('No college found with the provided ID');
    //     }

    //     College__c collegeRecord = collegeRecords[0];
    //     resultData.put('Name', collegeRecord.Name);
    //     // resultData.put('Location', collegeRecord.Location);

    //     if (fetchFaculty) {
    //         // Fetch related Faculty records if requested
    //         List<Faculty__c> relatedFaculty = [SELECT Id, Name, Position__c, Email__c FROM Faculty__c WHERE College__c = :recordId];
    //         resultData.put('Faculty', relatedFaculty);
    //     }

    //     return resultData;
    // }
// }











// public with sharing class FacultyInfoController {

//     // Method to fetch College and related Faculty data
//     @AuraEnabled(cacheable=true)
//     public static List<CollegeWrapper> getFacultyAndCollegeData() {
//         // Query for colleges and their related faculties
//         List<College__c> colleges = [SELECT Id, Name FROM College__c];
        
//         // Prepare a map to hold faculty data for each college
//         Map<Id, List<Faculty__c>> collegeFacultiesMap = new Map<Id, List<Faculty__c>>();

//         // Fetch faculty records and group them by College Id
//         List<Faculty__c> faculties = [SELECT Id, Name, Last_Name__c, Position__c, Email__c, College__c FROM Faculty__c];
//         for (Faculty__c faculty : faculties) {
//             if (!collegeFacultiesMap.containsKey(faculty.College__c)) {
//                 collegeFacultiesMap.put(faculty.College__c, new List<Faculty__c>());
//             }
//             collegeFacultiesMap.get(faculty.College__c).add(faculty);
//         }

//         // Create a list of CollegeWrapper objects to return data in the desired format
//         List<CollegeWrapper> result = new List<CollegeWrapper>();
//         for (College__c college : colleges) {
//             CollegeWrapper wrapper = new CollegeWrapper();
//             wrapper.collegeId = college.Id;
//             wrapper.collegeName = college.Name;
//             wrapper.faculties = collegeFacultiesMap.get(college.Id);
//             result.add(wrapper);
//         }

//         return result;
//     }

//     // Wrapper class to hold the College and related Faculty data
//     public class CollegeWrapper {
//         @AuraEnabled public Id collegeId;
//         @AuraEnabled public String collegeName;
//         @AuraEnabled public List<Faculty__c> faculties;
//     }
// }





// public without sharing class FacultyInfoController {
//         @AuraEnabled(cacheable=true)
//         public static List<Faculty__c> getFaculty() {
//             return [SELECT Name, Last_Name__c,Position__c, Email__c FROM Faculty__c];
//         }
    
    
// }