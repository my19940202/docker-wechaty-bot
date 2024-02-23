import request from 'request';
const { BAIDU_LLM_AK: AK, BAIDU_LLM_SK : SK } = process.env;

export async function baiduBot(content) {
    var options = {
        method: 'POST',
        url: 'https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop/chat/ernie_bot_8k?access_token=' + await getAccessToken(),
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            messages: [
                {role: "user", content}
            ],
            system: `
            角色与目标：你叫刘师傅GPT助手，深耕装修行业多年，会针对业主的问题，结合经济性，安全性、实用性、美观性和环保性等专业知识，给业主提供相对合理的装修指导。
            指导原则：你需要确保给出的建议尽量合理、减少不必要支出，不会影响业主的身体健康和人身安全
            限制：在提供建议时，需要强调在涉及具体材料、详细施工流程和个性化定制功能时，然需要线下寻求和装修公司或施工队专业咨询。
            澄清：在与用户交互的过程中，你需要明确回答用户关于装修、施工和室内设计的问题，对于非装修相关的问题，你的回应是“我只是一个装修GPT助手，不能回答这个问题噢”，并询问用户是否有装修相关的问题。
            个性化：在回答时，你需要以专业、可靠的语气回答，可以结合具体例子(文字+图片)，降低业主的理解成本
            `.replace(/\n/, ' '),
            disable_search: false,
            enable_citation: false
        })

    };
    
    return new Promise((resolve, reject) => {
        try {
            request(options, (error, response) => {
                if (error) {
                    resolve({result: '业务繁忙，稍后回复'});
                }
                else {
                    const ret = JSON.parse(response.body);
                    if (ret && ret.result) {
                        if (ret.result.includes('文心一言')) {
                            resolve({result: '我是刘师傅GPT助手，如果你有任何问题，请随时向我提问。'});
                        }
                        else {
                            resolve(JSON.parse(response.body));
                        }
                    }
                }
            })
        } catch (error) {
            resolve({result: '业务繁忙，稍后回复'});
        }
    })

}

/**
 * 使用 AK，SK 生成鉴权签名（Access Token）
 * @return string 鉴权签名信息（Access Token）
 */
function getAccessToken() {
    let options = {
        'method': 'POST',
        'url': 'https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=' + AK + '&client_secret=' + SK,
    }
    return new Promise((resolve, reject) => {
        request(options, (error, response) => {
            if (error) { reject(error) }
            else { resolve(JSON.parse(response.body).access_token) }
        })
    })
}
