<?php
namespace <%= namespace %>\Setup;

use Magento\Framework\Setup\UpgradeSchemaInterface;
use Magento\Framework\Setup\SchemaSetupInterface;
use Magento\Framework\Setup\ModuleContextInterface;

class UpgradeSchema implements UpgradeSchemaInterface
{
    public function upgrade(SchemaSetupInterface $setup, ModuleContextInterface $context)
    {
        $installer = $setup;
        $installer->startSetup();
 //       if (version_compare($context->getVersion(), '1.0.1') < 0) {
 //           $eav_attrib = $installer->getTable('eav_attribute');
 //           $installer->run("UPDATE {$eav_attrib} SET is_required = 1 WHERE attribute_code = 'company';");
 //       }
        $installer->endSetup();
    }
}