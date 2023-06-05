import React, { useState, useEffect } from 'react';
import { Form, Button, Col, Row } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import countryData from 'country-data';
import FlagIconFactory from 'react-flag-icon-css';
import Select from 'react-select';
import 'flag-icon-css/css/flag-icon.min.css';
import FormContainer from '../components/FormContainer';
import CheckoutSteps from '../components/CheckoutSteps';
import { saveShippingAddress } from '../actions/cartActions';

const ShippingScreen = ({ history }) => {
  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;

  const [address, setAddress] = useState(shippingAddress.address);
  const [city, setCity] = useState(shippingAddress.city);
  const [postalCode, setPostalCode] = useState(shippingAddress.postalCode);
  const [country, setCountry] = useState(shippingAddress.country);
  const [phoneNumber, setPhoneNumber] = useState(shippingAddress.phoneNumber);
  const [countryCode, setCountryCode] = useState();

  const dispatch = useDispatch();

  const FlagIcon = FlagIconFactory(React, { useCssModules: false });

  useEffect(() => {
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
  }, []);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(saveShippingAddress({ address, city, postalCode, country, phoneNumber: `${countryCode}${phoneNumber}` }));
    history.push('/payment');
  };

  const countryCodes = countryData.callingCountries.all.map((country) => ({
    code: `${country.countryCallingCodes[0]}`,
    alpha2: country.alpha2,
  }));

  countryCodes.map((country) => {
    console.log(country.alpha2.toLowerCase());
  });

  return (
    <FormContainer>
      <CheckoutSteps step1 step2 />
      <h1>Shipping</h1>
      <Form onSubmit={submitHandler}>
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
        {/* Address */}
        <Form.Group controlId="address">
          <Form.Label>Address</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter address"
            value={address}
            required
            onChange={(e) => setAddress(e.target.value)}
          />
        </Form.Group>
        {/* City */}
        <Form.Group controlId="city">
          <Form.Label>City</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter city"
            value={city}
            required
            onChange={(e) => setCity(e.target.value)}
          />
        </Form.Group>
        {/* Postal Code */}
        <Form.Group controlId="postalCode">
          <Form.Label>Postal Code</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter postal code"
            value={postalCode}
            required
            onChange={(e) => setPostalCode(e.target.value)}
          />
        </Form.Group>
        {/* Country */}
        <Form.Group controlId="country">
          <Form.Label>Country</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter country"
            value={country}
            required
            onChange={(e) => setCountry(e.target.value)}
          />
        </Form.Group>
        <Button type="submit" variant="primary">
          Continue
        </Button>
      </Form>
    </FormContainer>
  );
};

export default ShippingScreen;
