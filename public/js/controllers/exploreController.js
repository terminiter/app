define(function () {
	'use strict';

	function ExploreController($scope, $rootScope, $timeout, api, appLoader, $analytics) {
		$analytics.eventTrack('explore opened');

		$rootScope.title = 'Explore collections';
		$scope.list = 'explore';
		$scope.mode;

		getPopularCollections();

		var timer;
		$scope.$watch('searchTags', searching, true);

		function searching(tags) {
			if (timer) {
				$timeout.cancel(timer);
			}

			if (tags) {
				timer = $timeout(function () {
					searchForCollections(tags);
				}, 1000);
			} else {
				getPopularCollections();
			}
		}

		$scope.$on('follow.collection', function (event, collId) {
			var targetList = event.currentScope.searchColls || event.currentScope.colls;
			var targetCollection = _(targetList).find(function (row) {
				return row._id === collId;
			});
			targetCollection.followersCount += 1;
		});

		$scope.$on('unfollow.collection', function (event, collId) {
			var targetList = event.currentScope.searchColls || event.currentScope.colls;
			var targetCollection = _(targetList).find(function (row) {
				return row._id === collId;
			});
			targetCollection.followersCount -= 1;
		});

		function getPopularCollections() {
			appLoader.loading();

			api.query({ resource: 'collections', target: 'explore' }, function (collections) {
				_(collections).each(function (collection) {
					collection.owned = _($rootScope.collections).find(checkMutual);
					function checkMutual(row) {
						return row._id === collection._id;
					}
				});

				$scope.colls = collections;
				$scope.searchColls = null;
				$scope.mode = null;

				appLoader.ready();
			});
		}

		function searchForCollections(searchTags) {
			appLoader.loading();

			$analytics.eventTrack('collections searched');

			api.get({ resource: 'collections', target: 'search', text: searchTags }, function (res) {
				$scope.searchColls = res.data;
				$scope.nextPage = res.nextPage;
				$scope.mode = 'searching';

				appLoader.ready();
			});
		}
	}

	return ExploreController;
});
