import makeGlobe from 'js/globe.js';
import makeTimeline from 'js/timeline.js';

if(document.getElementsByClassName('map').length){
    makeGlobe('.map');
    makeTimeline('.about_timeline');
}

function isValidEmail(string){
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(string);
}

function suggest(value){

    let emailDomain = value.split('@')[1],
        domains = [
            /* Norwegian domains, courtsey of Finn.no */
            "hotmail.com","gmail.com","online.no","live.no","yahoo.no","yahoo.com","hotmail.no","c2i.net","broadpark.no","frisurf.no","start.no","msn.com","lyse.net","getmail.no","chello.no","live.com","me.com","tele2.no","wp.pl","bluezone.no","outlook.com","netcom.no","stud.ntnu.no","sensewave.com","tiscali.no","spray.no","bbnett.no","ntebb.no","epost.no","statoil.com","live.se","telia.com","mac.com","icloud.com","ebnett.no","haugnett.no","mail.ru","losmail.no","mimer.no","telenor.com","mail.com","adsl.no","o2.pl","yahoo.co.uk","inbox.lv","hjemme.no","halden.net","vikenfiber.no","gmail.no","student.uib.no","ymail.com","hydro.com","sf-nett.no","aol.com","interia.pl","web.de","loqal.no","yahoo.se"];

    // If we already submitted a common domain, return out
    if(!emailDomain || domains.indexOf(emailDomain) >= 0){ return false; }

    let domainsToTest = [];
    domains.filter(d => {
        return d.length === emailDomain.length
            || d.length === emailDomain.length + 1
            || d.length === emailDomain.length - 1;
    }).forEach(dmn => {
        domainsToTest.push({
            name: dmn,
            errors: 0
        });
    })

    domainsToTest.forEach(commonDomain => {
        emailDomain.split('').some((char, i) => {
            if(char !== commonDomain.name.charAt(i)){
                commonDomain.errors++;
                // If we're just missing a letter, but the rest is A-OK
                if(emailDomain.slice(i) === commonDomain.name.slice(i+1))return true;
                // If we've added an extra letter
                if(emailDomain.slice(i+1) === commonDomain.name.slice(i))return true;
            }
        });
    });

    let sugestions = domainsToTest.filter(d => {return d.errors === 1});

    return sugestions.length ? sugestions[0].name : false;
}

let input = document.querySelector('.email_input');
input.addEventListener('blur', (e) => {
    console.log(suggest(e.target.value));

    let value = e.target.value,
        suggestion = suggest(value);

    if(suggestion){
        document.querySelector('.suggestion').innerHTML = 'Mente du '+ value.split('@')[0] +'<strong>@' + suggestion + '</strong>?';
    }else{
        document.querySelector('.suggestion').innerHTML = '';
    }

});