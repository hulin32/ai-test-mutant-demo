import '@testing-library/jest-dom/vitest';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import UserInfo from './App';

describe('UserInfo', () => {
  // Mock window.alert
  const alertMock = vi.fn();
  window.alert = alertMock;

  beforeEach(() => {
    // Clear all mocks before each test
    vi.clearAllMocks();
    cleanup();
  });

  describe('Login Form', () => {
    it('renders login form initially', () => {
      render(<UserInfo />);
      
      expect(screen.getByLabelText('Email:')).toBeInTheDocument();
      expect(screen.getByLabelText('Password:')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument();
    });

    it('updates email input value', async () => {
      render(<UserInfo />);
      const emailInput = screen.getByLabelText('Email:');
      
      await userEvent.type(emailInput, 'test@example.com');
      
      expect(emailInput).toHaveValue('test@example.com');
    });

    it('updates password input value', async () => {
      render(<UserInfo />);
      const passwordInput = screen.getByLabelText('Password:');
      
      await userEvent.type(passwordInput, 'password');
      
      expect(passwordInput).toHaveValue('password');
    });

    it('shows alert for invalid credentials', async () => {
      render(<UserInfo />);
      
      await userEvent.type(screen.getByLabelText('Email:'), 'wrong@example.com');
      await userEvent.type(screen.getByLabelText('Password:'), 'wrongpassword');
      
      fireEvent.submit(screen.getByTestId('login'));
      
      expect(alertMock).toHaveBeenCalledWith('Invalid email or password');
    });

    it('requires email and password fields', () => {
      render(<UserInfo />);
      
      const emailInput = screen.getByLabelText('Email:');
      const passwordInput = screen.getByLabelText('Password:');
      
      expect(emailInput).toHaveAttribute('required');
      expect(passwordInput).toHaveAttribute('required');
    });
  });

  describe('Login Success', () => {
    it('shows user info after successful login', async () => {
      render(<UserInfo />);
      
      // Fill in correct credentials
      await userEvent.type(screen.getByLabelText('Email:'), 'test@example.com');
      await userEvent.type(screen.getByLabelText('Password:'), 'password');
      
      // Submit form
      fireEvent.submit(screen.getByRole('button', { name: 'Login' }));
      
      // Check if user info is displayed
        expect(screen.getByText('Welcome, John Doe!')).toBeInTheDocument();
        expect(screen.getByText('Email: test@example.com')).toBeInTheDocument();
    });

    it('displays logout button when logged in', async () => {
      render(<UserInfo />);
      
      // Login
      await userEvent.type(screen.getByLabelText('Email:'), 'test@example.com');
      await userEvent.type(screen.getByLabelText('Password:'), 'password');
      fireEvent.submit(screen.getByRole('button', { name: 'Login' }));
      
      // Check for logout button
        expect(screen.getByRole('button', { name: 'Logout' })).toBeInTheDocument();
    });
  });

  describe('Logout', () => {
    it('returns to login form after logout', async () => {
      render(<UserInfo />);
      
      // Login first
      await userEvent.type(screen.getByLabelText('Email:'), 'test@example.com');
      await userEvent.type(screen.getByLabelText('Password:'), 'password');
      fireEvent.submit(screen.getByRole('button', { name: 'Login' }));
      
      // Wait for logout button and click it
      const logoutButton = screen.getByRole('button', { name: 'Logout' });
      await userEvent.click(logoutButton);
      
      // Check if we're back to login form
      expect(screen.getByLabelText('Email:')).toBeInTheDocument();
      expect(screen.getByLabelText('Password:')).toBeInTheDocument();
    });

    it('clears user data after logout', async () => {
      render(<UserInfo />);
      
      // Login
      await userEvent.type(screen.getByLabelText('Email:'), 'test@example.com');
      await userEvent.type(screen.getByLabelText('Password:'), 'password');
      fireEvent.submit(screen.getByRole('button', { name: 'Login' }));
      
      // Logout
      const logoutButton = screen.getByRole('button', { name: 'Logout' });
      await userEvent.click(logoutButton);
      
      // Verify user info is not displayed
      expect(screen.queryByText('Welcome, John Doe!')).not.toBeInTheDocument();
      expect(screen.queryByText('Email: test@example.com')).not.toBeInTheDocument();
    });
  });

  describe('Form Validation', () => {
    it('validates email format', async () => {
      render(<UserInfo />);
      const emailInput = screen.getByLabelText('Email:');
      
      await userEvent.type(emailInput, 'invalid-email');
      
      // Email input should have validation error
      expect(emailInput).toBeInvalid();
    });

    it('prevents form submission with empty fields', async () => {
      render(<UserInfo />);
      
      fireEvent.submit(screen.getByTestId('login'));
      
      // Alert should not be called as form validation prevents submission
      expect(alertMock).not.toHaveBeenCalled();
    });
  });

  describe('Edge Cases', () => {
    it('handles whitespace in email and password', async () => {
      render(<UserInfo />);
      
      await userEvent.type(screen.getByLabelText('Email:'), ' test@example.com ');
      await userEvent.type(screen.getByLabelText('Password:'), ' password ');
      
      fireEvent.submit(screen.getByRole('button', { name: 'Login' }));
      
      expect(alertMock).toHaveBeenCalledWith('Invalid email or password');
    });

    it('maintains form state after failed login attempt', async () => {
      render(<UserInfo />);
      
      await userEvent.type(screen.getByLabelText('Email:'), 'wrong@example.com');
      await userEvent.type(screen.getByLabelText('Password:'), 'wrongpassword');
      
      fireEvent.submit(screen.getByRole('button', { name: 'Login' }));
      
      expect(screen.getByLabelText('Email:')).toHaveValue('wrong@example.com');
      expect(screen.getByLabelText('Password:')).toHaveValue('wrongpassword');
    });
  });
});