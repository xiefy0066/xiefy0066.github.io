/**
 *####弹出层组件####
 *
 ***Demo**
 * [panel](../zui/panel/1.0.0/example/panel.html "Demo")
 *
 ***参数**
 *
 *
 *  - `content`{String} '' 主体html
 *  - `title`{String} '' 主体标题，默认为空
 *
 ***备注**
 *
 *
 ***举例**
 *
 *      $('body').panel({
 *        title: 'title',
 *        content: ''<div>my panel html</div>'
 *      });
 *
 * **update**
 *
 *
 */


(function($){
    $.extend($.fn,{
        xfyPanel:function(options){
            var defaut = {
                title: '',
                content:'',
                callback:null
            };
            var options = $.extend({},defaut,options);
            return $(this).each(function(){
                var htmlpage =`<div class="posi-panel">
                                        <div class="box">
                                            <div class="panel-title xfy-border-1px xfy-border-bottom">${options.title}</div>
                                            <div class="panel-content"><div class="xfy-panel-scroll">${options.content}</div></div>
                                            <div class="close">
                                                <div><img src="../img/panel_close.png" alt=""></div>
                                            </div>
                                        </div>
                                    </div>` ;

                $(this).append(htmlpage);
                $('.posi-panel').show().addClass('panel-show');
//            setTimeout(function () {
//                $('.posi-panel').addClass('panel-show');
//            },10)
                var a = $('.posi-panel').height();
                var b = $('.posi-panel').find('.panel-title').height();
                var c = $('.posi-panel').find('.close').height();
                var d = a-b-c;
                // console.log(a,b,c,d);
                $('.panel-content','.posi-panel').height(d);

                $(this).one('click','.close',function(){
                    $('.posi-panel').removeClass('panel-show');
                    setTimeout(function () {
                        $('.posi-panel').remove();
                        options.callback &&options.callback();


                    },200)



                })

            });
        }
    })
})(Zepto);
