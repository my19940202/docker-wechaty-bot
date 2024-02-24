
export function safeParseJSON(str) {
    try {
        let ret = JSON.parse(str);
        if (ret === null) {
            return {};
        }
        return ret;
    } catch (e) {
        return {};
    }
}