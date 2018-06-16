import { foundation } from 'foundation-sites/js/foundation.core';

import 'foundation-sites/js/foundation.util.mediaQuery';
import 'foundation-sites/js/foundation.util.motion';
import 'foundation-sites/js/foundation.util.keyboard';

import 'foundation-sites/js/foundation.accordion';
import 'foundation-sites/js/foundation.interchange';
import 'foundation-sites/js/foundation.responsiveMenu';
import 'foundation-sites/js/foundation.responsiveToggle';

Foundation.Interchange.SPECIAL_QUERIES['medium down'] = 'screen and (max-width: 63.9375em)';


import Apps from './apps';

/**
 * Bootstrap Vue.js application at given Element instance.
 *
 * App properties are passed via data attributes, like:
 *
 * <div class="__vue-root" data-message="Hello" data-app="SomeApp"></div>
 *
 * @param {Element} el DOM Element
 */
function renderVueAppElement(el) {
  const attrs = {...el.dataset};

  if (! attrs.app) {
    console.warn(el, 'Cannot bootstrap: missing data-app');
    return;
  }

  const app = Apps[attrs.app];

  if (! app) {
    console.warn(el, `Cannot bootstrap: unknown app ${attrs.app}`);
    return;
  }

  return app(el, attrs);
}

function init(event) {
  // Initialize Foundation
  $(document).foundation();

  // Initialize Vue.js apps.
  document.querySelectorAll('.__vue-root').forEach(renderVueAppElement);
}

document.addEventListener('DOMContentLoaded', init);
