import makeGlobe from 'js/globe.js';
import makeTimeline from 'js/timeline.js';


if(document.getElementsByClassName('map').length){
    makeGlobe('.map');

    makeTimeline('.about_timeline');
}





