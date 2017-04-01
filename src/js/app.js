import makeGlobe from 'js/globe.js';
import makeTimeline from 'js/timeline.js';
import contactform from 'js/contact.js';

if(document.getElementsByClassName('map').length){
    makeGlobe('.map');
    makeTimeline('.about_timeline');
}

if(document.getElementsByClassName('contactform').length){
    contactform('.email_input');

    const typeInput = document.getElementById('contacttype'),
        projectHTML = `
            <fieldset id="project" class="contactform_project">
                <label>Budsjett (circa)</label>
                <div id="range" class="budgetrange"></div>

                <div class="segmented">
                <label>Tidsperspektiv</label>
                    <input id="timeframe-asap" type="radio" name="timeframe" value="ASAP" />
                    <label for="timeframe-asap">I går</label>

                    <input id="timeframe-medium" type="radio" name="timeframe" value="medium" checked />
                    <label for="timeframe-medium">Uker</label>

                    <input id="timeframe-long" type="radio" name="timeframe" value="long" checked />
                    <label for="timeframe-long">Måneder</label>

                    <input id="timeframe-xlong" type="radio" name="timeframe" value="long" />
                    <label for="timeframe-xlong">År</label>
                </div>
            </fieldset>
        `;

    typeInput.addEventListener('change', (e) => {
        if(e.target.value == 1){
            document.getElementById('contactform-send').insertAdjacentHTML('beforebegin', projectHTML);
            let range = document.getElementById('range');

            noUiSlider.create(range, {
                start: [20000, 50000],
                connect: true,
                range: {
                    'min': [ 5000 ],
                    '25%': [ 15000 ],
                    '75%': [ 50000 ],
                    'max': [ 100000 ]
                },
                tooltips: true,
                format: {
                    to: (value) => {
                        if(value === 5000){
                            return 'Under&nbsp;kr.&nbsp;5000,-'
                        }else if(value === 100000){
                            return 'Over&nbsp;kr.&nbsp;100,000,-'
                        }
                        let num = Math.round(value/1000)*1000;
                        return 'kr.&nbsp;' + num.toLocaleString() + ',-';
                    },
                    from: (value) => {
                        return value.replace(',-', '');
                    }
                }
            });
        }else{
            document.getElementById('project').remove();
        }
    });

}


