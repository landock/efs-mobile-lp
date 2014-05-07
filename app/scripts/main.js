/*$('.search-button button, .push .btn-link').click(function(e) {*/
  //$('.swap').toggleClass('transitions');
  //$('.push').toggleClass('transitionsTwo');
/*});*/
var schools = {
    california: [
        {
            name: "Pepperdine"
        },
        {
            name: "Biola"
        },
        {
            name: "UCLA"
        },
        {
            name: "USC"
        },
        {
            name: "Stanford"
        }
    ],
    utah: []
}
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

//$('.next').click(function() {
    //$('.push').removeClass('transitionsTwo');
  //$('.listed').toggleClass('transitionsTwo');
/*});*/

function expand(e) {
    console.log(e.target);
    var hidePanel  = $(e.target).attr('data-off'),
        showPanel = $(e.target).attr('data-on');
    $(hidePanel).removeClass('expand contract').addClass('hide');
    $(showPanel).removeClass('hide').addClass('expand');
}

function contract(e) {
    console.log(e.target);
    var hidePanel  = $(e.target).attr('data-off'),
        showPanel = $(e.target).attr('data-on');
    $(hidePanel).toggleClass('hide contract');
    $(showPanel).toggleClass('hide contract');
}

$('.state-pick').on('change', function(e) {
    $('.school-pick').empty();
    var aToH = '',
        iToP = '',
        qToZ = '',
        all  = '';

    if(schools[this.value].length){
        $('.filter').show();


        $.each(schools[this.value], function(i, v) {

            all += '<option>' + this.name + '</option>';

            if (this.name < 'L') {
                aToH += '<option>' + this.name + '</option>';
                console.log('a to h: ' + aToH);
            }

            if (this.name < 'Q' && this.name > 'H') {
                iToP += '<option>' + this.name + '</option>';
                console.log('i to p: ' + iToP);
            }

            if (this.name > 'P ' && this.name <= 'Z') {
                qToZ += '<option>' + this.name + '</option>';
                console.log('q to z: ' + qToZ);
            }
        });
            $('.school-pick').append(all);
    }else {
        $('.filter').hide();
    }

});
