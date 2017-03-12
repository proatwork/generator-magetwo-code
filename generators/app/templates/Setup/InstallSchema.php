<?php
<%- context.header_file %>

namespace <%= context.namespace %>\Setup;

use Magento\Framework\Setup\InstallSchemaInterface;
use Magento\Framework\Setup\SchemaSetupInterface;
use Magento\Framework\Setup\ModuleContextInterface;

class InstallSchema implements InstallSchemaInterface
{
    public function install(SchemaSetupInterface $setup, ModuleContextInterface $context)
    {
//        $installer = $setup;
//        $installer->startSetup();
//        $eav_attrib = $installer->getTable('eav_attribute');
//        $installer->run("UPDATE {$eav_attrib} SET is_required = 1 WHERE attribute_code = 'company';");
//        $installer->endSetup();
    }
}
