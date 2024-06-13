import http from "./http"

const getAllDepartment = () => {
    const path = "/staff/departments"
    return http.get(path)
}

const addStaff = (username, email, password) => {
    const path = "/staff/staff"
    return http.post(path, { username, email, password })
}

const getStaffList = (page = 1, size = 10) => {
    const path = `/staff/staff?page=${page}&size=${size}`
    return http.get(path)
}

export default {
    getAllDepartment,
    addStaff,
    getStaffList
}