<?php
<%- header %>

namespace <%= namespace %>\Block;
use Magento\Framework\View\Element\Template as Template;
use Magento\Framework\View\Element\Template\Context as Context;

class <%= blockClass %> extends Template {
	
	public function __construct(
        Context $context,
        array $data = []
    ){
        parent::__construct($context, $data);
        //$this->setTemplate('phtml.phtml');
    }
}