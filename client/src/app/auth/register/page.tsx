'use client';
import React, { useState } from 'react';
import { gql, useMutation } from '@apollo/client';

const REGISTER_MUTATION = gql`
  mutation Register($registerInput: RegisterInput!) {
    register(registerInput: $registerInput) {
      id
      firstName
      lastName
      email
      createdAt
      updatedAt
    }
  }
`;

const Page = () => {
  const [firstName, setFirstName] = useState('Shahid');
  const [lastName, setLastName] = useState('Shabbir');
  const [email, setEmail] = useState('shahidshabbirse@gmail.com');
  const [password, setPassword] = useState('12345678');

  const [register, { data, loading, error }] = useMutation(REGISTER_MUTATION);

  const formSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await register({
        variables: {
          registerInput: {
            firstName,
            lastName,
            email,
            password,
          },
        },
      });

      console.log('Registration successful:', response.data);
    } catch (err) {
      console.error('Error during registration:', err);
    }
  };

  return (
    <React.Fragment>
      <form onSubmit={formSubmit}>
        <h1>Register</h1>
        <p>Register to create an account</p>
        <input
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          type="text"
          placeholder="First Name"
          required
        />
        <input
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          type="text"
          placeholder="Last Name"
          required
        />
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          placeholder="Email"
          required
        />
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          placeholder="Password"
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>

      {error && <p>Error: {error.message}</p>}
      {data && (
        <p>Registration successful! Welcome, {data.register.firstName}.</p>
      )}
    </React.Fragment>
  );
};

export default Page;
