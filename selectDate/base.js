
/**
 * @ui base
 */
(function(){
	if (typeof($.ui) == 'undefined'){
		$.ui = {};
	}
	(function($,undefined){
		function isPlainObject(obj) {
			return Object.prototype.toString.call(obj) === '[object Object]';
		}

		//从某个元素上读取某个属性
		function parseData( data ) {
			try { // JSON.parse可能报错
				// 当data===null表示，没有此属性
				data = data === 'true' ? true :
					data === 'false' ? false : data === 'null' ? null :

						// 如果是数字类型，则将字符串类型转成数字类型
						+data + '' === data ? +data :
							/(?:\{[\s\S]*\}|\[[\s\S]*\])$/.test( data ) ?
								JSON.parse( data ) : data;
			} catch(ex) {
				data = undefined;
			}

			return data;
		}

		//从DOM节点上获取配置项
		function getDomOptions( el ) {
			var ret = {},
				attrs = el && el.attributes,
				len = attrs && attrs.length,
				key,
				data;

			while (len--) {
				data = attrs[ len ];
				key = data.name;

				if (key.substring(0, 5) !== 'data-') {
					continue;
				}

				key = key.substring( 5 );
				data = parseData( data.value );

				data === undefined || (ret[key] = data);
			}

			return ret;
		}

		//合并对象
		function mergeObj() {
			var args = [].slice.call(arguments),
				i = args.length,
				last;

			while ( i-- ) {
				last = last || args[ i ];
				isPlainObject( args[ i ] ) || args.splice( i, 1 );
			}

			return args.length ?
				$.extend.apply( null, [ true, {} ].concat( args ) ) : last;
			// 深拷贝，options中某项为object时，用例中不能用==判断
		}

		//所有实例唯一id
		$.ui.guid = 0;

		//创建一个类
		function createClass(name,object){
			function klass(el, options) {
				var me = this;
				me.el = $(el).eq(0);
				var opts = me.options = mergeObj(klass.options, getDomOptions(el), options);
				me.name = name.toLowerCase();

				$.ui.guid++;
				me.guid = $.ui.guid;

				//加载组件相应样式

				if (me.options.cssLinkVersion && typeof(seajs) != 'undefined') {
					seajs.use('../../../' + name + '/' + me.options.cssLinkVersion + '/' + name + '.css', function(){
						me.init();
					});
				}else {
					me.init();
				}

				//组件统计
				if (/isdebug=(-\d)*-0/.test(location.search) && window.pageConfig){
					if(window.pageConfig.uiLog){
						window.pageConfig.uiLog.push(me);
					}else{
						window.pageConfig.uiLog = [me];
					}
					console.log(me);
				}

				return me;
			}

			var fn = ['options'];
			for(var i=0;i<fn.length;i++){
				var item = fn[i];
				object[item] && (klass[item] = object[item]);
				delete object[item];
			}

			for(var i in object){
				klass.prototype[i] = object[i];
			}

			return klass;
		}

		//在$.fn上挂组件
		$.ui.fn = function(name){
			var name = name.toLowerCase();
			$.fn[name] = function(opts) {
				var obj;
				$.each(this,function(i,el) {
					obj = new $.ui[name](el,opts);
				});
				return obj;
			};
		};

		/**
		 * 定义一个组件
		 * @methord define
		 */
		$.ui.define = function(name,object) {
			$.ui[name] = createClass(name,object);
			$.ui.fn(name);
		};
	})(Zepto);
})();

/**
 * @new zepto extend
 */

(function(){
	/**
	 * 页面文档和浏览器窗口宽高
	 * @method $.page
	 */
	$.page = function (){};

	/**
	 * 当前页面
	 * $.page.doc()
	 */
	$.page.doc = function(){
		return document.compatMode == 'BackCompat' ? document.body : document.documentElement;
	};

	/**
	 * 浏览器窗口宽
	 * $.page.clientWidth() => value
	 */
	$.page.clientWidth = function(){
		return $.page.doc().clientWidth;
	};

	/**
	 * 浏览器窗口高
	 * $.page.clientHeight() => value
	 */
	$.page.clientHeight = function(){
		return $.page.doc().clientHeight;
	};

	/**
	 * 文档宽
	 * $.page.docWidth() => value
	 */
	$.page.docWidth = function(){
		return Math.max($.page.doc().clientWidth,$.page.doc().scrollWidth);
	};

	/**
	 * 文档高
	 * $.page.docHeight() => value
	 */
	$.page.docHeight = function(){
		return Math.max($.page.doc().clientHeight,$.page.doc().scrollHeight);
	};
})();

