/**
 *####弹出层组件####
 *
 ***Demo**
 * [tips](../zui/selectdate/1.0.0/example/selectdate.html "Demo")
 *
 ***参数**
 *
 *  - `data` {String} null 默认选中日期，默认选中第一项
 *  - `min` {Date} '1900/01/01' 最小可选时间  时间戳
 *  - `max` {Date} 'new Date()' 最大可选时间  时间戳
 *  - `default` {String} 'null' 输入的文案
 *  - `separator` {String} '-' 分割符
 *  - `text` {String} '请选择日期' 输入的文案
 *  - `type` {Number} '3' 类型  1（选日子），3 三栏选时间
 *  - `tipText` {String} '' 当type=1时的文案
 *  - `callBack` {function} 'null' 回调会回传当前选中值
 *
 ***备注**
 *
 *
 ***举例**
 *
 *      $('#demo').selectdate(options);
 *
 * **update**
 *
 * 2016-12-20 11:00:00
 */

;
(function($) {
    $.ui.define('selectdate', {
        options: {
            cssLinkVersion: '1.0.0',
            data: null,
            min: '1900/01/01',
            max: null,
            default: null,
            separator: '-',
            text: '请选择日期',
            type: 3,
            tipText: '',
            callBack: null
        },
        init: function() {
            console.log(this);
            this.options.dom = this.el;
            // 移动高度
            this.mTop = parseFloat($('body').css('font-size')) * 3.125 || 50;
            // 计算用当前时间[年，月，日]
            this.value = [0, 0, 0];
            this.index = 0;
            this.level = this.options.type || 3;
            this.default = 1;
            var _con = '<div></div><div></div><div></div>';
            (this.options.type == 1 ||  this.options.type == 7)  && (_con = '<div style="width:100%"></div>');
            // 模板html
            this.wrapHtml = $('<section data-action="cancel" class="jrm-select-date"><div class="jrm-select-date-con-n jrm-bg-color-fff"><ul class="jrm-select-date-btns-n jrm-bfc jrm-row jrm-fs32"><li data-action="cancel" class="jrm-pl32 jrm-md-6 jrm-color-666">取消</li><li data-action="submit" class="jrm-pr32 jrm-md-6 jrm-color-508cee" style="text-align:right">确定</li></ul><div class="jrm-select-date-scrollerbox-n jrm-fs36"><div class="jrm-select-date-scroller-n">' + _con + '</div><p class="jrm-border-1px jrm-border-top jrm-border-bottom"></p></div></div></section>');
            // 可选择日期数据盒子
            this.dataBox = this.wrapHtml.find('.jrm-select-date-scroller-n').children();
            var now = new Date();
            // dom对象
            this.obj = typeof this.options.dom === 'object' ? this.options.dom : $(this.options.dom);
            //是否选中第一项0不选中，1选中
            this.default = this.options.default === null ? 1 : 0;
            // this.default = 0;
            // 拿当前时间
            var _val = this.obj.data('val')||this.options.data;
            if (_val && this.options.type == 1) {
                _val += '-0-0';
            }
            if(_val && this.options.type ==7){
                _val = _val.toString();
            }
            this.currentValue = _val || this.options.date;
            // this.default == 1 && (now.getFullYear() + this.options.separator + ('0' + (now.getMonth() + 1)).slice(-2) + this.options.separator + ('0' + (now.getDate())).slice(-2));
            this.value = this.currentValue && this.currentValue.split(this.options.separator) || [0, 0, 0];

            // 最小时间
            this.dMin = new Date(this.options.min);
            // 最大时间
            this.dMax = this.options.max ? new Date(this.options.max) : now;
            //console.log(this.dMin);
            // console.log(this.dMax);
            // console.log(this.obj);
            // 可选择的日期
            this.data = this.getDate();
            // console.log(this.data);
            this.formatHtml(this.data);

            this.bindEvent();
        },
        //获取日期
        getDate: function() {
            var json = [];
            if (this.options.type == 1) {
                for (var i = 1; i <= 28; i++) {
                    json.push({
                        id: i,
                        name: this.options.tipText + i,
                        type: '日',
                    });
                }
            }else if (this.options.type == 7) {
                for (var i = 0; i < this.options.typeContents.length; i++) {
                    json.push({
                        id: i,
                        name: this.options.typeContents[i],
                        type: '',
                    });
                }
            } else {
                for (var s = this.dMin.getFullYear(), l = this.dMax.getFullYear(); s <= l; s++) { //年
                    var obj = {};
                    obj['id'] = obj['name'] = s;
                    obj.type = '年';
                    obj.child = [];
                    for (var m = s == this.dMin.getFullYear() ? this.dMin.getMonth() + 1 : 1; m <= 12; m++) { //月
                        var o = {};
                        o['id'] = o['name'] = ('0' + m).slice(-2);
                        o.type = '月';
                        o.child = [];
                        var days = new Date(s, m, 0).getDate();
                        for (var d = 1; d <= days; d++) { //日
                            var j = {};
                            j['id'] = j['name'] = ('0' + d).slice(-2);
                            j.type = '日';
                            if (!((m == this.dMax.getMonth() + 1 && s == this.dMax.getFullYear() && d > this.dMax.getDate()) || (m == this.dMin.getMonth() + 1 && s == this.dMin.getFullYear() && d < this.dMin.getDate()))) {
                                o.child.push(j);
                            }
                        }
                        if (!(m > this.dMax.getMonth() + 1 && s == this.dMax.getFullYear())) {
                            obj.child.push(o);
                        }
                    }
                    json.push(obj);
                }
            }
            // console.log(json)
            return json;
        },
        bindEvent: function() {
            let _obj = this.wrapHtml.appendTo($('body')).show();
            setTimeout(function() {
                _obj.addClass('jrm-select-date-in');
            }, 30);
            let _this = this;
            _this.dataBox.each(function() {
                this.oldIndex = Math.abs(Math.round($(this).children('dl').attr('po') / _this.mTop));
            });
            _this.wrapHtml.on('touchmove', function(event) {
                if ($(this).is('section')) {
                    event.preventDefault();
                }
            });
            // 点击事件行为
            _this.wrapHtml.on('click', function(e) {
                // console.log(e.target);
                let targetType = $(e.target).data('action');
                switch (targetType) {
                    case 'cancel':
                        _this.wrapHtml.remove();
                        break;
                    case 'submit':
                        let _text = _this.value.join(_this.options.separator);
                        let _val = _text;
                        if (_this.options.type == 1) {
                            _val = _this.value[0];
                            _text = _this.options.tipText + _val + '日';
                        } else if(_this.options.type == 7){
                            var indexString = _this.value[0];
                            _val = _this.value[0];
                            _text = _this.options.typeContents[indexString];
                        }else {
                            for (let i = 0; i < _this.value.length; i++) {
                                if (_this.value[i] == 0) {
                                    _text = _this.options.text;
                                    _val = '';
                                    break;
                                }
                            }
                        }
                        _this.obj.html(_text).data('val', _val);
                        _this.options.callBack && _this.options.callBack(_val);
                        _this.wrapHtml.remove();
                        break;
                }
            });
            let [_start, _end, $oDl] = [0, 0, null];
            let _po = null;
            let _move = function(e) {
                _end = _this.getEventClint(e).y;;
                let _diff = _end - _start;
                let _top = _po + _diff;
                _po = _top;
                $oDl.attr('style', _this.gtePosition(_top));
                _start = _end;
                return false;
            };
            let _fnend = function(e) {
                _end = _this.getEventClint(e).y;;
                let $oDl = $(this).find('dl');
                let $aDd = $oDl.children();
                let i = $(this).index();
                let _top = _po + _end - _start;
                let _du = 300;
                if (_top >= 0) {
                    _top = 0;
                    _du = 300;
                }
                if (_top <= -$oDl.height() + _this.mTop) {
                    _top = -$oDl.height() + _this.mTop;
                    _du = 300;
                }
                let m = Math.round(_top / _this.mTop);
                _top = m * _this.mTop;
                $oDl.attr({
                    'po': _top,
                    'style': _this.gtePosition(_top, _du)
                });
                $aDd.eq(this.oldIndex).removeClass('focus');
                if (_this.options.type == 1 || _this.options.type == 7|| _this.default+m != 0) { //单一选项时不考虑默认选中
                    $aDd.eq(Math.abs(m)).addClass('focus');
                }
                _this.value[i] = $aDd.eq(Math.abs(m)).attr('ref');
                if (_this.options.type == 3) {
                    setTimeout(function() {
                        _this.formatHtml(_this.data);
                    }, _du);
                }
                this.oldIndex = Math.abs(m);
                _this.dataBox.off('touchmove', _move);
                _this.dataBox.off('touchend', _fnend);
                return false;
            };
            _this.dataBox.on('touchstart', function(e) {
                $oDl = $(this).find('dl');
                _start = _this.getEventClint(e).y;
                _po = +$oDl.attr('po');
                _this.dataBox.on('touchmove', _move);
                _this.dataBox.on('touchend', _fnend);
            });
        },
        getEventClint: function(event) {
            switch (event.type) {
                case 'touchstart':
                    return {
                        'x': event.touches[0].clientX,
                        'y': event.touches[0].clientY
                    };
                    break;
                case 'touchend':
                    return {
                        'x': event.changedTouches[0].clientX,
                        'y': event.changedTouches[0].clientY
                    };
                    break;
                case 'touchmove':
                    event.preventDefault();
                    return {
                        'x': event.changedTouches[0].clientX,
                        'y': event.changedTouches[0].clientY
                    };
                    break;
            }
        },
        formatHtml: function(data) {
            let [_this, _top, item = [], childrenData] = [this, 0, data];
            let _html = '<dl po="{{po}}" style="{{position}}"><dd ref="0">--</dd>';
            // console.log(item);
            // 排除年列
            if (_this.default == 0 && _this.index != 0 && _this.value[_this.index - 1] == 0) {
                _this.value[_this.index] = 0;
            } else {
                if (_this.default == 1 && item.length > 0) { //做默认选中去掉--
                    _html = '<dl po="{{po}}" style="{{position}}">';
                    if (!_this.value[_this.index]) {
                        _this.value[_this.index] = item[0].id;
                    }
                }
                for (let j = 0, _len = item.length; j < _len; j++) {
                    let _status = '';
                    let _val = _this.value[_this.index];
                    if (_val == item[j].id) {
                        childrenData = item[j].child;
                        _status = 'class="focus"';
                        _top = -(j - _this.default+1) * _this.mTop;
                    } else if (j == 0 && _val < item[j].id) {
                        childrenData = item[0].child;
                        _status = 'class="focus"';
                        _top = -(j - _this.default+1) * _this.mTop;
                        _this.value[_this.index] = item[j].id;
                    } else if (j == _len - 1 && _val > item[_len - 1].id) {
                        childrenData = item[j].child;
                        _status = 'class="focus"';
                        _top = -(j - _this.default+1) * _this.mTop;
                        _this.value[_this.index] = item[j].id;
                    }
                    _html += '<dd ref="' + item[j].id + '" ' + _status + '>' + item[j].name + item[j].type + '</dd>';
                }
            }
            if (_top == 0 && _this.default == 0) {
                _this.value[_this.index] = 0;
            }
            _html += '</dl>';
            _html = _html.replace('{{position}}', _this.gtePosition(_top)).replace('{{po}}', _top);
            $(_this.dataBox[_this.index]).html(_html);
            // 下一次
            _this.index++;
            if(_this.level==7){
                _this.index = 0;
                return;
            }
            if (_this.index == _this.level) {
                _this.index = 0;
                return;
            }
            _this.formatHtml(childrenData);
        },
        gtePosition: function(po, du = 0) {
            return '-webkit-transition-timing-function: cubic-bezier(0.1, 0.57, 0.1, 1); -webkit-transition-duration: ' + du + 'ms; -webkit-transform: translate3d(0px, ' + po + 'px,0px);transition-timing-function: cubic-bezier(0.1, 0.57, 0.1, 1); transition-duration: ' + du + 'ms; transform: translate3d(0px, ' + po + 'px,0px);';
        }

    });
})(Zepto);