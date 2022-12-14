/*
 * @Description:
 * @Author: MPC
 * @Date: 2021-08-05 08:38:36
 * @LastEditTime: 2022-03-31 11:18:11
 * @FilePath: \fang_lipt\src\router\index.js
 * El Psy Congroo
 */
import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'

const login = () => import('@/views/Login') //login => require(['@/views/Login.vue'], login)
const forgot = () => import('@/views/Forgot')
const main = () => import('@/views/main')
const index = () => import('@/views/index')
const controlTask = () => import('@/views/internet')
const terminal = () => import('@/views/internet/Terminal')
const seifinSpection = () => import('@/views/internet/SeifinSpection')
const addControl = () => import('@/views/internet/AddControl')
const newTask = () => import('@/views/internet/NewTask')
const messageDetails = () => import('@/views/internet/MessageDetails')
const control = () => import('@/views/internet/Control')
const broadcastindex = () => import('@/views/broadcasting')
const mediaFile = () => import('@/views/broadcasting/MediaFile')
const broadcasttask = () => import('@/views/broadcasting/NewTask')
const videoPreview = () => import('@/views/broadcasting/VideoPreview')
const addUser = () => import('@/views/settings/AddUser')
const settings = () => import('@/views/settings')
const mangeEnvironment = () => import('@/views/settings/MangeEnvironment')
const serverSettings = () => import('@/views/settings/ServerSettings')
const userManagement = () => import('@/views/settings/UserManagement')
const newsDetails = () => import('@/views/disappearing/NewsDetails')
const disappearindex = () => import('@/views/disappearing')
const releaseNews = () => import('@/views/disappearing/ReleaseNews')
const senderList = () => import('@/views/disappearing/SenderList')
const collectionindex = () => import('@/views/collection')
const powerStats = () => import('@/views/collection/PowerStats')
const appointmentindex = () => import('@/views/appointment')
const curriCulum = () => import('@/views/appointment/CurriCulum')
const campuscard = () => import('@/views/campuscard')
const appointmentClassroom = () => import('@/views/appointment/appointmentClassroom')
const reserveClassRoom = () => import('@/views/appointment/reserveClassRoom')
const reserveInfo = () => import('@/views/disappearing/ReserveInfo')

//?????????????????????????????????
const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
	return originalPush.call(this, location).catch(err => err)
}

Vue.use(Router)

