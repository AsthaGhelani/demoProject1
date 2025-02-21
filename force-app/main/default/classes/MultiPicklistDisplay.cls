public with sharing class MultiPicklistDisplay {

    @AuraEnabled(cacheable=true)
    public static List<Lead> getLeadsWithMultiPicklistValues() {
        // Query Leads and retrieve the multi-picklist field LeadSource
        List<Lead> leadRecords = [SELECT Id, Name, Multi_Select__c FROM Lead];

        // Return the list of Lead records
        return leadRecords;
    }
    
    
}