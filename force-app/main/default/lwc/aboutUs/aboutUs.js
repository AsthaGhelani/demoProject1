import { LightningElement } from 'lwc';

export default class StudentEnrollmentProcess extends LightningElement {
    steps = [
        {
            id: 'step1',
            title: 'Step 1: Pre-Registration',
            description: 'Submit your pre-registration form, including personal information, degree(s) and plan of enrollment.',
            icon: 'utility:edit'
        },
        {
            id: 'step2',
            title: 'Step 2: Course Registration',
            description: 'Register for your classes through the online student portal, ensuring your test schedule aligns with your academic goals.',
            icon: 'utility:date_input'
        },
        {
            id: 'step3',
            title: 'Step 3: Admission Decision',
            description: 'Wait for our decision after reviewing your test score & application. You\'ll receive a email notification with the outcome.',
            icon: 'utility:email'
        },
        {
            id: 'step4',
            title: 'Step 4: Confirm Your Enrollment',
            description: 'Confirm your place by submitting the enrollment deposit before the specified deadline.',
            icon: 'utility:cases'
        },
       
        // {
        //     id: 'step5',
        //     title: 'Step 5: Orientation & Advising',
        //     description: 'Join our orientation to meet faculty, understand your academic path, and begin your college journey with confidence.',
        //     icon: 'utility:groups'
        // },
        
        {
            id: 'step5',
            title: 'Step 5: Finalize Your Enrollment',
            description: 'Submit health forms, apply for housing, and settle any outstanding tuition fees to officially complete your enrollment.',
            icon: 'utility:check'
        },
        {
            id: 'step6',
            title: 'Step 6: First Day of Classes',
            description: 'You\'re ready! Attend your first day of classes and start your academic journey with us.',
            icon: 'utility:user'
        }
    ];
}