const router = new Router({
	// mode: 'history',
	// mode:'hash',
	routes: [
		{
			path: '*',
			redirect: '/main'
		},
		{
			path: '/Login',
			name: 'login',
			component: login,
			meta: { title: '????????????' }
		},

		{
			path: '/Forgot',
			name: 'forgot',
			component: forgot,
			meta: { title: '????????????' }
		},
		{
			path: '/main',
			component: Home,
			children: [
				{
					path: '',
					name: 'main',
					component: main,
					meta: {
						requireAuth: true,
						title: '?????????'
					}
				}
			]
		},
		{
			path: '/index',
			component: Home,
			children: [
				{
					path: '',
					name: 'index',
					component: index,
					meta: {
						requireAuth: true,
						title: '??????'
					}
				}
			]
		},
		{
			path: '/internet',
			component: Home,
			meta: {
				requireAuth: true,
				title: '?????????'
			},
			children: [
				{
					path: 'index',
					name: 'controlTask',
					component: controlTask,
					meta: {
						requireAuth: true,
						title: '????????????'
					}
				},
				{
					path: 'Terminal',
					name: 'terminal',
					component: terminal,
					meta: {
						requireAuth: true,
						title: '????????????'
					}
				},
				{
					path: 'SeifinSpection',
					name: 'seifinSpection',
					component: seifinSpection,
					meta: {
						requireAuth: true,
						title: '????????????'
					}
				},
				{
					path: 'AddControl',
					name: 'addControl',
					component: addControl,
					meta: {
						requireAuth: true,
						title: '????????????'
					}
				},
				{
					path: 'NewTask',
					name: 'newTask',
					component: newTask,
					meta: {
						requireAuth: true,
						title: '??????????????????'
					}
				},
				{
					path: 'MessageDetails',
					name: 'messageDetails',
					component: messageDetails,
					meta: {
						requireAuth: true,
						title: '????????????'
					}
				},
				{
					path: 'Control',
					name: 'control',
					component: control,
					meta: {
						requireAuth: true,
						title: '????????????'
					}
				}
			]
		},
		{
			path: '/broadcasting',
			component: Home,
			meta: {
				requireAuth: true,
				title: '???????????????'
			},
			children: [
				{
					path: 'index',
					name: 'broadcastindex',
					component: broadcastindex,
					meta: {
						requireAuth: true,
						title: '???????????????'
					}
				},
				{
					path: 'MediaFile',
					name: 'mediaFile',
					component: mediaFile,
					meta: {
						requireAuth: true,
						title: '??????????????????'
					}
				},
				{
					path: 'NewTask',
					name: 'broadcasttask',
					component: broadcasttask,
					meta: {
						requireAuth: true,
						title: '?????????????????????'
					}
				},
				{
					path: 'VideoPreview',
					name: 'videoPreview',
					component: videoPreview,
					meta: {
						requireAuth: true,
						title: '????????????'
					}
				}
				// 	,
				// {
				// 	path: 'VoiceBroadcast',
				// 	name: 'VoiceBroadcast',
				// 	component: () =>
				// 		import('@/views/broadcasting/VoiceBroadcast'),
				// 	meta: {
				// 		requireAuth: true,
				// 		title: '????????????'
				// 	}
				// }
			]
		},
		{
			path: '/settings',
			component: Home,
			meta: {
				requireAuth: true,
				title: '????????????'
			},
			children: [
				{
					path: 'AddUser',
					name: 'addUser',
					component: addUser,
					meta: {
						requireAuth: true,
						title: '????????????'
					}
				},
				{
					path: 'index',
					name: 'settings',
					component: settings,
					meta: {
						requireAuth: true,
						title: '????????????'
					}
				},
				{
					path: 'MangeEnvironment',
					name: 'mangeEnvironment',
					component: mangeEnvironment,
					meta: {
						requireAuth: true,
						title: '????????????'
					}
				},
				{
					path: 'ServerSettings',
					name: 'serverSettings',
					component: serverSettings,
					meta: {
						requireAuth: true,
						title: '???????????????'
					}
				},
				{
					path: 'UserManagement',
					name: 'userManagement',
					component: userManagement,
					meta: {
						requireAuth: true,
						title: '????????????'
					}
				}
			]
		},
		{
			path: '/disappearing',
			component: Home,
			meta: {
				requireAuth: true,
				title: '????????????'
			},
			children: [
				{
					path: 'NewsDetails',
					name: 'newsDetails',
					component: newsDetails,
					meta: {
						requireAuth: true,
						title: '????????????'
					}
				},
				{
					path: 'index',
					name: 'disappearindex',
					component: disappearindex,
					meta: {
						requireAuth: true,
						title: '????????????'
					}
				},
				{
					path: 'ReleaseNews',
					name: 'releaseNews',
					component: releaseNews,
					meta: {
						requireAuth: true,
						title: '????????????'
					}
				},
				{
					path: 'SenderList',
					name: 'senderList',
					component: senderList,
					meta: {
						requireAuth: true,
						title: '????????????'
					}
				},
				{
					path: 'reserveInfo',
					name: 'reserveInfo',
					component: reserveInfo,
					meta: {
						requireAuth: true,
						title: '????????????'
					}
				}
			]
		},
		{
			path: '/collection',
			component: Home,
			meta: {
				requireAuth: true,
				title: '????????????'
			},
			children: [
				{
					path: 'index',
					name: 'collectionindex',
					component: collectionindex,
					meta: {
						requireAuth: true,
						title: '????????????'
					}
				},
				{
					path: 'PowerStats',
					name: 'powerStats',
					component: powerStats,
					meta: {
						requireAuth: true,
						title: '????????????'
					}
				}
			]
		},
		{
			path: '/appointment',
			component: Home,
			meta: {
				requireAuth: true,
				title: '????????????'
			},
			children: [
				{
					path: 'index',
					name: 'appointmentindex',
					component: appointmentindex,
					meta: {
						requireAuth: true,
						title: '????????????'
					}
				},
				{
					path: 'CurriCulum',
					name: 'curriCulum',
					component: curriCulum,
					meta: {
						requireAuth: true,
						title: '?????????'
					}
				},
				{
					path: 'appointmentClassroom',
					name: 'appointmentClassroom',
					component: appointmentClassroom,
					meta: {
						requireAuth: true,
						title: '????????????'
					}
				},
				{
					path: 'reserveClassRoom',
					name: 'reserveClassRoom',
					component: reserveClassRoom,
					meta: {
						requireAuth: true,
						title: '????????????'
					}
				}
			]
		},
		{
			path: '/campuscard',
			component: Home,
			meta: {
				requireAuth: true,
				title: '???????????????'
			},
			children: [
				{
					path: 'index',
					name: 'campuscard',
					component: campuscard,
					meta: {
						requireAuth: true,
						title: '????????????'
					}
				}
			]
		}
	]
})

export default router
