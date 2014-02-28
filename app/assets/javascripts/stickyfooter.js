var stickyFooter = function(footer){
    var pos = footer.position();
    var height = $(window).height();
    height = height - pos.top;
    height = height - footer.height();
    if (height > 0) {
        footer.css({
            'margin-top': height + 'px'
        });
    }
}


$(function(){
    $(window).bind("load", function(){
        stickyFooter($('#footer1'));
    })
    $(window).bind("load", function(){
        stickyFooter($('#footer2'));
    })
    $(window).bind("load", function(){
        stickyFooter($('#footer3'));
    })
})