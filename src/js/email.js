export default function emailValidator(selector){

    if (!selector) return;

    const domains = [
            'lom.me', 'highlighter.no', 'unimicro.no', 'schibsted.com', 'schibsted.no', 'netliferesearch.no', 'statoil.com', 'telenor.no', 'apple.com', 'bt.no', 'tv2.no', 'nrk.no', 'hotmail.com','gmail.com','online.no','live.no','yahoo.no','yahoo.com','hotmail.no','c2i.net','broadpark.no','frisurf.no','start.no','msn.com','lyse.net','getmail.no','chello.no','live.com','me.com','tele2.no','wp.pl','bluezone.no','outlook.com','netcom.no','stud.ntnu.no','sensewave.com','tiscali.no','spray.no','bbnett.no','ntebb.no','epost.no','statoil.com','live.se','telia.com','mac.com','icloud.com','ebnett.no','haugnett.no','mail.ru','losmail.no','mimer.no','telenor.com','mail.com','adsl.no','o2.pl','yahoo.co.uk','inbox.lv','hjemme.no','halden.net','vikenfiber.no','gmail.no','student.uib.no','ymail.com','hydro.com','sf-nett.no','aol.com','interia.pl','web.de','loqal.no','yahoo.se'
        ],
        tlds = [
            'com', 'no', 'se', 'org', 'edu', 'gov', 'uk', 'net', 'ca', 'de', 'jp', 'fr', 'au', 'us', 'ru', 'ch', 'it', 'nl', 'es', 'mil', 'me', 'name', 'io', 'fm', 'tv', 'co', 'biz', 'info', 'as', 'dk', 'fi', 'is', 'pl', 'lv', 'design', 'news', 'cool'
        ]

    function suggest(input, suggestions, allowance = 1){
        // Return out if we lack an input, or the input is already OK.
        if(!input || suggestions.indexOf(input) >= 0) return false;

        let suggestion = suggestions.filter(_suggestion => {
            // Narrow our search to suggestions of equal length, +/- one char
            return _suggestion.length === input.length
                || _suggestion.length === input.length + 1
                || _suggestion.length === input.length - 1
        }).map(_suggestion => {
            // Set up our error point system
            return {
                suggestion: _suggestion,
                errors: 0
            }
        }).map(_suggestion => {
             // If we're simply missing the last letter
            if(input === _suggestion.suggestion.slice(0, -1)){
                return _suggestion.errors = 1;
            };
            input.split('').some((char, i) => {
                if(char !== _suggestion.suggestion.charAt(i)){
                    _suggestion.errors++;
                    // If we're just missing a letter, but the rest is A-OK
                    if(input.slice(i) === _suggestion.suggestion.slice(i+1))return true;
                    // If we've added an extra letter
                    if(input.slice(i+1) === _suggestion.suggestion.slice(i))return true;
                }
            });
            return _suggestion;
        }).filter(_suggestion => {
            return _suggestion.errors <= allowance;
        })[0];

        return suggestion ? suggestion.suggestion : false;
    }

    function suggestTLD(value){
        if(value.split('.').length === 1) return;
        const address = value.split('.').slice(0, -1).join().toLowerCase(),
            tld = value.split('.').slice(-1)[0].toLowerCase(),
            suggestion = suggest(tld, tlds);
        return suggestion ? {address, suggestion: '.'+suggestion} : false;
    }

    function suggestDomain(value){
        if(value.split('@').length === 1) return;
        const address = value.split('@')[0].toLowerCase(),
            emailDomain = value.split('@')[1].toLowerCase(),
            suggestion = suggest(emailDomain, domains);

        return suggestion ? {address, suggestion: '@'+suggestion} : false;
    }

    function suggestAtSymbol(value){
        if(value.indexOf('@') >= 0) return;
        let domainName = domains.filter(_domain => {
            return value.indexOf(_domain) >= 0;
        })[0];

        return domainName ? {
            address: value.substr(0, value.indexOf(domainName) - 1),
            suggestion: '@' + value.substr((value.indexOf(domainName)))
        } : false;
    }

    let input = document.querySelector(selector);
    input.addEventListener('blur', (e) => {
        if(!e.target.value) return;
        let value = e.target.value,
            suggestion = suggestDomain(value) || suggestTLD(value) || suggestAtSymbol(value),
            suggestionElem = document.querySelector('.suggestion'),
            emailInput = e.target,
            addSuggestion = (event) => {
                event.preventDefault();
                if(suggestion){
                    emailInput.value = suggestion.address + suggestion.suggestion;
                }
                suggestionElem.innerHTML = '';
            };

        if(suggestion){
            suggestionElem.innerHTML = 'Mente du ' + suggestion.address +'<strong>' + suggestion.suggestion + '</strong>?';
            suggestionElem.addEventListener('mousedown', addSuggestion);
        }else{
            suggestionElem.innerHTML = '';
            suggestionElem.removeEventListener('mousedown', addSuggestion);
        }

    });
}
