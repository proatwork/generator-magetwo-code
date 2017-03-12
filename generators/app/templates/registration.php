<?php
<%- context.header_file %>
?>
<?php
use \Magento\Framework\Component\ComponentRegistrar;
ComponentRegistrar::register(ComponentRegistrar::MODULE, '<%= context.class_name %>', __DIR__);