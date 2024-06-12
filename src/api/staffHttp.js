import http from "./http"

const getAllDepartment = () => {
    const path = "/staff/departments"
    return http.get(path)
}

const addStaff = (username, email, password) => {
    const path = "/staff/staff"
    return http.post(path, { username, email, password })
}

export default {
    getAllDepartment,
    addStaff
}