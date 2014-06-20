/* To avoid CSS expressions while still supporting IE 7 and IE 6, use this script */
/* The script tag referring to this file must be placed before the ending body tag. */

/* Use conditional comments in order to target IE 7 and older:
	<!--[if lt IE 8]><!-->
	<script src="ie7/ie7.js"></script>
	<!--<![endif]-->
*/

(function() {
	function addIcon(el, entity) {
		var html = el.innerHTML;
		el.innerHTML = '<span style="font-family: \'payment-webfont\'">' + entity + '</span>' + html;
	}
	var icons = {
		'pw-clickandbuy': '&#xe61d;',
		'pw-westernunion': '&#xe61e;',
		'pw-braintree': '&#xe61f;',
		'pw-paysafecard': '&#xe620;',
		'pw-ideal': '&#xe621;',
		'pw-paypal-new': '&#xe622;',
		'pw-skrill': '&#xe61b;',
		'pw-cb': '&#xe61c;',
		'pw-gittip': '&#xe618;',
		'pw-flattr': '&#xe61a;',
		'pw-ripple': '&#xe616;',
		'pw-sofort': '&#xe617;',
		'pw-bitcoin': '&#xe614;',
		'pw-bitcoin-sign': '&#xe615;',
		'pw-diners': '&#xe609;',
		'pw-mastercard': '&#xe602;',
		'pw-trust-e': '&#xe612;',
		'pw-amazon': '&#xe613;',
		'pw-jcb': '&#xe610;',
		'pw-google-wallet': '&#xe611;',
		'pw-stripe': '&#xe60d;',
		'pw-square': '&#xe60e;',
		'pw-ogone': '&#xe60f;',
		'pw-verisign': '&#xe60c;',
		'pw-discover': '&#xe60a;',
		'pw-american-express': '&#xe607;',
		'pw-paypal': '&#xe604;',
		'pw-maestro': '&#xe605;',
		'pw-visa': '&#xe601;',
		'pw-visa-electron': '&#xe606;',
		'pw-postepay': '&#xe608;',
		'pw-cartasi': '&#xe60b;',
		'pw-unionpay': '&#xe603;',
		'pw-ec': '&#xe600;',
		'0': 0
		},
		els = document.getElementsByTagName('*'),
		i, c, el;
	for (i = 0; ; i += 1) {
		el = els[i];
		if(!el) {
			break;
		}
		c = el.className;
		c = c.match(/pw-[^\s'"]+/);
		if (c && icons[c[0]]) {
			addIcon(el, icons[c[0]]);
		}
	}
}());
