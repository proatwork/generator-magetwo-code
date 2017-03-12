<?php
<%- context.header_file %>

namespace <%= context.namespace %>\Block;
use Magento\Framework\View\Element\Template as Template;
use Magento\Framework\View\Element\Template\Context as Context;

class <%= context.default_block %> extends Template {
	/**
	public function __construct(
        Context $context,
        array $data = []
    ){
        parent::__construct($context, $data);
        //$this->setTemplate('phtml.phtml');
    }
    */
	public function getText(){
	    return "Hey! It works!";
    }
}