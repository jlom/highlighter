function initChart(targetElemSelector, width){
        let chart = d3.select(targetElemSelector)
            .append('article')
            .attr('class', 'timeline_scroller')
            .append('svg')
            .attr('width', width)
            .attr('class', 'timeline_chart');

        let caption = d3.select(targetElemSelector)
            .append('figcaption');

        caption.append('section')
            .attr('class', 'timeline_tooltip');

        caption.insert('section')
            .attr('class', 'timeline_legend');

        // Prepare the striped background
        chart.append('pattern')
            .attr('id', 'diagonalHatch')
            .attr('patternUnits', 'userSpaceOnUse')
            .attr('width', 4)
            .attr('height', 4)
            .append('path')
            .attr('d', 'M-1,1 l2,-2 M0,4 l4,-4 M3,5 l2,-2');

        return chart;
}

function getResume(){
    return fetch(new Request('https://raw.githubusercontent.com/jlom/cv/expanded/resume.json'))
        .then((response) => {
            // Get the JSON data
            return response.json();
        });
}

function extractDatesFromResumePoints(resumePoints) {
    let dates = [];
    resumePoints.forEach((d) => {
        dates.push(new Date(d.startDate));
        d.endDate ? dates.push(new Date(d.endDate)) : dates.push(new Date());
    });
    return dates;
}

function initTimeScale(dates, width){
        // Get all the dates, to find the start and end dates
        let maxDate = d3.max(dates),
            minDate = d3.min(dates);

        return d3.scaleTime()
            .domain([minDate, maxDate])
            .range([0, width]);
}

function addTickMarks(chart) {
    let years = [];

    let min = d3.min(chart.dates),
        max = d3.max(chart.dates);

    // Add all years but the first one
    for (let year = new Date(min).getFullYear(); year <= new Date(max).getFullYear(); year++){
        years.push(year);
    }

    if(new Date(min).getMonth() > 3){
        years.shift();
    }

    chart.elem.append('g')
            .attr('class', 'timeline_tickLines')
            .selectAll('ticks')
            .data(years)
            .enter().append('line')
            .attr('class', 'timeline_tickLine')
            .attr('x1', (d) => { return chart.scale(new Date(d, 0, 1))})
            .attr('x2', (d) => { return chart.scale(new Date(d, 0, 1))})
            .attr('y1', 0)
            .attr('y2', '100%')

    if(new Date(max).getMonth() < 8){
        years.pop();
    }

    chart.elem.append('g')
            .attr('class', 'timeline_tickLabels')
            .selectAll('ticks')
            .data(years)
            .enter().append('text')
            .attr('class', 'timeline_tickLabel')
            .text((d) => {return d})
            .attr('x', (d) => { return chart.scale(new Date(d, 6, 2))})
            .attr('y', '100%')
}

function generateResumeItems(items){
    return items.map(d => {
        return {
            company: d.organization || d.institution || d.company || '',
            position: d.area || d.position || '',
            startDate: new Date(d.startDate),
            endDate: d.endDate ? new Date(d.endDate) : false,
            category: d.studyType ? 'education' : d.category,
            lane: d.lane ? d.lane : false || d.studyType ? 5 : false || 0
        };
    });
}

function generateResumeTitle(resumeItem){
    let startYear = resumeItem.startDate.getFullYear(),
        endYear = resumeItem.endDate ? resumeItem.endDate.getFullYear() : false,
        company = resumeItem.organization || resumeItem.institution || resumeItem.company || '',
        position = resumeItem.area || resumeItem.position || '',
        dateRange = startYear + (endYear && endYear !== startYear ? ' – ' + endYear : '') + (!endYear ? ' – inneværende' : '');

    return {company, position, dateRange}
}

function addResumePoints(chart) {
    let height = 5,
        lineHeight = height * 3;

    chart.elem.append('g')
        .attr('class', 'timeline_itemGroup')
        .selectAll('workItems')
        .data(chart.items)
        .enter().append('rect')
        .attr('class', (d) => { return 'timeline_item ' + d.category })
        .attr('rx', height/2).attr('ry', height/2)
        .attr('x', (d) => {return chart.scale(d.startDate)})
        .attr('y', (d) => { return d.lane * lineHeight })
        .attr('height', height)
        .attr('width', (d) => {
            let startTime = d.startDate.getTime(),
                endTime = d.endDate ? d.endDate.getTime() : new Date().getTime(),
                offset = d3.min(chart.dates).getTime() + endTime - startTime;

            return chart.scale(offset).split('%')[0] > 1 ? chart.scale(offset) : height * 2;
        })
        .on('mouseover', (item) => {
            let title = generateResumeTitle(item);
            d3.select('.timeline_tooltip')
                .html('<strong>' + title.company + ',</strong> ' + title.position + ' (' + title.dateRange + ')');
        });
}

function generateResumeCategoryLabels(items){
    let categories = [];
    items.forEach(item => {
        let category = item.category;
        if(categories.indexOf(category) < 0){
            categories.push(category);
        }
    });
    return categories;
}

function addLegends(chart){
    let categories = [],
        legends = d3.select('.timeline_legend').append('ul');

    generateResumeCategoryLabels(chart.items).forEach(category => {
        legends.append('li')
            .attr('class', category)
            .text(category[0].toUpperCase() + category.slice(1));
    });
}

function scrollLeft(selector){
    let scroller = document.querySelectorAll(selector)[0];
    scroller.scrollLeft = scroller.scrollWidth;
}

export default function(targetElemSelector){
    getResume().then(resume => {

        let width = '100%',
            dates = extractDatesFromResumePoints([...resume.work, ...resume.education]),
            scale = initTimeScale(dates, width),
            items = generateResumeItems([...resume.work, ...resume.education]),
            elem = initChart(targetElemSelector, width),
            chart = { resume, dates, scale, elem, items };

        addTickMarks(chart);
        addLegends(chart);
        addResumePoints(chart);
        scrollLeft('.timeline_scroller');

    }).catch(console.error);
}
