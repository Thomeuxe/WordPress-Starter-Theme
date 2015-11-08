<?php
/**
 * _tletheme functions and definitions
 *
 * @package _tletheme
 */

/****************************************
Theme Setup
*****************************************/

/**
 * Theme initialization
 */
require get_template_directory() . '/lib/init.php';

/**
 * Custom theme functions definited in /lib/init.php
 */
require get_template_directory() . '/lib/theme-functions.php';

/**
 * Customizer additions.
 */
require get_template_directory() . '/lib/inc/customizer.php';


/****************************************
Custom Post Types
*****************************************/

require get_template_directory() . '/lib/inc/class/CPT.php';
require get_template_directory() . '/lib/theme-cpt.php';

add_action( 'tgmpa_register', 'tle_register_cpt' );

/****************************************
Require Plugins
*****************************************/

require get_template_directory() . '/lib/inc/class/TGM_Plugin_Activation.php';
require get_template_directory() . '/lib/theme-require-plugins.php';

add_action( 'tgmpa_register', 'tle_register_required_plugins' );


/****************************************
Misc Theme Functions
*****************************************/

/**
 * Filter Yoast SEO Metabox Priority
 */
add_filter( 'wpseo_metabox_prio', 'tle_filter_yoast_seo_metabox' );
function tle_filter_yoast_seo_metabox() {
	return 'low';
}
