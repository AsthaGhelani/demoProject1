public with sharing class cardStudent {
    @AuraEnabled(cacheable=true)
    public static List<Account> accountData(){
        try {
            return [
                SELECT Id,Name FROM Account
                ];
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}