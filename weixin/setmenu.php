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
        'name' => json_encode('工程管理助手',JSON_UNESCAPED_UNICODE),
        'url'  => $weixin->oauth2_authorize("m.jinxingjk.com", $scope, $state)
    );

$result = $weixin->create_menu($button);
var_dump($result);
