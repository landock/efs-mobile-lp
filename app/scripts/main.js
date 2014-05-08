//Polyfill for filter
if(!Array.prototype.filter){Array.prototype.filter=function(e){"use strict";if(this===void 0||this===null)throw new TypeError;var t=Object(this);var n=t.length>>>0;if(typeof e!=="function")throw new TypeError;var r=[];var i=arguments.length>=2?arguments[1]:void 0;for(var s=0;s<n;s++){if(s in t){var o=t[s];if(e.call(i,o,s,t))r.push(o)}}return r}}

$('.btn-wells').on('click', function(e) {
    expand(e);
});
$('.btn-link').on('click', function(e) {
    contract(e);
});

$('.wf-accordion').on('hide.bs.collapse show.bs.collapse', function(e) {
    var type = e.type,
    targetLength = e.target.childNodes.length,
    $span = targetLength > 3 ? $('#collapseZero span') : $(e.target).parent().find('a span');
type === 'hide' ? $span.removeClass().addClass('arrow-right') : $span.removeClass().addClass('arrow-down');
});


function expand(e) {
    var hidePanel  = $(e.target).attr('data-off'),
        showPanel = $(e.target).attr('data-on');
    $(hidePanel).removeClass('expand contract').addClass('hide');
    $(showPanel).removeClass('hide').addClass('expand');
}

function contract(e) {
    var hidePanel  = $(e.target).attr('data-off'),
        showPanel = $(e.target).attr('data-on');
    $(hidePanel).toggleClass('hide contract');
    $(showPanel).toggleClass('hide contract');
}
function stateFilter(statesArray, state) {
    var stateArr = statesArray.filter(function(v) {
        return v.state === state;
    });
    return stateArr.sort(function(a,b){
        if (a.schoolName > b.schoolName) {
            return 1;
        }
        if (a.schoolName < b.schoolName) {
            return -1
        }
        return 0;
    })
}
function getSchools(states) {
    var filteredValues = ['','',''],
        a_h = /^[A-H]+/g,
        i_p = /^[I-P]+/g,
        q_z = /^[Q-Z]+/g,
        filterRegexes = [a_h,i_p,q_z];
    for(var i = 0; i < states.length; i++) {
        for( var j = 0; j < filterRegexes.length; j++) {
            var isThis = filterRegexes[j].test(states[i].schoolName);
            if( isThis ) {
                var schoolName = states[i].schoolName;
                filteredValues[j] += '<option>' + schoolName + '</option>';
            } else {
                console.log('error');
            }
        }
    }
    return filteredValues;
}

var filteredSchools = null;
$('.state-pick').on('change', function(e) {
    filterVal = this.value;
    $.ajax({
        url: "scripts/states.json",
        type: "GET",
        dataType: "json"
    })
    .done(function(data) {
        var allStates = data;
        var thisState = stateFilter(allStates, filterVal);
        filteredSchools = getSchools(thisState);
        $('.filter').show();
        $('.school-pick').empty();
        $('.school-pick').append(filteredSchools.join(''));
        console.log(filteredSchools);
    })
    .error(function() {
        console.log('broke');
    })
});
$('.filter').on('click', 'a', function(e) {
    $schoolPick = $('.school-pick');
    filterVal = e.currentTarget.innerHTML;
    if(filterVal === 'All'){
        $schoolPick.empty();
        $schoolPick.append(filteredSchools.join(''));
        $schoolPick.find('option:first').prop('selected',true).prop('selected', false);
    }
    if(filterVal === 'A-H'){
        $schoolPick.empty();
        $schoolPick.append(filteredSchools[0]);
        $schoolPick.find('option:first').prop('selected',true).prop('selected', false);
    }
    if(filterVal === 'I-P'){
        $schoolPick.empty();
        filteredSchools[1] !== '' ? $schoolPick.append(filteredSchools[1]) : $schoolPick.append('<option>No schools available</option>') ;
        $schoolPick.find('option:first').prop('selected',true).prop('selected', false);
    }
    if(filterVal === 'Q-Z'){
        $schoolPick.empty();
        filteredSchools[2] !== '' ? $schoolPick.append(filteredSchools[2]) : $schoolPick.append('<option>No schools available</option>') ;
        $schoolPick.find('option:first').prop('selected',true).prop('selected', false);
    }
});
