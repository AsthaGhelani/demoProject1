import { LightningElement } from 'lwc';
import IMAGES from '@salesforce/resourceUrl/Images';


export default class Carousel1 extends LightningElement {


    currentIndex = 0;
    images = [
        {
            id: '1',
            src: `${IMAGES}/h1.jpg`,
            alt: 'Image 1',
            text: 'Welcome to the First Slide',
            secondaryText: 'This is the additional text below the main title'  // Secondary text
        },
        {
            id: '2',
            src: `${IMAGES}/h2.jpg`,
            alt: 'Image 2',
            text: 'Here is the Second Slide',
            secondaryText: 'Fanatic is optional in the Cult Fanatic is optional in the Cult'  // Secondary text
            
        },
        {
            id: '3',
            src: `${IMAGES}/h3.jpg`,
            alt: 'Image 3',
            text: 'Enjoy the Third Slide',
            secondaryText: 'Host with manvolent Host with manvolent'  // Secondary text
        },
        {
            id: '4',
            src: `${IMAGES}/h4.jpg`,
            alt: 'Image 4',
            text: 'Along with the Fourth Slide',
            secondaryText: 'Fiery Canary Seiren Fiery Canary Seiren'  // Secondary text
        }
    ];


    connectedCallback(){
        this.startAutoScroll();
    }

    startAutoScroll(){
        this.autoScrollInterval = setInterval(() => {
            this.nextSlide();
        }, 5000);}

    disconnectedCallback(){
        if(this.autoScrollInterval){
            clearInterval(this.interval);
        }
    }


    get carouselClass() {
        return `carousel-position-${this.currentIndex}`;
    }

    prevSlide() {
        this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
    }

    nextSlide() {
        this.currentIndex = (this.currentIndex + 1) % this.images.length;
    }





    


    // images = [
    //     {
    //         id: '1',
    //         src: `${IMAGES}/h1.jpg`, // Example Image URL
    //         alt: 'Image 1',
    //         text: 'Welcome to the First Slide'
    //     },
    //     {
    //         id: '2',
    //         src: `${IMAGES}/h2.jpg`, // Example Image URL
    //         alt: 'Image 2',
    //         text: 'Here is the Second Slide'
    //     },
    //     {
    //         id: '3',
    //         src: `${IMAGES}/h3.jpg`, // Example Image URL
    //         alt: 'Image 3',
    //         text: 'Enjoy the Third Slide'
    //     }
    // ];
}

