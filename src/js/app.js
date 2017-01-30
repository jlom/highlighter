// Set up the chart
let w = '100%',
    tooltip = d3.select('.about_timeline')
        .append('figcaption'),
    chart = d3.select('.about_timeline')
        .append('svg')
        .attr('width', w)
        .attr('class', 'timeline_chart'),
    x, minDate;

// Prepare the striped background
chart.append('pattern')
    .attr('id', 'diagonalHatch')
    .attr('patternUnits', 'userSpaceOnUse')
    .attr('width', 4)
    .attr('height', 4)
    .append('path')
    .attr('d', 'M-1,1 l2,-2 M0,4 l4,-4 M3,5 l2,-2');

// Get my résumé
fetch(new Request('https://raw.githubusercontent.com/jlom/cv/expanded/resume.json'))
    .then((response) => {
        // Get the JSON data
        return response.json();
    })
    .then((resume) => {
        // Get all the dates, to find the start and end dates
        let dates = getDatesFromResumeCategories(resume.work, resume.education, resume.volunteer),
            maxDate = d3.max(dates);
            minDate = d3.min(dates);

        // Define our timescale
        x = d3.scaleTime()
            .domain([minDate, maxDate])
            .range([0, w]);

        addTickMarks(minDate, maxDate);
        addResumePoints(resume.work, resume.education);
    });

function getDatesFromResumeCategories() {
    let dates = [];
    for (let i = 0; i < arguments.length; i++) {
        arguments[i].forEach((d) => {
            dates.push(new Date(d.startDate));
            d.endDate ? dates.push(new Date(d.endDate)) : dates.push(new Date());
        });
    };
    return dates;
}

function addTickMarks(min, max) {
    let years = [];

    // Add all years but the first one
    for (let year = new Date(min).getFullYear(); year <= new Date(max).getFullYear(); year++){
        years.push(year);
    }

    if(new Date(min).getMonth() > 3){
        years.shift();
    }

    if(new Date(max).getMonth() < 8){
        years.pop();
    }
    chart.append('g')
            .attr('class', 'timeline_tickLabels')
            .selectAll('ticks')
            .data(years)
            .enter().append('text')
            .attr('class', 'timeline_tickLabel')
            .text((d) => {return d})
            .attr('x', (d) => { return x(new Date(d, 6, 2))})
            .attr('y', '100%')
    chart.append('g')
            .attr('class', 'timeline_tickLines')
            .selectAll('ticks')
            .data(years)
            .enter().append('line')
            .attr('class', 'timeline_tickLine')
            .attr('x1', (d) => { return x(new Date(d, 0, 1))})
            .attr('x2', (d) => { return x(new Date(d, 0, 1))})
            .attr('y1', 0)
            .attr('y2', '100%')
}

function addResumePoints() {
    let laneidx = 0,
        height = 5,
        lineHeight = height * 3;
    for (let i = 0; i < arguments.length; i++) {
        chart.append('g')
            .attr('class', 'timeline_itemGroup')
            .selectAll('workItems')
            .data(arguments[i])
            .enter().append('rect')
            .attr('class', (d) => {
                return 'timeline_item '+ (d.studyType ? 'education' : d.category);
            })
            .attr('rx', height/2).attr('ry', height/2)
            .attr('x', (d) => {return x(new Date(d.startDate))})
            .attr('y', (d) => {
                if (d.lane !== undefined){
                    return d.lane * lineHeight + 10;
                }
                if(d.studyType){ return lineHeight * 5 + 10 }
                else { return lineHeight * 6 + 10 }
            })
            .attr('width', (d) => {
                let startTime = new Date(d.startDate).getTime();
                let endTime = d.endDate ? new Date(d.endDate).getTime() : new Date().getTime();
                let offset = minDate.getTime() + endTime - startTime;
                return x(offset).split('%')[0] > 1 ? x(offset) : '10px';
            })
            .on('mouseover', (d) => {
                let company = d.organization || d.institution || d.company || '';
                let position = d.area || d.position || '';
                let dateRange = d.startDate ? new Date(d.startDate).getFullYear() : '';

                if (d.endDate) {
                    if(new Date(d.endDate).getFullYear() !== dateRange){
                        dateRange += ' — ' + new Date(d.endDate).getFullYear()
                    }
                } else {
                    dateRange += ' – inneværende'
                }
                tooltip.html(' <strong>' + company + ',</strong> ' + position + ' (' + dateRange + ')');
            })
    }
}



function makeGlobe(){
    let render = () => {
        if(!mesh) return;
        mesh.rotation.y = 4.2 + scrollRotation;
        renderer.render(scene, camera);
        requestAnimationFrame(render);
    }

    let sceneGen = (texture) => {
        scene.add(new THREE.AmbientLight(0x999999));
        let light = new THREE.DirectionalLight(0xbbbbbb, .8);
        light.position.set(5,3,5);
        scene.add(light);

       

        let geometry = new THREE.SphereGeometry(3, 30, 30);
        let material = new THREE.MeshPhongMaterial({ map: texture });
        mesh = new THREE.Mesh( geometry, material );

        mesh.rotation.x = .85;
        scene.add( mesh );
        render();
    }

    let setScrollRotation = () => {
        let elemtop = elem.getBoundingClientRect().top;
        if(elemtop >= 0 && elemtop <= window.innerHeight){
            scrollRotation = elemtop / 1000;
        }else{
            scrollRotation = 0
        }
    }

    let height = 200,
        width = height,
        elem = document.getElementsByClassName('map')[0],
        scrollRotation = 0,
        mesh, rotationOffset; 

    let scene = new THREE.Scene();
    let camera = new THREE.PerspectiveCamera( 75, height / width);

    let renderer = new THREE.WebGLRenderer({alpha: true});
    renderer.setSize( width, height );

    
    elem.appendChild( renderer.domElement );

    camera.position.z = 5;

    new THREE.TextureLoader().load( 'img/earth.png', sceneGen);

    document.addEventListener('scroll', () => {
        setScrollRotation();
    });

}


makeGlobe();
