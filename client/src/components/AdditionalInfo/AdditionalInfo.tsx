import { createSignal, JSX, onMount, Show } from 'solid-js'

import ActionButton from '../../ui/ActionButton/ActionButton'
import Container from '../../ui/Container/Container'
import Input from '../../ui/Input/Input'
import SubmitButton from '../../ui/SubmitButton/SubmitButton'
import { axiosInstanceAuthorized } from '../../utils/axiosInstanceAuthorized'
import { SERVER_HOST } from '../../utils/consts'
import { formatDateInput } from '../../utils/formatDateInput'
import { formatDateRequest } from '../../utils/formatDateRequest'
import { interceptor } from '../../utils/interceptor'
import styles from './additionalInfo.module.css'

const AdditionalInfo = (): JSX.Element => {
	const [getIsEditingMode, setIsEditingMode] = createSignal<boolean>(false)
	const [getBirthdate, setBirthdate] = createSignal<string>('')
	const [getOrganizationName, setOrganizationName] = createSignal<string>('')
	const [getPhoneNumber, setPhoneNumber] = createSignal<string>('')

	const getAdditionalInfo = async () => {
		const userResponse = await axiosInstanceAuthorized(sessionStorage.getItem('accessToken') as string).get(`${SERVER_HOST}/users`)
		const { phoneNumber, organization, birthdate } = userResponse.data
		setBirthdate(birthdate ?? '')
		setPhoneNumber(phoneNumber ?? '')
		setOrganizationName(organization ?? '')
	}

	onMount(async () => await interceptor(getAdditionalInfo, sessionStorage.getItem('accessToken') as string))

	const uploadAdditionalInfo = async (): Promise<void> => {
		const additionalData = {
			birthdate: formatDateRequest(getBirthdate()),
			organization: getOrganizationName(),
			phoneNumber: getPhoneNumber()
		}
		const updateResponse = await axiosInstanceAuthorized(sessionStorage.getItem('accessToken') as string).put(`${SERVER_HOST}/users`, additionalData)
		const { organization, phoneNumber, birthdate } = updateResponse.data
		setBirthdate(birthdate)
		setOrganizationName(organization)
		setPhoneNumber(phoneNumber)
	}

	const submit = async () => {
		await interceptor(uploadAdditionalInfo, sessionStorage.getItem('accessToken') as string)
		setIsEditingMode(false)
	}

	return (
		<Show when={getIsEditingMode()} keyed={true} fallback={
			<Container>
				<h2>Дополнительная информация</h2>
				<p class={styles.p}>Дата рождения: {getBirthdate() ?? 'не установлена'}</p>
				<p class={styles.p}>Название организации: {getOrganizationName() ?? 'не установлено'}</p>
				<p class={styles.p}>Телефон: {getPhoneNumber() ?? 'не установлен'}</p>
				<ActionButton onclick={() => setIsEditingMode(true)}>Изменить</ActionButton>
			</Container>
		}>
			<Container>
				<h2>Дополнительная информация</h2>
				<Input placeholder='День рождения' value={formatDateInput(getBirthdate())} onchange={e => setBirthdate((e.target as HTMLInputElement).value)} type='date'/>
				<Input placeholder='Название организации' value={getOrganizationName()} onchange={e => setOrganizationName((e.target as HTMLInputElement).value)}/>
				<Input placeholder='Телефон' value={getPhoneNumber()} onchange={e => setPhoneNumber((e.target as HTMLInputElement).value)} type='tel'/>
				<SubmitButton onclick={submit}>Сохранить изменения</SubmitButton>
			</Container>
		</Show>
	)
}

export default AdditionalInfo
