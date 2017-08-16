<?php
/**
 * Created by PhpStorm.
 * User: hwang
 * Date: 2017/8/16
 * Time: 15:29
 */

require_once('config.php');
require_once('WeixinAPI.php');
//require_once('/home/work/www/BeJinXingJK/www/db.php');
//use Kanboard\Core\Base;

class wechatcallbackapi
{
    public function valid()
    {
        $echoStr = $_GET["echostr"];
        if($this->checkSignature()){
            echo $echoStr;
            exit;
        }
    }

    private function checkSignature()
    {
        $signature = $_GET["signature"];
        $timestamp = $_GET["timestamp"];
        $nonce = $_GET["nonce"];
        $token = TOKEN;
        $tmpArr = array($token, $timestamp, $nonce);
        sort($tmpArr);
        $tmpStr = implode($tmpArr);
        $tmpStr = sha1($tmpStr);

        if($tmpStr == $signature){
            return true;
        }else{
            return false;
        }
    }

    public function responseMsg()
    {
        $postStr = $GLOBALS["HTTP_RAW_POST_DATA"];
        if (!empty($postStr)){
            $postObj = simplexml_load_string($postStr, 'SimpleXMLElement', LIBXML_NOCDATA);
            $RX_TYPE = trim($postObj->MsgType);

            switch ($RX_TYPE)
            {
                case "text":
                    $resultStr = $this->receiveText($postObj);
                    break;
                case "image":
                    $resultStr = $this->receiveImage($postObj);
                    break ;
                case "voice":
                    $resultStr = $this->receiveVoice($postObj) ;
                    break;
                case "event":
                    $resultStr = $this->receiveEvent($postObj);
                    break;
                default:
                    $resultStr = "unknow msg type: ".$RX_TYPE;
                    break;
            }

            echo $resultStr;
        }else {
            echo "";
            exit;
        }
    }

    //接收事件消息
    private function receiveEvent($object)
    {
        $content = "";
        $result = "";
        $openid  = $object->FromUserName;

        switch ($object->Event)
        {
            case "subscribe":
                /*$user = $this->db->table(kb_wechat_user::Table)->eq('openid', $openid)->findOne();
                $user = DB::table("wechat_user")->where('openid','=',$openid)->get()->first();
                //$user = $this->WeixinModel->getWechatUser($openid);
                $user = json_decode(json_encode($user),true);
                if(empty($user)){
                    $weixin = new weixinapi();
                    $user_info = $weixin->get_wechat_user($openid);
                    $bool=DB::table("wechat_user")->insert(['subscribe'=>"1", 'openid'=>$user_info["openid"], 'nickname'=>$user_info["nickname"],'sex'=>$user_info["sex"],'city'=>$user_info["city"],'country'=>$user_info["country"],'province'=>$user_info["province"],'wlanguage'=>$user_info["language"],'headimgurl'=>$user_info["headimgurl"],'date_added'=>date('Y-m-d H:i:s',time()+8*3600) ]);
                }*/
                $content = "您好，感谢关注工管助手";
                break;

            case "unsubscribe":
                $content = "取消关注";
                break;
            default:
                $content = "receive a new event: ".$object->Event;
                break;
        }

        if(is_array($content)){
            if (isset($content[0])){
                $result = $this->transmitNews($object, $content);
            }
        }else{
            $result = $this->transmitText($object, $content);
        }

        return $result;
    }

    //接收文本消息
    private function receiveText($object)
    {
        $result = "";
        $keyword = trim($object->Content);
        $content = date("Y-m-d H:i:s",time())."\nOpenID：".$object->FromUserName;

        if(is_array($content)){
            if (isset($content[0])){
                $result = $this->transmitNews($object, $content);
            }
        }else{
            $result = $this->transmitText($object, $content);
        }
        return $result;
    }


    /*
     * 图片消息
     */
    private function receiveImage($postObj){
        return "";
    }

    /*
     * 语音消息
     */
    private function receiveVoice($postObj){
        return "";
    }


    //回复文本消息
    private function transmitText($object, $content)
    {

        if (!isset($content) || empty($content)){
            return "";
        }

        $xmlTpl = "
                <xml>
                <ToUserName><![CDATA[%s]]></ToUserName>
                <FromUserName><![CDATA[%s]]></FromUserName>
                <CreateTime>%s</CreateTime>
                <MsgType><![CDATA[text]]></MsgType>
                <Content><![CDATA[%s]]></Content>
                </xml>";
        $result = sprintf($xmlTpl, $object->FromUserName, $object->ToUserName, time(), $content);

        return $result;
    }

    //回复图文消息
    private function transmitNews($object, $newsArray)
    {
        if(!is_array($newsArray)){
            return "";
        }
        $itemTpl = " <item>
                    <Title><![CDATA[%s]]></Title>
                    <Description><![CDATA[%s]]></Description>
                    <PicUrl><![CDATA[%s]]></PicUrl>
                    <Url><![CDATA[%s]]></Url>
                    </item>";
        $item_str = "";
        foreach ($newsArray as $item){
            $item_str .= sprintf($itemTpl, $item['Title'], $item['Description'], $item['PicUrl'], $item['Url']);
        }
        $xmlTpl = "
                   <xml>
                   <ToUserName><![CDATA[%s]]></ToUserName>
                   <FromUserName><![CDATA[%s]]></FromUserName>
                   <CreateTime>%s</CreateTime>
                   <MsgType><![CDATA[news]]></MsgType>
                   <ArticleCount>%s</ArticleCount>
                   <Articles>$item_str</Articles>
                   </xml>";

        $result = sprintf($xmlTpl, $object->FromUserName, $object->ToUserName, time(), count($newsArray));
        return $result;
    }

}