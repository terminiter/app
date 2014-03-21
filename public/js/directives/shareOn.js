define(function (require) {
	'use strict';

	function Share ($window, analytics) {
		return {
			restrict: 'A',
			link: function (scope, elem, attr) {
				var services = {
					facebook: 'http://www.facebook.com/share.php?u=' + (attr.shareOnText || 'https://likeastore.com'),
					twitter: 'http://twitter.com/share?text=' + (attr.shareOnText || 'Just tried @likeastore it helps me to keep my likes and interests in one account!+https://likeastore.com')
				};

				elem.on('click', function () {
					$window.open(services[attr.shareOn], 'Share', 'width=600,height=400,resizable=yes');
					if (attr.shareOnEvent) {
						analytics.track(attr.shareOnEvent, {via: attr.shareOn});
					}
				});
			}
		};
	}

	return Share;
});