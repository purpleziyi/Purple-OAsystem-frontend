import http from "./http"

const publishInform = (data) => {
    const path = "/inform/inform"
    return http.post(path, data)
}

const getInformList = (page = 1) => {
    const path = "/inform/inform?page=" + page
    return http.get(path)
}

export default {
    publishInform,
    getInformList
}