$sns.settings.keys.facebook.appId = "1551061001870198";
$sns.settings.keys.kakaotalk.k_app_id = "e97a6509d331164e48591e84d86b2b09";
$sns.settings.keys.kakaotalk.k_app_name = "promocode";
$sns.settings.blacklist.kr = ["kakaostory", "whatsapp","weibo", "qzone", "wechat"];

$sns.settings.selectors.share.result = ".share";

$sns.result.getUrl = function(){return window.location.href.split('?')[0].replace('#/', '')+"?redeemcode="+promocode;};
$sns.result.getTitle = function(){return blurb[bs_mkt].sns.title};
$sns.result.getDesc = function(){return blurb[bs_mkt].sns.desc};
$sns.result.getImage = function(){
	if(jQuery('body').hasClass('mkt-cn')){
		return "http://media.ef.com.cn/~/media/efcom/oct/2014/bg.jpg";
	}
	return "http://media.ef.com/~/media/efcom/oct/2014/bg.jpg";
};

$sns.init();