import makeGlobe from 'js/globe.js';
import makeTimeline from 'js/timeline.js';
import contactform from 'js/contact.js';

if(document.getElementsByClassName('map').length){
    makeGlobe('.map');
    makeTimeline('.about_timeline');
}

if(document.getElementsByClassName('contactform').length){
    contactform('.email_input');
}
