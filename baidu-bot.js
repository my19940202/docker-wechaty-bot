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
                {
                    role: "user",
                    content
                }
            ],
            disable_search: false,
            enable_citation: false
        })

    };
    
    return new Promise((resolve, reject) => {
        request(options, (error, response) => {
            if (error) {
                resolve('不好意思,我不知道');
            }
            else if (response.body && response.body.includes('文心一言')) {
                resolve({result: '我是刘师傅gpt助手，如果你有任何问题，请随时向我提问。'});
            }
            else {
                resolve(JSON.parse(response.body));
            }
        })
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