/**
 * jrmui base 方法
 */
(function($){
	// var emptyArray = [],
	//   slice = emptyArray.slice;//??
	// $.slice = slice; //??
	//var BODY = 'body';
	//var clickName = $.clickName = 'click';
	// if (window.FastClick) {
	// 	window.FastClick.attach(document.body);
	// }
	// })();

	/**
	 * is系列类型判断
	 * $.isString(object) => boolean
	 * @method $.isString
	 * */
	$.isString = function(obj) {
	  return $.type(obj) === 'string';
	};
	/**
	 * is系列类型判断
	 * $.isBoolean(object) => boolean
	 * @method $.isBoolean
	 * */
	$.isBoolean = function(obj) {
	  return $.type(obj) === 'bool';
	};
	/**
	 * is系列类型判断
	 * $.isNumber(object) => boolean
	 * @method $.isNumber
	 * */
	$.isNumber = function(obj) {
	  return $.type(obj) === 'number';
	};
	/**
	 * is系列类型判断
	 * $.isObject(object) => boolean
	 * @method $.isObject
	 * */
	$.isObject = function(obj) {
	  return $.type(obj) === 'object';
	};
	/**
	 * is系列类型判断
	 * $.isUndefined(object) => boolean
	 * @method $.isUndefined
	 * */
	$.isUndefined = function(obj) {
	  return obj === void 0;
	};
	/**
	 * is系列类型判断
	 * $.isNull(object) => boolean
	 * @method $.isNull
	 * */
	$.isNull = function(obj) {
	  return obj === null;
	};

	var _guid = 0;
	/**
	 * 打标识
	 *$.guid(key) => string
	 *
	 *	$.guid('a') => 'a0'
	 *	$.guid('b') => 'b1'
	 *
	 * @method $.guid
	 * */
	$.guid = function(key) {
	  key = $.toString(key) || '';
	  return key + _guid++;
	};

	/**
	 * 转换成字符串
	 * $.toString(value) => string
	 * @method $.toString
	 * */
	$.toString = function(val) {
	  return (val || $.isNumber(val)) ? String(val) : '';
	};

	/**
	 * 转换成字符串，并过滤特殊字符 过滤 null undefined NaN
	 * $.toSafeString(value) => string
	 * @method $.toSafeString
	 * */
	$.toSafeString = function(val) {
	  val = $.toString(val);
	  if (val) {
	    val = $.trim(val.replace(/null|undefined|NaN/gi, ''));
	  } else {
	    val = '';
	  }
	  return val;
	};

	/**
	 * 转换成小写
	 * $.toLowerCase(string) => string
	 * @method $.toLowerCase
	 * */
	$.toLowerCase = function(val) {
	  val = $.toSafeString(val);
	  return val ? val.toLowerCase() : '';
	};

	/**
	 * 转换成数字
	 *$.toNumber(value) => number
	 * @method $.toNumber
	 * */
	$.toNumber = function(val) {
	  val = Number(val);
	  return isNaN(val) ? 0 : val;
	};

	/**
	 * 空方法 通常用作默认函数
	 * $.emptyFun() => function
	 * @method $.emptyFun
	 * */
	$.emptyFun = function() {};

	/**
	 * 防止使用split时，input不是string类型
	 * $.split(input,split) => array
	 * @method $.split
	 * */
	$.split = function(input, split) {
	  if ($.isString(input)) {
	    return input.split(split);
	  }
	  return [];
	};

	/**
	 * 判断是否相等
	 * js语言的弱类型，类型之间可以隐式转换，造成不必要的麻烦
	 * $.equal(value1,value2) => boolean
	 * @method $.equal
	 * */
	$.equal = function(val1, val2) {
	  return $.toString(val1) === $.toString(val2);
	};

	/**
	 * 对象扩展
	 * 常用于从大对象中抽取出小对象
	 * $.objectExtend(target, source, isString)
	 * target目标对象
	 * source 源对象
	 * isString 是否将所有属性转化字符串
	 * @method $.objectExtend
	 * */
	$.objectExtend = function(target, source, toString) {
	  var key;
	  if (target && source) {
	    for (key in target) {
	      if (false === $.isUndefined(source[key])) {
	        target[key] = toString ? $.toSafeString(source[key]) : source[key];
	      }
	    }
	  }
	};

	/**
	 * 延迟执行器
	 * 常用于UI操作
	 * $.delay(function,[ms])
	 * ms 毫秒
	 * @method $.delay
	 * */
	$.delay = function(func, wait) {
	  var args = [].slice.call(arguments, 2);

	  if (!$.isFunction(func)) {
	    return;
	  }

	  wait = wait || 25;

	  var num = setTimeout(function() {
	    clearTimeout(num);
	    return func.apply(null, args);
	  }, wait);
	};

	/**
	 * 阻止默认事件&阻止冒泡
	 * $.stopEvt(event)
	 * @method $.stopEvt
	 * */
	$.stopEvt = function(evt) {
	  if (evt) {
	    evt.stopPropagation();
	    evt.preventDefault();
	  }
	};

	function _stopScorll(e) {
	  if (e) {
	    e.preventDefault();
	  }
	}
	/**
	 * 禁止滑动
	 * $.stopScorll()
	 * @method $.stopScorll
	 * */
	$.stopScorll = function() {
	  $(document).on('touchmove', _stopScorll);
	};
	/**
	 * 取消禁止滑动
	 * $.enableScroll()
	 * @method $.enableScroll
	 * */
	$.enableScroll = function() {
	  $(document).off('touchmove', _stopScorll);
	};
	/**
	 * 比对app版本
	 * $.compareVersion(a,b) => number
	 *
	 *	$.compareVersion('3.9.3','3.9.2') //1
	 *	$.compareVersion('3.9.3','3.9.3') //0
	 *	$.compareVersion('3.8.3','3.9.2') //-1
	 *
	 * @method $.compareVersion
	 * */
	$.compareVersion = function(a, b) {
	  var as,
	    bs;
	  if (!$.isString(a) || !$.isString(b)) {
	    return null;
	  }

	  if (a === b) {
	    return 0;
	  }

	  as = a.split('.');
	  bs = b.split('.');

	  for (var i = 0; i < as.length; i++) {
	    var x = parseInt(as[i]);
	    if (!bs[i]) {
	      return 1;
	    }
	    var y = parseInt(bs[i]);
	    if (x < y) {
	      return -1;
	    }
	    if (x > y) {
	      return 1;
	    }
	  }
	  return null;
	};

	/*
	 * for $.fn
	 */
	/**
	 * 使按钮类元素不可用
	 * $.disable(selector)
	 * @method $.disable
	 * */
	$.disable = function(selector) {
	  var $this = $(selector);
	  return $this.length && $this.addClass('jrm-disable');
	};
	/**
	 * 使按钮类元素不可用
	 * $object.disable() => $object
	 * @method disable
	 * */
	$.fn.disable = function() {
	  $.disable(this);
	  return this;
	};
	/**
	 * 使按钮类元素可用
	 * $.enable(selector)
	 * @method $.enable
	 * */
	$.enable = function(selector) {
	  var $this = $(selector);
	  return $this.length && $this.removeClass('jrm-disable');
	};
	/**
	 * 使按钮类元素可用
	 * $object.enable() => $object
	 * @method enable
	 * */
	$.fn.enable = function() {
		$.enable(this);
		return this;
	};

	/**
	 * 切换ELement点击状态
	 * $.triggerTapActive(selector,[tapClassName])
	 * @method $.triggerTapActive
	 * */
	$.triggerTapActive = function($this, mode) {
	  var className = mode ? 'jrm-tap-bg' : 'jrm-tap';
	  if (!$this || !$this.length) {
	    return;
	  }

	  if (!$this.hasClass(className)) {
	    $this.addClass(className);

	    $.delay(function() {
	      $this.removeClass(className);
	    }, 150);
	  } else {
	    $this.removeClass(className);
	  }
	};
	/**
	 * 添加点击状态
	 * $.bindTapActive(selector,[context,tapClassName])
	 * @method $.bindTapActive
	 * */
	$.bindTapActive = function(selector, context, mode) {
	  context = context || 'body';
	  $(selector, context).on('click', function() {
	    var $this = $(this),
	      tap = String($this.data('tap'));
	    if (tap !== 'false') {
	      $.triggerTapActive($this, mode);
	    }
	  });
	};
	/**
	 * 切换ELement点击状态
	 * $object.triggerTapActive([tapClassName]) => $object
	 * @method triggerTapActive
	 * */
	$.fn.triggerTapActive = function(mode) {
	  $.triggerTapActive(this, null, mode);
	  return this;
	};
	/**
	 * 添加点击状态
	 * $object.bindTapActive([tapClassName]) => $object
	 * @method bindTapActive
	 * */
	$.fn.bindTapActive = function(mode) {
	  $.bindTapActive(this, null, mode);
	  return this;
	};

	/**
	 * 判断按钮类元素是否可用(根据jrm-disable样式判断)
	 * $.isEnable(selector)
	 * @method $.isEnable
	 * */
	$.isEnable = function(selector) {
	  var $this = $(selector);
	  return $this.length && !$this.hasClass('jrm-disable');
	};
	/**
	 * 判断按钮类元素是否可用(根据jrm-disable样式判断)
	 * $object.isEnable() => $object
	 * @method isEnable
	 * */
	$.fn.isEnable = function() {
	  return $.isEnable(this);
	};

	/**
	 * 防反复提交按钮
	 * $object.safeClick(callback,isStop) => $object
	 * @method safeClick
	 */
	$.fn.safeClick = function(callback, isStop) {
	  if (!$.isFunction(callback)) {
	    return;
	  }

	  return this.on('click', function(evt) {
	    var $this = $(this);
	    if ($this.isEnable()) {
	      $this.disable();

	      if (callback.call($this, evt)) {
	        $this.enable();
	      }
	    }

	    if (isStop) {
	      return $.stopEvt(evt);
	    }
	  });
	};
	/**
	 * 获取链接的指定search值
	 * $.getQuery(key)
	 * @method $.getQuery
	 */
	$.getQuery = function(key) {
	    var reg = new RegExp('(^|&)' + key + '=([^&]*)(&|$)', 'i');
	    var r = window.location.search.substr(1).match(reg);
	    if (r != null) {
	        return decodeURIComponent(r[2]);
	    }
	    return null;
	};
	/**
	 * 获取指定cookie值
	 * $.getCookie(key,[options])
	 * @method $.getCookie
	 */
	$.getCookie = function(key, options) {
	    options = options || {};
	    var result, decode = options.raw ? function(s) {
	        return s;
	    } : decodeURIComponent;
	    return (result = new RegExp('(?:^|; )' + encodeURIComponent(key) + '=([^;]*)').exec(document.cookie)) ? decode(result[1]) : null;
	};
	/**
	 * 设置cookie值, 过期时间单位h
	 * $.setCookie(key,[value,options])
	 * options参数说明
	 * `domain`
	 * `path`
	 * `expires`
	 *
	 *	$.setCookie('test') => 即为删除 test 操作
	 *
	 * @method $.setCookie
	 */
	$.setCookie = function(key, value, options) {
	    options = $.extend({}, {
	        domain: '',
	        path: '/'
	    }, options);
	    if (value === null) {
	        options.expires = -1;
	    }
	    if (typeof options.expires === 'number') {
	        var seconds = options.expires,
	            t = options.expires = new Date();
	        t.setTime(t.getTime() + seconds * 1000 * 60 * 60);
	    }
	    value = '' + value;
	    return (document.cookie = [
	        key, '=',
	        options.raw ? value : value,
	        options.expires ? '; expires=' + options.expires.toUTCString() : '',
	        options.path ? '; path=' + options.path : '',
	        options.domain ? '; domain=' + options.domain : '',
	        options.secure ? '; secure' : ''
	    ].join(''));
	};
	/**
	 * session相关操作
	 * @method $.session
	 */
	var _session = function() {
	    function jsonString(option) {
	        var key = '';
	        var _option = '{';
	        for (key in option) {
	            if (option[key] == null) {
	                _option += '"' + key + '":"",';
	            } else if (typeof option[key] == 'object') {
	                _option += '"' + key + '":' + jsonString(option[key]) + ',';
	            } else {
	                _option += '"' + key + '":"' + option[key] + '",';
	            }
	        }
	        _option = _option.substring(0, _option.length - 1);
	        _option += '}';
	        return _option;
	    };

	    function jsonObject(string) {
	        return string.match(/\{.*\}/) ? JSON.parse(string) : string;
	    };

	    function _oSession() {
				/**
				 * 设置session
				 * $.session.set(key,value);
				 * `value` [string | json]
				 */
	        this.set = function(name, value) {
	            name = $.trim(name);
	            if (sessionStorage) {
	                if (!name) {
	                    return null;
	                } else {
	                    this.remove(name);
	                    if (typeof value == 'object') {
	                        value = jsonString(value);
	                    }
	                    sessionStorage.setItem(name, value || null);
	                    return null;
	                }
	            }
	        };
					/**
					 * 获取ession
					 * $.session.get(key); => JSON|String
					 */
	        this.get = function(name) {
	            name = $.trim(name);
	            if (sessionStorage) {
	                if (!name) {
	                    return null;
	                }
	                if (sessionStorage.getItem(name) == null || sessionStorage.getItem(name) == 'null') {
	                    return null;
	                }
	                return jsonObject(sessionStorage.getItem(name));
	            }
	        };
					/**
					 * 删除ession
					 * $.session.remove(key);
					 */
	        this.remove = function(name) {
	            name = $.trim(name);
	            if (sessionStorage) {
	                if (name.length > 0 && sessionStorage.getItem(name)) {
	                    sessionStorage.removeItem(name);
	                    return null;
	                } else {
	                    return null;
	                }
	            }
	        };
	    };
			return new _oSession();
	};
	$.session = _session();
	$.url = {
	  add: function(url, data) {
	    if (!url || !data) {
	      return url;
	    }

	    var oldParam = this.getQuery(url);

	    if (oldParam && $.isObject(oldParam)) {
	      data = $.extend({}, oldParam, data);
	      url = url.split('?')[0];
	    }

	    data = $.param(data);

	    if (data) {
	      if (url.indexOf('?') > -1) {
	        url += '&' + data;
	      } else {
	        url += '?' + data;
	      }
	    }
	    // console.log(url);
	    return url;
	  },
	  getQuery: function(url) {
	    var query = url || location.search,
	      rst = {};

	    if (query) {
	      query = query.split('?');

	      if (query.length < 2) {
	        return rst;
	      }

	      query = query[1].split('&');
	      if (query && query.length > 0) {
	        $.each(query, function(key, val) {
	          val = val.split('=');
	          if (val && val.length > 1) {
	            rst[val.shift()] = val.join('=');
	          }
	        });
	      }
	    }

	    return rst;
	  },
	  clearCache: function(url, data) {
	    data = data || {};
	    data.t = (new Date()).getTime();
	    return this.add(url, data);
	  },
	  navigation: function(url, data) {
	    data = data || {};

	    url = this.add(url, data);

	    $.delay(function() {
	      if ($.loading) {
	        $.loading.hide();
	      }

	      window.location.href = url;
	    }, 200);
	  }
	};

}(Zepto));

