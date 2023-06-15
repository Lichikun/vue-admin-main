const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  dictName: state => state.pageSettings.dictName,
  dictId: state => state.pageSettings.dictId
}
export default getters
