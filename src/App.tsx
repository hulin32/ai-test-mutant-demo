import React, { FormEvent, useState } from 'react';

type User = {
  name: string;
  email: string;
}

const UserInfo = () => {
  const [user, setUser] = useState<User | null>(null); // null means not logged in
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Mock login validation
    if (email === 'test@example.com' && password === 'password') {
      setUser({ name: 'John Doe', email }); // Example user info
    } else if (email === '' || password === '') {
      // do nothing
    } else {
      alert('Invalid email or password');
    }
  };

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto', padding: '20px' }}>
      {user ? (
        <div>
          <h2>Welcome, {user.name}!</h2>
          <p>Email: {user.email}</p>
          <button onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <form onSubmit={handleLogin}>
          <h2>Login</h2>
          <div>
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button data-testid="login" type="submit">Login</button>
        </form>
      )}
    </div>
  );
};

export default UserInfo;
