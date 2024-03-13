<?php

/**
 * Plugin Name:       Quran Image
 * Plugin URI:        https://github.com/faizshukri/wp-quran
 * Description:       Place any ayah with translation into post
 * Author:            Faiz Shukri
 * Author URI:        https://faizshukri.com
 * Requires at least: 6.1
 * Requires PHP:      7.0
 * Version:           0.1.0
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       wpquran
 *
 * @package           create-block
 */

if (!defined('ABSPATH')) {
	exit; // Exit if accessed directly.
}

/**
 * Registers the block using the metadata loaded from the `block.json` file.
 * Behind the scenes, it registers also all assets so they can be enqueued
 * through the block editor in the corresponding context.
 *
 * @see https://developer.wordpress.org/reference/functions/register_block_type/
 */
function wpquran_wpquran_block_init()
{
	register_block_type(__DIR__ . '/build');
}
add_action('init', 'wpquran_wpquran_block_init');
