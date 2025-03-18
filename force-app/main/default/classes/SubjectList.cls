
public without sharing class SubjectList {
  
    // Fetch Student Profile (No changes here)
    @AuraEnabled(cacheable=true)
    public static Student__c studentProfile(String studentId) {
        try {
            System.debug('Received Student ID: ' + studentId);
            // Trim spaces
            String trimmedStudentId = studentId != null ? studentId.trim() : '';
            System.debug('Trimmed Student ID: ' + trimmedStudentId);
            
            List<Student__c> students = [SELECT Id, 
                                         Name__c,
                                         Last_Name__c,  
                                         Middle_Name__c,
                                         Phone_Number__c,
                                         Email__c,
                                         Gender__c
                                      FROM Student__c 
                                      WHERE Name = :trimmedStudentId 
                                      LIMIT 1];
    
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

    // Fetch Subjects related to the Course of the Student
    @AuraEnabled(cacheable=true)
    public static List<Subject__c> fetchSubjectsForStudent(String studentId) {
        try {
            System.debug('Received Student ID for Subjects: ' + studentId);
            String trimmedStudentId = studentId != null ? studentId.trim() : '';
            System.debug('Trimmed Student ID for Subjects: ' + trimmedStudentId);
            
            // Query to fetch the student and related course (through Course__c lookup field)
            List<Student__c> students = [SELECT Id, Name__c, Course__c 
                                        FROM Student__c 
                                        WHERE Name = :trimmedStudentId 
                                        LIMIT 1];

            // Check if the student exists and has a related course
            if (students.isEmpty()) {
                System.debug('No student found for ID: ' + trimmedStudentId);
                throw new AuraHandledException('No student found with this ID.');
            }

            // Get the course ID related to the student
            Id courseId = students[0].Course__c;

            // Query the related subjects from Subject__c for the course
            List<Subject__c> subjects = [SELECT Id, Name, Subject_Code__c, Subject_Image__c, Subject_Description__c 
                                         FROM Subject__c
                                         WHERE Course__c = :courseId];

            if (subjects.isEmpty()) {
                System.debug('No subjects found for the course ID: ' + courseId);
                throw new AuraHandledException('No subjects found for this course.');
            }

            System.debug('Subjects Found: ' + subjects);
            return subjects;

        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
    
    








    // Method to fetch subjects based on a student's associated course
    @AuraEnabled(cacheable=true)
    public static List<SubjectWrapper> getSubjectsForStudent(String studentNumber) {
        // Query the student record to fetch the associated Course__c
        Student__c student = [SELECT Id, Name, Course__c 
                              FROM Student__c 
                              WHERE Name = :studentNumber 
                              LIMIT 1];
        System.debug(student);
        System.debug(student.Course__c);

        // Check if the student has an associated course
        if (student.Course__c != null) {
            // Query subjects related to the course
            List<Subject__c> subjects = [
                SELECT Id, Name, Subject_Code__c, Subject_Description__c, Subject_Image__c 
                FROM Subject__c 
                WHERE Course__c = :student.Course__c
            ];
            
            // Prepare the result to return to LWC
            List<SubjectWrapper> subjectList = new List<SubjectWrapper>();
            
            for (Subject__c subject : subjects) {
                SubjectWrapper wrapper = new SubjectWrapper();
                wrapper.name = subject.Name;
                wrapper.code = subject.Subject_Code__c;
                wrapper.description = subject.Subject_Description__c;
                wrapper.imageUrl = subject.Subject_Image__c; // Optional image URL
                
                subjectList.add(wrapper);
            }
            
            return subjectList;
        }
        
        // If the student doesn't have a course, return an empty list
        return new List<SubjectWrapper>();
    }
    
    // Wrapper class to structure the data for LWC
    public class SubjectWrapper {
        @AuraEnabled public String name;
        @AuraEnabled public String code;
        @AuraEnabled public String description;
        @AuraEnabled public String imageUrl;
    }


    
        // @AuraEnabled(cacheable=true)
        // public static List<SubjectWrapper> getSubjectsForStudent(Id studentId) {
        //     // Query the student's course based on the studentId
        //     Student__c student = [SELECT Id, Name, Course__c 
        //                           FROM Student__c 
        //                           WHERE Id = :studentId 
        //                           LIMIT 1];
            
        //     // If the student has an associated course, fetch subjects related to that course
        //     if (student.Course__c != null) {
        //         // Query subjects related to the student's course
        //         List<Subject__c> subjects = [
        //             SELECT Id, Name, Subject_Code__c, Subject_Description__c, Subject_Image__c 
        //             FROM Subject__c 
        //             WHERE Course__c = :student.Course__c
        //         ];
                
        //         // Prepare the result to return to LWC
        //         List<SubjectWrapper> subjectList = new List<SubjectWrapper>();
                
        //         for (Subject__c subject : subjects) {
        //             SubjectWrapper wrapper = new SubjectWrapper();
        //             wrapper.name = subject.Name;
        //             wrapper.code = subject.Subject_Code__c;
        //             wrapper.description = subject.Subject_Description__c;
        //             wrapper.imageUrl = subject.Subject_Image__c; // Optional image URL
                    
        //             subjectList.add(wrapper);
        //         }
                
        //         return subjectList;
        //     }
            
        //     // If no course is found for the student, return an empty list
        //     return new List<SubjectWrapper>();
        // }
        
        // // Wrapper class to structure the data for LWC
        // public class SubjectWrapper {
        //     @AuraEnabled public String name;
        //     @AuraEnabled public String code;
        //     @AuraEnabled public String description;
        //     @AuraEnabled public String imageUrl;
        // }
    

    

        // // Method to get subjects for a specific course
        // @AuraEnabled(cacheable=true)
        // public static List<SubjectWrapper> getSubjectsForCourse(Id courseId) {
        //     // Query subjects related to the given course
        //     List<Subject__c> subjects = [
        //         SELECT Name, Subject_Code__c, Subject_Description__c, Subject_Image__c 
        //         FROM Subject__c 
        //         WHERE Course__c = :courseId
        //     ];
            
        //     // Prepare the result to return to LWC
        //     List<SubjectWrapper> subjectList = new List<SubjectWrapper>();
            
        //     for (Subject__c subject : subjects) {
        //         SubjectWrapper wrapper = new SubjectWrapper();
        //         wrapper.name = subject.Name;
        //         wrapper.code = subject.Subject_Code__c;
        //         wrapper.description = subject.Subject_Description__c;
        //         wrapper.imageUrl = subject.Subject_Image__c; // Optional image URL
                
        //         subjectList.add(wrapper);
        //     }
            
        //     return subjectList;
        // }
        
        // // Wrapper class to structure the data for LWC
        // public class SubjectWrapper {
        //     @AuraEnabled public String name;
        //     @AuraEnabled public String code;
        //     @AuraEnabled public String description;
        //     @AuraEnabled public String imageUrl;
        // }
    
}

    



        // @AuraEnabled(cacheable=true)
        // public static List<SubjectWrapper> getSubjectsForCourse(Id courseId) {
        //     // Query related subjects for the given Course__c record
        //     List<Subject__c> subjects = [SELECT Name, Subject_Code__c, Subject_Description__c, Subject_Image__c 
        //                                  FROM Subject__c
        //                                  WHERE Course__c = :courseId];
    
        //     // Prepare the result to send to LWC
        //     List<SubjectWrapper> subjectList = new List<SubjectWrapper>();
            
        //     for (Subject__c subject : subjects) {
        //         SubjectWrapper wrapper = new SubjectWrapper();
        //         wrapper.name = subject.Name;
        //         wrapper.code = subject.Subject_Code__c;
        //         wrapper.description = subject.Subject_Description__c;
        //         wrapper.imageUrl = subject.Subject_Image__c; // Optional image URL
                
        //         subjectList.add(wrapper);
        //     }
            
        //     return subjectList;
        // }
        
        // // Wrapper class to structure the data for LWC
        // public class SubjectWrapper {
        //     @AuraEnabled public String name;
        //     @AuraEnabled public String code;
        //     @AuraEnabled public String description;
        //     @AuraEnabled public String imageUrl;
        // }
    
    
    
    
