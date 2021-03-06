export default function contactform(selector){

    const typeInput = document.querySelector(selector + ' #contacttype'),
        form = document.querySelector(selector),
        projectHTML = `
            <fieldset id="project" class="contactform_project">
                <label>Budsjett (circa)</label>
                <div id="range" class="budgetrange"></div>

                <div class="segmented">
                <label>Tidsperspektiv</label>
                    <input id="timeframe-asap" type="radio" name="timeframe" value="ASAP" />
                    <label for="timeframe-asap">I går</label>

                    <input id="timeframe-medium" type="radio" name="timeframe" value="weeks" />
                    <label for="timeframe-medium">Uker</label>

                    <input id="timeframe-long" type="radio" name="timeframe" value="months" checked />
                    <label for="timeframe-long">Måneder</label>

                    <input id="timeframe-xlong" type="radio" name="timeframe" value="years" />
                    <label for="timeframe-xlong">År</label>
                </div>
            </fieldset>
        `;

    typeInput.addEventListener('change', (e) => {
        if(e.target.value == 1){

            document.getElementById('contactform-send')
                .insertAdjacentHTML('beforebegin', projectHTML);

            const element = document.getElementById('project');
            const range = document.getElementById('range');

            noUiSlider.create(range, {
                start: [40000, 75000],
                connect: true,
                range: {
                    'min': [ 10000 ],
                    '25%': [ 35000 ],
                    '75%': [ 75000 ],
                    'max': [ 200000 ]
                },
                tooltips: true,
                format: {
                    to: (value) => {
                        if(value === 10000){
                            return 'Under&nbsp;kr.&nbsp;10,000,-'
                        }else if(value === 200000){
                            return 'Over&nbsp;kr.&nbsp;200,000,-'
                        }
                        let num = Math.round(value/1000)*1000;
                        return 'kr.&nbsp;' + num.toLocaleString() + ',-';
                    },
                    from: (value) => {
                        return value.replace(',-', '');
                    }
                }
            });

            let prev = element.clientHeight;
            element.style.maxHeight = 0;
            element.style.opacity = 0;
            window.setTimeout(()=>{
                element.style.opacity = 1;
                element.style.maxHeight = prev + 'px';
            }, 10);

        }else{
            const element = document.getElementById('project');
            element.style.maxHeight = 0;
            element.style.opacity = 0;
            element.style.transform = 'scaleY(0)';
            window.setTimeout(() => {
                element.remove();
            }, 1000)
        }

    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();

            const elems = form.querySelectorAll('input:not([type=radio]), select, textarea, input[type=radio]:checked'),
                range = document.getElementById('range');
            let formData = {};

            [].forEach.call(elems, element => {
                let key = element.name,
                    value = element.value;
                if(key){
                    formData[key] = value;
                }
            });

            if(range){
                formData['ballparkFrom'] = range.noUiSlider.get()[0].replace('&nbsp;', ' ');
                formData['ballparkTo'] = range.noUiSlider.get()[1].replace('&nbsp;', ' ');
            }

            form.setAttribute('aria-busy', 'true')

            fetch('https://api.formbucket.com/f/buk_VORbfNwPT2PdQ0rd33BKPLxN', {
                method: 'post',
                mode: 'cors',
                headers: {
                    'accept' : 'application/javascript',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            }).then(d => {
                if(d.status === 200){
                    form.setAttribute('aria-busy', 'false');
                    form.classList.add('sent');
                }else{
                    form.setAttribute('aria-busy', 'false');
                    form.classList.add('failed');
                }
            }).catch(err => {
                form.setAttribute('aria-busy', 'false');
                form.classList.add('failed');
            });

        return false;
    });
}
