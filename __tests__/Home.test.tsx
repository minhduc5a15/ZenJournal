import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import Home from '@/app/page'
import { useAuthStore } from '@/store/useAuthStore'

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}))

jest.mock('swr', () => ({
  __esModule: true,
  default: jest.fn().mockReturnValue({
    data: [],
    error: undefined,
    isLoading: false,
    mutate: jest.fn(),
  }),
}))

jest.mock('@/store/useAuthStore')

describe('Home', () => {
  it('renders welcome message when not logged in', () => {
    (useAuthStore as unknown as jest.Mock).mockReturnValue({
        user: null,
    })
    
    render(<Home />)
    
    expect(screen.getByText('Welcome to ZenJournal')).toBeInTheDocument()
  })

  it('renders dashboard when logged in', () => {
     (useAuthStore as unknown as jest.Mock).mockReturnValue({
        user: { _id: '1', name: 'Test User' },
    })
    
    render(<Home />)
    
    expect(screen.getByText('Your thoughts, beautifully organized.')).toBeInTheDocument()
  })
})
