import makeGlobe from 'js/globe.js';
import makeTimeline from 'js/timeline.js';
import emailValidator from 'js/email.js';
import contactform from 'js/contactform.js';

if(document.getElementsByClassName('map').length){
    makeGlobe('.map');
    makeTimeline('.about_timeline');
}

if(document.getElementsByClassName('contactform').length){
    contactform('.contactform');
    emailValidator('.email_input');
}


