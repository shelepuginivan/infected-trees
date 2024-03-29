import { Route, Router, Routes } from '@solidjs/router'
import { AxiosError } from 'axios'
import { createSignal, JSX, onMount, Show } from 'solid-js'

import { axiosInstanceUnauthorized } from '../utils/axiosInstanceUnauthorized'
import { HOME_ROUTE, SERVER_HOST } from '../utils/consts'
import { authorizedRoutes, unauthorizedRoutes } from '../utils/routes'
import Header from './Header/Header'
import Redirect from './Redirect'


const AppRouter = (): JSX.Element => {
	const authorized = Boolean(sessionStorage.getItem('accessToken'))
	const [getAuthorized, setAuthorized] = createSignal(authorized)

	onMount(async () => {
		try {
			if (!getAuthorized()) {
				const refreshResponse = await axiosInstanceUnauthorized.get(`${SERVER_HOST}/auth/refresh`)
				const userData = refreshResponse.data
				sessionStorage.setItem('accessToken', userData.accessToken)
				sessionStorage.setItem('fullName', `${userData.user.firstname} ${userData.user.lastname}`)
				sessionStorage.setItem('email', userData.user.email)
				sessionStorage.setItem('hasAPIKey', userData.user.hasAPIKey.toString())
				setAuthorized(true)
			}
		} catch (e) {
			if (e instanceof AxiosError && e.status === 401) {
				setAuthorized(false)
			}
		}

	})

	return (
		<Show when={getAuthorized()} keyed={true} fallback={
			<Router>
				<Routes>
					{unauthorizedRoutes.map(item => <Route path={item.route} component={item.component}/>)}
					<Route path='*' element={<Redirect to={HOME_ROUTE} replace={true}/>}/>
				</Routes>
			</Router>
		}>
			<Router>
				<Header/>
				<Routes>
					{authorizedRoutes.map(item => <Route path={item.route} component={item.component}/>)}
					<Route path='*' element={<Redirect to={HOME_ROUTE} replace={true}/>}/>
				</Routes>
			</Router>
		</Show>
	)
}

export default AppRouter
