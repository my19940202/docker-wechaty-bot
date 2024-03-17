import request from 'request';
import {systemMap, PLUGIN_API, DEF_MODEL_API} from './constant.js';
import {safeParseJSON} from './safeParseJSON.js';
// token存储到env中，避免暴露
const env = process.env;

export async function baiduBot(content, robotType, systemFromChat) {
    if (content) {
        const access_token = await getAccessToken(robotType);
        const PLUGIN_TYPE = ['LinGaoQiMing', 'NotOnlyMoney', 'DaGongRen'];
        const bodyObj = PLUGIN_TYPE.includes(robotType)
            ? {
                query: content.trim(),
                plugins: robotType !== 'DaGongRen' ? ['uuid-zhishiku'] : undefined,
                verbose: true,
                llm: robotType === 'LinGaoQiMing' ? {max_output_tokens: 400} : undefined
            }
            : {
                messages: [{role: 'user', content}],
                system: systemFromChat || systemMap[robotType] || undefined,
                disable_search: false,
                enable_citation: false
            };

        const options = {
            method: 'POST',
            url: (PLUGIN_API[robotType] || DEF_MODEL_API) + access_token,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(bodyObj)
        };
        console.log('optionsoptions', options.body);
        return new Promise((resolve, reject) => {
            try {
                request(options, (error, response) => {
                    console.log('request', response.body);
                    if (error) {
                        reject({result: '业务繁忙，稍后回复'});
                    }
                    else {
                        const ret = safeParseJSON(response.body);
                        if (ret && ret.result) {
                            if (ret.result.includes('文心一言') && robotType === 'LiuShifu') {
                                resolve({result: '我是刘师傅GPT助手，如果你有任何问题，请随时向我提问。'});
                            }
                            else {
                                resolve(safeParseJSON(response.body));
                            }
                        }
                    }
                })
            } catch (error) {
                reject({result: '业务繁忙，稍后回复'});
            }
        })
    }
}

/**
 * 使用 AK，SK 生成鉴权签名（Access Token）
 * @return string 鉴权签名信息（Access Token）
 */
function getAccessToken(type = 'LiuShifu') {
    const tokenMap = {
        LiuShifu: ['DEF_AK', 'DEF_SK'],
        LinGaoQiMing: ['LINGAO_AK', 'LINGAO_SK'],
        NotOnlyMoney: ['MONEY_AK', 'MONEY_SK'],
        DaGongRen: ['DGR_AK', 'DGR_SK']
    };

    const AK_SK = tokenMap[type] || tokenMap.LiuShifu;
    const options = {
        method: 'POST',
        url: [
            'https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=',
            env[AK_SK[0]],
            '&client_secret=',
            env[AK_SK[1]]
        ].join('')
    };
    

    return new Promise((resolve, reject) => {
        request(options, (error, response) => {
            if (error) { reject(error) }
            else { resolve(JSON.parse(response.body).access_token) }
        })
    })
}
