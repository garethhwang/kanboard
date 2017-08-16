<?php
/**
 * Created by PhpStorm.
 * User: hwang
 * Date: 2017/8/16
 * Time: 15:30
 */
require_once('WeixinAPI.php');

$weixin = new weixinapi();
$scope = "snsapi_userinfo";
$state = "ggzs";

$button = array('type' => "view",
        'name' => "工程管理助手",
        'url'  => $weixin->oauth2_authorize("m.jinxingjk.com", $scope, $state)
    );

$result = $weixin->create_menu($button);
var_dump($result);
