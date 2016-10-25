$sns.settings.keys.facebook.appId = "1551061001870198";
$sns.settings.keys.kakaotalk.k_app_id = "e97a6509d331164e48591e84d86b2b09";
$sns.settings.keys.kakaotalk.k_app_name = "promocode";
$sns.settings.blacklist.kr = ["kakaostory", "whatsapp","weibo", "qzone", "wechat"];

//$sns.settings.disableFB = true;
$sns.site.getUrl = function(){return window.location.href;};
$sns.site.getTitle = function(){return "Title1"};
$sns.site.getDesc = function(){return "Desc1"};
$sns.site.getImage = function(){
	if(jQuery('body').hasClass('mkt-cn')){
		return "http://media.ef.com.cn/~/media/efcom/oct/2014/bg.jpg";
	}
	return "http://media.ef.com/~/media/efcom/oct/2014/bg.jpg";
};

$sns.result.getUrl = function(){return window.location.href;};
$sns.result.getTitle = function(){return "Title2"};
$sns.result.getDesc = function(){return "Desc2"};
$sns.result.getImage = function(){
	if(jQuery('body').hasClass('mkt-cn')){
		return "http://media.ef.com.cn/~/media/efcom/oct/2014/bg.jpg";
	}
	return "http://media.ef.com/~/media/efcom/oct/2014/bg.jpg";
};

$sns.init();