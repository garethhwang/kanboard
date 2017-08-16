<?php
/**
 * Created by PhpStorm.
 * User: hwang
 * Date: 2017/8/16
 * Time: 15:29
 */
require_once('WeixinCallbackAPI.php');

$wechatObj = new wechatCallbackapi();
if (!isset($_GET['echostr'])) {
    $wechatObj->responseMsg();
}else{
    $wechatObj->valid();
}