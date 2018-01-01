(function($){
    $.extend($.fn,{
        xfyTips:function(options){
            var defaut = {
                content:'',
                callBack:null
            };
            var options = $.extend({},defaut,options);
            return $(this).each(function(){

                $('.xfy-tips').remove();
                var $obj = $('<div class="xfy-tips jrm-tips-in"><span>'+options.content+'</span></div>').appendTo('body');
//

                $obj.one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {
                    $(this).remove();
                    options.callBack && options.callBack();

                });
            });
        }
    })
})(Zepto);



