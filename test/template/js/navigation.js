/*******************************************************************************
Navigation
*******************************************************************************/
$(document).ready(function () {
    // Logo
    api.content.navigate('#header [name=logo]', 'entity/sample01/');

    // Load Sample 01 on click
    api.content.navigate('#nav-link-sample01', 'entity/sample01/', '#nav-link-sample01');

    // Load Sample 02 on click
    api.content.navigate('#nav-link-sample02', 'entity/menu01/sample02/', '#nav-link-sample02', '#nav-link-menu01');

    // Load Sample 03 on click
    api.content.navigate('#nav-link-sample03', 'entity/menu01/sample03/', '#nav-link-sample03', '#nav-link-menu01');
});