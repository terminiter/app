define(function (require) {
	'use strict';

	var angular = require('angular');

	function Scrolly () {
		return {
			restrict: 'A',
			link: function (scope, element, attrs) {
				var raw = element[0];

				element.bind('scroll', _(lazyScroll).debounce(500));

				function lazyScroll () {
					if (raw.scrollTop + raw.offsetHeight >= raw.scrollHeight - 450) {
						// hack for getting proper scroll scope
						var childScope = angular.element(document.getElementById('scrollyItems')).scope();

						if (!childScope || !childScope.nextPage) {
							return;
						}

						childScope.$apply(attrs.scrolly);
					}
				}
			}
		};
	}

	return Scrolly;
});
