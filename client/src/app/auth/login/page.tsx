'use client';
import React, { useState } from 'react';
import { gql, useMutation } from '@apollo/client';

const LOGIN_MUTATION = gql`
  mutation Login($loginInput: LoginInput!) {
    login(loginInput: $loginInput) {
      id
      firstName
      lastName
      email
      refreshToken
      createdAt
      updatedAt
    }
  }
`;

const Login = () => {
  const [email, setEmail] = useState('john@example.com');
  const [password, setPassword] = useState('securepassword123');

  const [login, { data, loading, error }] = useMutation(LOGIN_MUTATION);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await login({
        variables: {
          loginInput: {
            email,
            password,
          },
        },
      });

      console.log('Login successful:', response.data);
    } catch (err) {
      console.error('Error during login:', err);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <h1>Login</h1>
        <p>Log in to your account</p>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>

      {error && <p>Error: {error.message}</p>}
      {data && <p>Welcome back, {data.login.firstName}! You are logged in.</p>}
    </div>
  );
};

export default Login;
