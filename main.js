function allowDrop(ev) {
    ev.preventDefault();
}

function drag(ev) {
    ev.dataTransfer.setData('text', ev.target.id);
}

function drop(ev) {
    ev.preventDefault();
    $('li').unhighlight();
    let data = ev.dataTransfer.getData('text');
    let ul = $(`#${data}`).parent().parent();
    if ($(`#${ev.target.id}`).parent().children('ul').length) {
        $(`#${ev.target.id}`).parent().children('ul')[0].append($('#' + data).parent()[0]);
    } else {
        let id = generateUUID();
        $(`#${ev.target.id}`).parent().append(`<ul id='${id}'></ul>`);
        $(`#${id}`).append($(`#${data}`).parent()[0]);
    }
    if (ul.children('li').length === 0) {
        ul.remove();
    }
    updateClass();
    searchAndHighlight();
}

function generateUUID() { // Public Domain/MIT
    let d = new Date().getTime();
    if (typeof performance !== 'undefined' && typeof performance.now === 'function') {
        d += performance.now();
        //use high-precision timer if available
        //performance variable from window
        //offsetting the first 13 hex numbers by a hex portion of the timestamp. 
        //That way, even if Math.random is on the same seed, both clients would have to 
        //generate the UUID at the exact same millisecond (or 10,000+ years later) to get 
        //the same UUID:
    }
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        let r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
}

function getLiTagWithTextInSpan(idForLiTag, text, idForSpanTag, style = '') {
    return `<li id ='${idForLiTag}'><span id='${idForSpanTag}' class='${style}' draggable='true' ondragstart='drag(event)' ondragover='allowDrop(event)' ondrop='drop(event)'>${text}</span></li>`;
}

function generateTree(input) {
    let coveringDiv = $('.cover');
    let idForUlTag = generateUUID();
    let idForLiTag = generateUUID();
    let idForSpanTag = generateUUID();
    coveringDiv.append(`<ul id='${idForUlTag}'></ul>`);
    $(`#${idForUlTag}`).append(getLiTagWithTextInSpan(idForLiTag, input.root, idForSpanTag, 'Collapsable root parent'));
    idForUlTag = generateUUID();
    $(`#${idForLiTag}`).append(`<ul id='${idForUlTag}'></ul>`);
    generateNodes(input.data, $(`#${idForUlTag}`));
}

function generateNodes(data, ul) {
    data.forEach((element) => {
        let idForLiTag = generateUUID();
        let idForSpanTag = generateUUID();
        ul.append(getLiTagWithTextInSpan(idForLiTag, element.name, idForSpanTag, 'Collapsable'));
        if (element.children) {
            let idForUlTag = generateUUID();
            $('#' + idForLiTag).append(`<ul id='${idForUlTag}'></ul>`);
            generateNodes(element.children, $('#' + idForUlTag));
        }
    }, this);
}

function updateClass() {
    $('.cover span').map((i, el) => {
        if ($(el).parent().children('ul').length > 0) {
            $(el).removeClass('leaf');
            $(el).addClass('parent');
        } else {
            $(el).removeClass('parent');
            $(el).addClass('leaf');
        }
    });
}

function searchAndHighlight() {
    $('.searchStatus').text('');
    let searchWord = $('.search').val();
    $('li').unhighlight();
    $('li').highlight(searchWord);
    if ($('.highlight').length === 0 && searchWord.length > 0) {
        $('.searchStatus').text('Search text not found');
    }
}