public without sharing class AdditionalDetailPage {
    @AuraEnabled(cacheable=true)
   public static List<Student_Inquiry_Lead__c> getLeadId(String leadId){
    try{
    leadId ='a01dL00000nmGr5QAE';
    List<Student_Inquiry_Lead__c> cLead = [SELECT Id,Name,First_Name__c,Last_Name__c,Email__c,Course__r.Eligibility_Criteria__c,Street__c,City__c,State__c,Country__c,Pin_Code__c,X10th_Pass_Year__c,X10th_Percentage__c,X12th_Pass_Year__c,X12th_Percentage__c FROM Student_Inquiry_Lead__c WHERE Id =: leadId ];

                System.debug('cLead-->'+cLead);
                return cLead;            
            } catch (Exception e) {
                throw new AuraHandledException(e.getMessage());
            }

        
    }
}