(function() {
'use strict';

/**
 * Conditionally configure ink bar animations when the
 * tab selection changes. If `mdNoBar` then do not show the
 * bar nor animate.
 */
angular.module('material.components.tabs')
  .directive('mdTabsInkBar', MdTabInkDirective);

function MdTabInkDirective($$rAF) {

  var lastIndex = 0;

  return {
    restrict: 'E',
    require: ['^?mdNoBar', '^mdTabs'],
    link: postLink
  };

  function postLink(scope, element, attr, ctrls) {
    var noBar = ctrls[0],
        tabsCtrl = ctrls[1],
        debouncedUpdateBar = $$rAF.debounce(updateBar);

    if (noBar) return;

    tabsCtrl.inkBarElement = element;

    // We only need this watcher when pagination is disabled - otherwise, $mdTabsPagination will
    // trigger the change for us.
    scope.$watch(tabsCtrl.selectedIndex, debouncedUpdateBar);
    scope.$on('$mdTabsPaginationChanged', debouncedUpdateBar);

    function updateBar() {
      var selected = tabsCtrl.selected();
      var hideInkBar = !selected || tabsCtrl.count() < 2;

      element.css('display', hideInkBar ? 'none' : 'block');

      if (hideInkBar) return;

      if (scope.pagination.tabData) {
        var index = tabsCtrl.indexOf(selected);
        var data = scope.pagination.tabData.tabs[index] || { left: 0, right: 0, width: 0 };
        var right = element.parent().prop('offsetWidth') - data.right;

        element.removeClass('md-transition-left md-transition-right md-no-transition');
        if (lastIndex > index) {
          element.addClass('md-transition-left');
        } else if (lastIndex < index) {
          element.addClass('md-transition-right');
        } else {
          element.addClass('md-no-transition');
        }

        element.css({ left: data.left + 'px', right: right + 'px' });

        lastIndex = index;
      }
    }
  }
}
})();
