<?php

namespace Kanboard\Model;

use Kanboard\Core\Base;

/**
 * Weixin Model
 *
 * @package  Kanboard\Model
 * @author   Frederic Guillot
 */
class WeixinModel extends Base
{
    /**
     * SQL table name for actions
     *
     * @var string
     */
    const TABLE = 'kb_wechat_user';


    public function getWechatUser($openid)
    {
        return $this->db->table(self::TABLE)->eq('openid', $openid)->findOne();
    }

}
