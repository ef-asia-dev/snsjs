var util = {
	
	$ : function(el) {
		return document.querySelector(el);
	},
	hasClass :function (el, className) {
		return el.classList ? el.classList.contains(className) : new RegExp('(^| )' + className + '( |$)', 'gi').test(el.className);
	},
	addClass:function (el, className) {
		if (el.classList) {
			el.classList.add(className);
			} else {
			el.className += ' ' + className;
		}
	},
	removeClass:function (el, className) {
		if (el.classList) {
			el.classList.remove(className);
			} else {
			el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
		}
	},
	closest:function (el, clazz) {
        while ('.'+el.className != clazz) {
            el = el.parentNode;
            if (!el) {
                return false;
			}
		}
        return el;
	}
	
};

var $sns = {
	
	//For sharing the site
	site: {
		getUrl: function(){return window.location.href.split('?')[0];},
		getTitle: function(){
			var titleList = document.querySelectorAll('title');
			return titleList[titleList.length-1].innerHTML;
		},
		getDesc: function(){return util.$('meta[property="og:description"]').getAttribute('content');},
		getImage: function(){return util.$('meta[property="og:image"]').getAttribute('content');},
		links:{
			whatsapp: "",
			facebook: "",
			twitter: "",
			weibo: "",
			qzone: "",
			wechat: "",
			line: "",
			kakaotalk : "",
			kakaostory : "",
			email: ""
		}
	},
	//For sharing the result
	result: {
		getUrl: function(){return window.location.href.split('?')[0].replace('#/', '');}, //Remove the ng route
		getTitle: function(){return "Please implement getTitle()!";},
		getDesc: function(){return "Please implement getDesc()!";},
		getImage: function(){return "Please implement getImage()!";},
		links:{
			whatsapp: "",
			facebook: "",
			twitter: "",
			weibo: "",
			qzone: "",
			wechat: "",
			line: "",
			kakaotalk : "",
			kakaostory : "",
			email: ""
		}
	},
	settings:{
		disableFB: false,
		keys: {
			facebook: {appId : "0"},
			kakaotalk: {k_app_id : "b1c55c1999cae48477cd951993e35c6d", k_app_name : "EF Destination"}
		},
		selectors: {
			sns:{
				whatsapp: ".icon-ef-whatsapp",
				facebook: ".icon-ef-facebook",
				twitter: ".icon-ef-twitter",
				weibo: ".icon-ef-weibo",
				qzone: ".icon-ef-qzone",
				wechat: ".icon-ef-wechat",
				line: ".icon-ef-LINE",
				kakaotalk : ".icon-ef-kakaotalk",
				kakaostory : ".icon-ef-kakaostory",
				email: ".icon-ef-email"
			},
			share:{
				site : ".share-site",
				result : ".share-result"
			},
			device:{
				desktop:"desktop",
				mobile: "mobile",
				wrapper : "body"
			}
		},
		blacklist: {
			we : [],
			hk : [ "qzone", "wechat","kakaotalk", "kakaostory"],
			cn : ["whatsapp","facebook","twitter", "line", "kakaotalk", "kakaostory"],
			tw : ["whatsapp", "weibo", "qzone", "wechat", "kakaotalk", "kakaostory"],
			jp : ["whatsapp","kakaotalk", "kakaostory","weibo", "qzone", "wechat"],
			kr : ["whatsapp","weibo", "qzone", "wechat"],
			id : ["weibo", "qzone", "wechat","kakaotalk", "kakaostory"],
			vn : ["weibo", "qzone", "wechat","kakaotalk", "kakaostory"],
			th : ["weibo", "qzone", "wechat","kakaotalk", "kakaostory"]
		}
	},
	endpoints:{
		whatsapp: "whatsapp://send?text={t}%20{u}",
		facebook: "http://www.facebook.com/sharer.php?u={u}&t={t}",
		twitter: "http://twitter.com/share?text={t}&url={u}",
		weibo: "http://service.weibo.com/share/share.php?type=button&language=zh_cn&title={t}&url={u}&pic={i}&searchPic=false&style=simple&content=utf-8",
		qzone: "http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url={u}&title={t}&pics={i}&summary={d}",
		wechat: "http://efcampaigns.cn/share/wechat.php?link={u}&imgUrl={i}&desc={d}&t={t}",
		line: "http://line.naver.jp/R/msg/text/?{t}",
		kakaotalk : "http://media.ef.com/Campaign/2015/YourEnglishPersonality/frontend/share-kakaotalk.html?post={u}&imageurl={i}&desc={d}&title={t}&key={key}",
		kakaostory : "https://story.kakao.com/s/share?url={u}&text={d}",
		email: "mailto:?subject={t}&body={u}"
	},
	loaded : false,
	init: function(){
		//singleton
		if(this.loaded){
			alert('singleton');
		return;}
		
		if (this.mobilecheck()) {
			var wraps = document.querySelectorAll(this.settings.selectors.device.wrapper);
			for (var i = 0; i < wraps.length; i++) {
				util.addClass(wraps[i], this.settings.selectors.device.mobile);
			}
			} else {
			var wraps = document.querySelectorAll(this.settings.selectors.device.wrapper);
			for (var i = 0; i < wraps.length; i++) {
				util.addClass(wraps[i], this.settings.selectors.device.desktop);
			}
		}
		this.hideElement();
		
		if( ! (util.hasClass(util.$('body'), 'mkt-cn')) && !this.settings.disableFB ){
			this.loadFbAPI();
			}else{
		}
		
		//Fix popup block
		var obj = this.settings.selectors.sns;
		for (var prop in obj) {
			if (obj.hasOwnProperty(prop)) {
				if(prop == "email"){continue;}
				var elem = document.querySelectorAll(obj[prop]);
				for (var i = 0; i < elem.length; i++) {
					elem[i].setAttribute('target', '_blank');
				}
			}
		}
		
		this.buildLink();
		this.bindLink();
		this.bindAction();
		
		this.loaded = true;
	},
	buildLink: function() {
		var obj = this.settings.selectors.sns;
		for (var key in obj) {
			if (obj.hasOwnProperty(key)) {
				var _this = this;
				if( key == "facebook"){
					_this['site']['links'][key] = _this['endpoints'][key].replace('{u}', encodeURIComponent(_this.site.getUrl())).replace('{t}', encodeURIComponent(_this.site.getTitle()+" "+_this.site.getDesc()));
					_this['result']['links'][key] = "javascript:void(0);";
				}
				if( key == "whatsapp"){
					_this['site']['links'][key] = _this['endpoints'][key].replace('{u}', encodeURIComponent(_this.site.getDesc() + " " + _this.site.getUrl())).replace('{t}', encodeURIComponent(_this.site.getTitle()));
					_this['result']['links'][key] = _this['endpoints'][key].replace('{u}', encodeURIComponent(_this.result.getDesc() + " " + _this.result.getUrl())).replace('{t}', encodeURIComponent(_this.result.getTitle()));
				}
				if( key == "twitter"){
					_this['site']['links'][key] = _this['endpoints'][key].replace('{u}', encodeURIComponent(_this.site.getUrl())).replace('{t}', encodeURIComponent(_this.site.getTitle()+" "+_this.site.getDesc()));
					_this['result']['links'][key] = _this['endpoints'][key].replace('{u}', encodeURIComponent(_this.result.getUrl())).replace('{t}', encodeURIComponent(_this.result.getTitle()+" "+_this.result.getDesc()));
				}
				if( key == "line"){
					_this['site']['links'][key] = _this['endpoints'][key].replace('{t}', encodeURIComponent(_this.site.getTitle()+" "+_this.site.getDesc()) + encodeURI(" ") + encodeURIComponent(_this.site.getUrl()));
					_this['result']['links'][key] = _this['endpoints'][key].replace('{t}', encodeURIComponent(_this.result.getTitle()+" "+_this.result.getDesc()) + encodeURI(" ") + encodeURIComponent(_this.result.getUrl()));
				}
				if( key == "kakaotalk"){
					_this['site']['links'][key] = _this['endpoints'][key].replace('{d}', encodeURIComponent(_this.site.getTitle()+" "+_this.site.getDesc()) + encodeURI(" ") + encodeURIComponent(_this.site.getUrl())).replace('{t}', encodeURIComponent(_this.site.getTitle())).replace('{key}', _this.settings.keys.kakaotalk.k_app_id);
					_this['result']['links'][key] = _this['endpoints'][key].replace('{d}', encodeURIComponent(_this.result.getTitle()+" "+_this.result.getDesc()) + encodeURI(" ") + encodeURIComponent(_this.result.getUrl())).replace('{t}', encodeURIComponent(_this.result.getTitle())).replace('{key}', _this.settings.keys.kakaotalk.k_app_id);
				}
				if( key == "kakaostory"){
					_this['site']['links'][key] = _this['endpoints'][key].replace('{u}', encodeURIComponent(_this.site.getUrl())).replace('{t}', encodeURIComponent(_this.site.getTitle())).replace('{i}', encodeURIComponent(_this.site.getImage())).replace('{d}', encodeURIComponent(_this.site.getTitle()+" "+_this.site.getDesc()));
					_this['result']['links'][key] = _this['endpoints'][key].replace('{u}', encodeURIComponent(_this.result.getUrl())).replace('{t}', encodeURIComponent(_this.result.getTitle())).replace('{i}', encodeURIComponent(_this.result.getImage())).replace('{d}', encodeURIComponent(_this.result.getTitle()+" "+_this.result.getDesc()));
				}
				if( key == "weibo"){
					_this['site']['links'][key] = _this['endpoints'][key].replace('{u}', encodeURIComponent(_this.site.getUrl())).replace('{t}', encodeURIComponent(_this.site.getTitle()+" "+_this.site.getDesc())).replace('{i}', encodeURIComponent(_this.site.getImage()));
					_this['result']['links'][key] = _this['endpoints'][key].replace('{u}', encodeURIComponent(_this.result.getUrl())).replace('{t}', encodeURIComponent(_this.result.getTitle()+" "+_this.result.getDesc())).replace('{i}', encodeURIComponent(_this.result.getImage()));
				}
				if( key == "qzone"){
					_this['site']['links'][key] = _this['endpoints'][key].replace('{u}', encodeURIComponent(_this.site.getUrl())).replace('{t}', encodeURIComponent(_this.site.getTitle())).replace('{i}', encodeURIComponent(_this.site.getImage())).replace('{d}', _this.site.getDesc());
					_this['result']['links'][key] = _this['endpoints'][key].replace('{u}', encodeURIComponent(_this.result.getUrl())).replace('{t}', encodeURIComponent(_this.result.getTitle())).replace('{i}', encodeURIComponent(_this.result.getImage())).replace('{d}', _this.result.getDesc());
				}
				if( key == "wechat"){
					_this['site']['links'][key] = _this['endpoints'][key].replace('{u}', encodeURIComponent(_this.site.getUrl())).replace('{t}', encodeURIComponent(_this.site.getTitle())).replace('{i}', encodeURIComponent(_this.site.getImage())).replace('{d}', _this.site.getDesc());
					_this['result']['links'][key] = _this['endpoints'][key].replace('{u}', encodeURIComponent(_this.result.getUrl())).replace('{t}', encodeURIComponent(_this.result.getTitle())).replace('{i}', encodeURIComponent(_this.result.getImage())).replace('{d}', _this.result.getDesc());
				}
				if( key == "email"){
					_this['site']['links'][key] = _this['endpoints'][key].replace('{u}', encodeURIComponent( _this.site.getDesc() + " " + _this.site.getUrl())).replace('{t}', encodeURIComponent(_this.site.getTitle()));
					_this['result']['links'][key] = _this['endpoints'][key].replace('{u}', encodeURIComponent( _this.result.getDesc() + " " + _this.result.getUrl())).replace('{t}', encodeURIComponent(_this.result.getTitle()));
				}
			}
		}
	},
	bindLink: function(){
		var _this = this;
		var obj = this.settings.selectors.sns;
		
		//Share Site
		for (var key in obj) {
			if (obj.hasOwnProperty(key)) {
				var sel =  _this['settings']['selectors']['share']['site'] +" "+_this['settings']['selectors']['sns'][key];
				var _list = document.querySelectorAll(sel);
				for (var i = 0; i < _list.length; i++) {
					if( _list[i] !== null){
						_list[i].href = _this['site']['links'][key];
					}
				}
				
			}
		}
		
		//Share Result
		for (var key in obj) {
			if (obj.hasOwnProperty(key)) {
				var sel =  _this['settings']['selectors']['share']['result'] +" "+_this['settings']['selectors']['sns'][key];
				var _list = document.querySelectorAll(sel);
				for (var i = 0; i < _list.length; i++) {
					if( _list[i] !== null){
						_list[i].href = _this['result']['links'][key];
					}
				}
			}
		}
		
	},
	bindAction: function(){
		var _this = this;
		
		var obj = this.settings.selectors.sns;
		
		for (var key in obj) {
			if (obj.hasOwnProperty(key)) {
				//----
				if (key != "email" && key != "wechat") {
					var elem = document.querySelectorAll(obj[key]);
					for (var i = 0; i < elem.length; i++) {
						elem[i].addEventListener('click', function(e) {
							if (!(e.target.className.indexOf(_this['settings']['selectors']['sns']['facebook'].replace('.', '')) != -1 && util.closest(e.target, _this['settings']['selectors']['share']['result']))) {
								e.preventDefault();
								_this.buildLink();
								_this.bindLink();
								//add target="_blank" to avoid blocking
								window.open(e.target.getAttribute('href'), "mywindow", "menubar=1,resizable=1,width=800,height=570");
							}
						}, false);
					}
				}
			}
		}
		//----
		var _resultFB = document.querySelectorAll(_this['settings']['selectors']['share']['result'] +" "+_this['settings']['selectors']['sns']['facebook']);
		for (var i = 0; i < _resultFB.length; i++) {
			_resultFB[i].addEventListener('click', function (e) {
				e.preventDefault();
                FB.ui({
                    method: 'share_open_graph',
                    action_type: 'og.shares',
                    action_properties: JSON.stringify({
                        object: {
                            'og:url': _this.result.getUrl(),
                            'og:title': _this.result.getTitle(),
                            'og:description': _this.result.getDesc(),
                            'og:image': _this.result.getImage()
                        }
                    })
                },
                function (response) {});
				
			}, false);
		}
		//----
		var _email = document.querySelectorAll(_this['settings']['selectors']['sns']['email']);
		for (var i = 0; i < _email.length; i++) {
			_email[i].addEventListener('click', function (e) {
				_this.buildLink();
				_this.bindLink();	
			}, false);			
		}
		//----
		var _wechat = document.querySelectorAll(_this['settings']['selectors']['sns']['wechat']);
		for (var i = 0; i < _wechat.length; i++) {
			
			_wechat[i].addEventListener('click', function (e) {
				e.preventDefault();
				_this.buildLink();
				_this.bindLink();
				
				var title = "";
				var url = "";
				var img = "";
				
				if( util.closest(this, _this['settings']['selectors']['share']['site']) ){
					title = _this.site.getTitle();
					url = _this.site.getUrl();
					img = _this.site.getImage();
				}
				if( util.closest(this, _this['settings']['selectors']['share']['result']) ){
					title = _this.result.getTitle();
					url = _this.result.getUrl();
					img = _this.result.getImage();
				}
				
				if (_this.mobilecheck()) {
					if (navigator.userAgent.toLowerCase().indexOf("micromessenger") == -1) {
						//browser
						
						} else {
						//weixin
						document.title = title;
						
						if (window.history && window.history.pushState){
							history.pushState("", "", url);
						}
						
						var _img = document.createElement('img');
						_img.src = img;
						_img.style.width = "0px";
						_img.style.height = "0px";
						util.$('body').insertBefore(_img, util.$('body').firstChild);
						
						alert(decodeURI('%E8%AF%B7%E7%82%B9%E5%8F%B3%E4%B8%8A%E8%A7%92%E5%88%86%E4%BA%AB%E5%88%B0%E6%9C%8B%E5%8F%8B%E5%9C%88'));
					}
					}else{
					window.open(this.getAttribute('href'), "mywindow", "menubar=1,resizable=1,width=800,height=570");
				}
				
			}, false);
			
		}
		
	},
	hideElement : function(){
		var _this = this;
		
		//Hide disabled SNS
		//blacklist
		var obj = this.settings.selectors.sns;
		for (var key in obj) {
			if (obj.hasOwnProperty(key)) {
				var mkt = _this.getMarket();
				if(typeof _this['settings']['blacklist'][mkt] === "undefined"){
					_this['settings']['blacklist'][mkt] = [];
				}
				var arr = _this['settings']['blacklist'][mkt];
				
				if( arr.indexOf(key) != -1 ){
					//console.log("Hide "value);
					_this.cssHide(_this['settings']['selectors']['sns'][key]);
				}
			}
		}
		
		//WeChat in Webview : Show only WeChat
		if (_this.isMicromessenger()) {
			
			//Sharing image hack
			var _img = document.createElement('img');
			_img.src = _this.result.getImage();
			_img.style.width = "0px";
			_img.style.height = "0px";
			util.$('body').insertBefore(_img, util.$('body').firstChild);
			
			var obj = this.settings.selectors.sns;
			for (var key in obj) {
				if (obj.hasOwnProperty(key)) {
					if( key != 'wechat'){
						_this.cssHide(_this['settings']['selectors']['sns'][key]);
					}
				}
			}
			
		}
		
		//
		if (_this.mobilecheck()) {
			if ( _this.isMicromessenger() ) {
				//weixin
				
				} else {
				//browser
				_this.cssHide(_this['settings']['selectors']['sns']['wechat']);
			}
			}else{
			//jQuery(this['settings']['selectors']['sns']['wechat']).hide();
			_this.cssHide(_this['settings']['selectors']['sns']['whatsapp']);
			_this.cssHide(_this['settings']['selectors']['sns']['line']);
			_this.cssHide(_this['settings']['selectors']['sns']['kakaotalk']);
		}
		//
		
		
	},
	cssHide : function(ele){
		var css = document.createElement("style");
		css.type = "text/css";
		css.innerHTML = ""+ele+" { display:none !important; }";
		//alert(css.innerHTML);
		if(document.body){
			document.body.appendChild(css);
		}
	},
	device : "",
	mobilecheck : function () {
		if( this.device != ""){
			if( this.device == "mobile"){
				return true ;
			}
			if( this.device == "desktop"){
				return false ;
			}
		}
		var check = false;
		(function (a) { if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true })(navigator.userAgent || navigator.vendor || window.opera);
		
		if(check){
			this.device = "mobile";
			}else{
			this.device = "desktop";
		};
		
		return check;
	},
	isMicromessenger : function(){
		return navigator.userAgent.toLowerCase().indexOf("micromessenger") !== -1;
	},
	getMarket : function(){
		if( typeof util.$('body').getAttribute('class') == "undefined"){
			return "we";
			}else{
			var str = util.$('body').getAttribute('class');
			var re = /mkt-(..)/;
			var found = str.match(re);
			return found[1];
		}
	},
	loadFbAPI : function(){
		var fbrt = document.createElement("div");
		fbrt.setAttribute("id", "fb-root");
		util.$('body').appendChild(fbrt);
		var _this = this;
		window.fbAsyncInit = function() {
			FB.init({
				appId      : _this.settings.keys.facebook.appId,
				xfbml      : true,
				version    : 'v2.9'
			});
		};
		
		(function(d, s, id){
			var js, fjs = d.getElementsByTagName(s)[0];
			if (d.getElementById(id)) {return;}
			js = d.createElement(s); js.id = id;
			js.src = "//connect.facebook.net/en_US/sdk.js";
			fjs.parentNode.insertBefore(js, fjs);
		}(document, 'script', 'facebook-jssdk'));
	}
};
