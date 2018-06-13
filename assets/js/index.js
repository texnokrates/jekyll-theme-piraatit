require('jquery/dist/jquery');

require('foundation-sites/js/foundation.core.js');
require('foundation-sites/js/foundation.util.mediaQuery.js');
require('foundation-sites/js/foundation.util.motion.js');
// require('foundation-sites/js/foundation.util.nest.js');
require('foundation-sites/js/foundation.util.keyboard.js');
// require('foundation-sites/js/foundation.util.triggers.js');

require('foundation-sites/js/foundation.accordion.js');
require('foundation-sites/js/foundation.responsiveMenu.js');
require('foundation-sites/js/foundation.responsiveToggle.js');
// require('foundation-sites/js/foundation.dropdownMenu.js');
// require('foundation-sites/js/foundation.dropdown.js');

function init(event) {
  $(document).foundation();
}

document.addEventListener('DOMContentLoaded', init);
