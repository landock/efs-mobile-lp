//Polyfill for filter
if(!Array.prototype.filter){Array.prototype.filter=function(e){"use strict";if(this===void 0||this===null)throw new TypeError;var t=Object(this);var n=t.length>>>0;if(typeof e!=="function")throw new TypeError;var r=[];var i=arguments.length>=2?arguments[1]:void 0;for(var s=0;s<n;s++){if(s in t){var o=t[s];if(e.call(i,o,s,t))r.push(o)}}return r}}

var WF = WF || {};
WF.EFS = (function() {
    var filteredSchools = null
        //declared here so we assign the initial data grab in a globalier scope
        //so we don't have to keep downloading the file
      , allStates = null
      ;

    function expand(e) {
        var hidePanel  = $(e.target).attr('data-off')
          , showPanel = $(e.target).attr('data-on');
        $(hidePanel).removeClass('expand contract').attr('aria-hidden', 'true');
        $(showPanel).removeAttr('aria-hidden').addClass('expand');
    }

    function contract(e) {
        var hidePanel  = $(e.target).attr('data-off')
          , showPanel = $(e.target).attr('data-on');
        $(hidePanel).removeClass('expand contract').attr('aria-hidden', 'true');
        $(showPanel).removeAttr('aria-hidden').addClass('contract');
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
                return -1;
            }
            return 0;
        });
    }

    function getSchools(states) {
        var filteredValues = ['','','']
          , aH = /^[A-H]+/g
          , iP = /^[I-P]+/g
          , qZ = /^[Q-Z]+/g
          , filterRegexes = [aH,iP,qZ]
          ;

        for(var i = 0; i < states.length; i++) {
            for( var j = 0; j < filterRegexes.length; j++) {
                var isThis = filterRegexes[j].test(states[i].schoolName);
                if( isThis ) {
                    var schoolName = states[i].schoolName;
                    filteredValues[j] += '<option>' + schoolName + '</option>';
                }
            }
        }
        return filteredValues;
    }

    function getStates(stateUrl) {
        var stateData = null;
        $.ajax(
            { url: stateUrl
            , type: 'GET'
            , dataType: 'json'
            , async: false
            , success: function(data) {
                stateData = data;
              }
            , error: function(xhr, status, error) {
                console.log(status + ' ' + error);
              }
            }
        );
        return stateData;
    }

    return {
        init: function() {

            allStates = allStates || getStates('scripts/states.js');

            //toggle slide transitions
            $('.btn-wells').on('click', function(e) {
                expand(e);
            });

            $('.btn-link').on('click', function(e) {
                contract(e);
            });

            //Accordion open close
            $('.wf-accordion').on('hide.bs.collapse show.bs.collapse', function(e) {
                console.log(e.target);
                var type = e.type
                  , targetLength = e.target.childNodes.length
                  , $link = targetLength > 3 ? $('#collapseZero') : $(e.target).parent().find('h4 a')
                  , $span = $link.find('span')
                  , label = $link.text()
                  ;
                if(type === 'hide') {
                     $span.removeClass().addClass('arrow-right').attr('aria-label', 'Expand' + label) ;
                    $link.attr('aria-label', 'Expand' + label);
                } else {
                    $span.removeClass().addClass('arrow-down').attr('aria-label', 'Contract' + label) ;
                     $link.attr('aria-label', 'Contract' + label);

                }
            });

            $('.wf-accordion').on('shown.bs.collapse', function(e) {
                var initY = $(e.target).offset().top
                    //168 reprepresents the offset from padding at the top of the page and the element
                  , adjustedY = initY - 168;
                window.scrollTo (0, adjustedY);
            });

            $('.more-legal').click(function() {
                $(this).find('span').toggleClass('arrow-down').toggleClass('arrow-right');
            });

            $('.state-pick').on('change', function() {
                var filterVal = this.value
                  , thisState = stateFilter(allStates, filterVal);
                filteredSchools = getSchools(thisState);
                $('.school-pick-cont').removeAttr('aria-hidden');
                $('.school-pick').empty().append(filteredSchools.join(''));
            });

            $('.filter').on('click', 'button', function(e) {
                var $schoolPick = $('.school-pick')
                  , filterVal = e.currentTarget.innerHTML
                  , defaultMarkup = '<option>No schools available.</option>'
                  , appendInputs = function($target, markup) {
                        $target.empty();
                        markup !== '' ? $target.append(markup) : $target.append(defaultMarkup) ;
                        $target.find('option:first').prop('selected',true).prop('selected', false);
                    }
                  ;

                switch(filterVal) {
                    case 'All':
                        appendInputs($schoolPick, filteredSchools.join(''));
                    break;
                    case 'A-H':
                        appendInputs($schoolPick, filteredSchools[0]);
                    break;
                    case 'I-P':
                        appendInputs($schoolPick, filteredSchools[1]);
                    break;
                    case 'Q-Z':
                        appendInputs($schoolPick, filteredSchools[2]);
                    break;
                }
            });
        }
    };
})();

$(function() {
    $('body').on('animationend webkitAnimationEnd mozAnimationEnd', function() {
        window.scrollTo(0, 0);
    });
    WF.EFS.init();
});
