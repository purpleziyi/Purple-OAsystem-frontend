import http from "./http"

const getAbsentTypes = () => {
    const path = "/absent/type"
    return http.get(path)
}

const getResponder = () => {
    const path = "/absent/responder"
    return http.get(path)
}

// 发起申请请假
const applyAbsent = (data) => {
    const path = "/absent/absent"
    return http.post(path, data)
}

// obtain your own attendance-info 专门获取自己的考勤信息
const getMyAbsents = (page = 1) => {
    const path = "/absent/absent?who=my&page=" + page
    return http.get(path)
}

const getSubAbsents = (page = 1) => {
    const path = "/absent/absent?who=sub&page=" + page
    return http.get(path)
}

const handleSubAbsent = (absent_id, status, response_content) => {
    const path = "/absent/absent/" + absent_id
    return http.put(path, { status, response_content })
}

export default {
    getAbsentTypes,
    getResponder,
    applyAbsent,
    getMyAbsents,
    getSubAbsents,
    handleSubAbsent
}