export default {
  base_url: 'http://127.0.0.1:3000/',
  endpoints: {
    register: 'register',
    login: 'login',
    getRooms: 'rooms'
  },
  http_request_general_timeout: 10000,
  http_request_search_timeout: 15000,
  table_count_by_page_default: 10
}