/**
 * animation扩展方法
 * @method animationFn
 */
(function($) {
  var transitionEvents = 'webkitTransitionEnd mozTransitionEnd MSTransitionEnd otransitionEnd transitionEnd';
  var animationEvents = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
	/**
	 * animation执行完的回调
	 * $object.animationEnd(callback,[isOne])
	 * animationEnd
	 */
  $.fn.animationEnd = function(callback, isOne) {
    return isOne ? this.one(animationEvents, callback) : this.on(animationEvents, callback);
  };
	/**
	 * transition执行完的回调
	 * $object.transitionEnd(callback,[isOne])
	 * transitionEnd
	 */
  $.fn.transitionEnd = function(callback, isOne) {
    return isOne ? this.one(transitionEvents, callback) : this.on(transitionEvents, callback);
  };
	/**
	 * 取消transition执行完的监听
	 * $object.offTransitionEnd()
	 * offTransitionEnd
	 */
  $.fn.offTransitionEnd = function() {
    return this.off(transitionEvents);
  };
	/**
	 * animation执行完的回调
	 * 动画完成会删除执行的animationClass和 `jrm-animation` class
	 * $object.simpleAnimationEnd(callback)
	 * simpleAnimationEnd
	 */
  $.fn.simpleAnimationEnd = function(cb) {
    return this.animationEnd(function(ele) {
      var cls = ele.animationName,
        $ele;
      $ele = $(ele.currentTarget);

      if (cls) {
        $ele.removeClass(cls);
        $ele.removeClass('jrm-animation');
      }

      if (typeof cb === 'function') {
        cb.call($ele, cls);
      }
    });
  };
	/**
	 * 添加duration时间,支持批量添加
	 * $object.transition(duration) => $object 单位 ms
	 * transition
	 */
  $.fn.transition = function(duration) {
    if (typeof duration !== 'string') {
      duration = duration + 'ms';
    }
    for (var i = 0; i < this.length; i++) {
      var elStyle = this[i].style;
      elStyle.webkitTransitionDuration = elStyle.MsTransitionDuration = elStyle.msTransitionDuration = elStyle.MozTransitionDuration = elStyle.OTransitionDuration = elStyle.transitionDuration = duration;
    }
    return this;
  };
	/**
	 * 添加transform
	 * $object.transform(transform) => $object
	 * transform
	 */
  $.fn.transform = function(transform) {
    for (var i = 0; i < this.length; i++) {
      var elStyle = this[i].style;
      elStyle.webkitTransform = elStyle.MsTransform = elStyle.msTransform = elStyle.MozTransform = elStyle.OTransform = elStyle.transform = transform;
    }
    return this;
  };
}(Zepto));