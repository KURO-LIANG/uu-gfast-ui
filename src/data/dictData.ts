const dictData = {
    // 是否禁用
    'disabled': [
        {label: '启用', value: 0, type: 'primary'},
        {label: '禁用', value: 1, type: 'info'}
    ],
    // 是否启用
    'enabled': [
        {label: '禁用', value: 0, type: 'info'},
        {label: '启用', value: 1, type: 'primary'}
    ],
    // 商品状态 0-已下架，1-已上架
    'productState': [
        {label: '已下架', value: 0, type: 'warning'},
        {label: '已上架', value: 1, type: 'success'}
    ],
    'bannerType':[
        {label: '车主志', value: 0, type: 'info'},
        {label: '话题', value: 1, type: 'info'},
        {label: '周刊', value: 2, type: 'info'},
        {label: '登录页', value: 3, type: 'info'},
    ],
    'articleType':[
        {label: '车主故事', value: 0, type: 'info'},
        {label: 'HIGH玩记忆', value: 1, type: 'info'},
        {label: '媒体说', value: 2, type: 'info'},
    ],
    'examineList':[
        {label: '已驳回', value: -1, type: 'danger'},
        {label: '待审核', value: 0, type: 'warning'},
        {label: '已通过', value: 1, type: 'success'},
    ],
    // 配置类型 0-关于我们，1-用户隐私协议，2-签到奖励积分，3-点赞奖励积分，4-评论奖励积分，5-转发奖励积分
    'sourceType':[
        {label: '关于我们', value: 0},
        {label: '用户隐私协议', value: 1},
    ],
    // 配置类型 积分来源 0-签到，1-点赞，2-评论，3-转发，4-发布畅聊，5-畅聊互动
    'scoreSourceType':[
        {label: '签到', value: 0},
        {label: '点赞', value: 1},
        {label: '评论', value: 2},
        {label: '转发', value: 3},
        {label: '发布畅聊', value: 4},
        {label: '畅聊互动', value: 5},
    ],
    // 订单状态 0-待发货，1-已发货，2-已签收，3-已确认
    'orderStatus':[
        {label: '待发货', value: 0, type: 'info'},
        {label: '已发货', value: 1, type: 'success'},
        {label: '已签收', value: 2, type: 'success'},
        {label: '已确认', value: 3, type: 'success'},
    ],
    // 快递公司
    'expressCode':[
        {"label": "顺丰速运", "value": "SF"},
        {"label": "百世快递", "value": "HTKY"},
        {"label": "中通快递", "value": "ZTO"},
        {"label": "圆通速递", "value": "YTO"},
        {"label": "韵达快递", "value": "YD"},
        {"label": "天天快递", "value": "HHTT"},
        {"label": "EMS快递", "value": "EMS"},
        {"label": "德邦快递", "value": "DBL"},
        {"label": "申通快递", "value": "STO"},
        {"label": "京东物流", "value": "JD"},
        {"label": "宅急送", "value": "ZJS"},
        {"label": "邮政包裹", "value": "YZPY"},
        {"label": "全峰快递", "value": "QFKD"},
        {"label": "快捷快递", "value": "FAST"},
        {"label": "优速快递", "value": "UC"}
    ],
};

export default dictData;
