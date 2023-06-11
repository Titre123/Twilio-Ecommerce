import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Form, Button, Row, Col } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import countryData from 'country-data'
import FlagIconFactory from 'react-flag-icon-css'
import Select from 'react-select'
import FormContainer from '../components/FormContainer'
import { register } from '../actions/userActions'

const RegisterScreen = ({ location, history }) => {
	const [name, setName] = useState('')
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [confirmPassword, setConfirmPassword] = useState('')
	const [message, setMessage] = useState(null)
	const [phoneNumber, setPhoneNumber] = useState('');
  	const [countryCode, setCountryCode] = useState('');

	const dispatch = useDispatch()

	const FlagIcon = FlagIconFactory(React, { useCssModules: false });

	// useSelector is to grab what we want from the state
	const userRegister = useSelector((state) => state.userRegister)
	const { loading, error, userInfo } = userRegister

	const redirect = location.search ? location.search.split('=')[1] : '/'

	// make request here upon component load
	useEffect(
		() => {
			const getUserCountryCode = async () => {
				try {
					const response = await fetch('https://ipapi.co/country_calling_code/');
					const countryCode = await response.text();
					setCountryCode(`${countryCode}`);
				} catch (error) {
					console.error('Error fetching user country code:', error);
				}
			};
			getUserCountryCode();
			if (userInfo) {
				history.push(redirect)
			}
		},
		[history, userInfo, redirect] // Dependencies, on change they fire off useEffect
	)

	const submitHandler = (e) => {
		e.preventDefault()
		// Check if passwords match
		if (password !== confirmPassword) {
			setMessage('Passwords do not match')
		} else {
			// Dispatch register
			dispatch(register(name, email, password, `${countryCode}${phoneNumber}`));
		}
	}


	const countryCodes = countryData.callingCountries.all.map((country) => ({
    code: `${country.countryCallingCodes[0]}`,
    alpha2: country.alpha2,
  }));

  countryCodes.map((country) => {
    console.log(country.alpha2.toLowerCase());
  });

	return (
		<FormContainer>
			<h1>Sign Up</h1>
			{/* 
            On error, display message/error
            When loading, display Loading... */}
			{message && <Message variant='danger'>{message}</Message>}
			{error && <Message variant='danger'>{error}</Message>}
			{loading && <Loader />}
			<Form onSubmit={submitHandler}>
				{/* Name */}
				<Form.Group controlId='email'>
					<Form.Label>Name</Form.Label>
					<Form.Control
						type='text'
						placeholder='Enter name'
						value={name}
						onChange={(e) => setName(e.target.value)}
					></Form.Control>
				</Form.Group>
				{/* Email */}
				<Form.Group controlId='email'>
					<Form.Label>Email Address</Form.Label>
					<Form.Control
						type='email'
						placeholder='Enter email'
						value={email}
						onChange={(e) => setEmail(e.target.value)}
					></Form.Control>
				</Form.Group>
				{/* PhoneNumber */}
					<Form.Group controlId="phoneNumber">
					<Form.Label>Phone Number</Form.Label>
					<Row>
						<Col xs={4} sm={3} md={3}>
						<Select
							options={countryCodes.map((country) => ({
							value: country.code,
							label: (
								<div>
								<FlagIcon code={country.alpha2.toLowerCase()} size="lg" />
								</div>
							),
							}))}
							value={{ value: countryCode, label: countryCode }}
							onChange={(selectedOption) => setCountryCode(selectedOption.value)}
							isSearchable={false}
						/>
						</Col>
						<Col xs={8} sm={9} md={9}>
						<Form.Control
							type="tel"
							placeholder="Enter phone number"
							value={phoneNumber}
							required
							onChange={(e) => setPhoneNumber(e.target.value)}
						/>
						</Col>
					</Row>
					</Form.Group>
				{/* Password */}
				<Form.Group controlId='password'>
					<Form.Label>Password</Form.Label>
					<Form.Control
						type='password'
						placeholder='Enter password'
						value={password}
						onChange={(e) => setPassword(e.target.value)}
					></Form.Control>
				</Form.Group>
				{/* Confirm Password */}
				<Form.Group controlId='confirmPassword'>
					<Form.Label>Confirm Password</Form.Label>
					<Form.Control
						type='password'
						placeholder='Confirm password'
						value={confirmPassword}
						onChange={(e) => setConfirmPassword(e.target.value)}
					></Form.Control>
				</Form.Group>
				{/* Button */}
				<Button type='submit' variant='primary'>
					Register
				</Button>
			</Form>
			{/* Register */}
			<Row className='py-3'>
				<Col>
					Have an Account?{' '}
					<Link to={redirect ? `/login?redirect=${redirect}` : '/login'}>
						Login
					</Link>
				</Col>
			</Row>
		</FormContainer>
	)
}

export default RegisterScreen
